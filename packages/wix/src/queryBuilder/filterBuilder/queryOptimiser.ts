const optimisations = [
  optimisedUnaryAnd,
  optimisedEmptyAnd,
  optimisedAndsAsObjects,
  optimisedNestedAnds,
  optimisedNestedOrs,
]

export function queryOptimiser(query) {
  const [newQuery] = fullyOptimised(query)
  console.log(newQuery)
  return newQuery
}

function fullyOptimised(query) {
  if (Array.isArray(query)) {
    return fullyOptimisedArray(query)
  }
  if (
    typeof query === 'object' &&
    query !== null &&
    !instanceOfIgnoredType(query)
  ) {
    return fullyOptimisedObject(query)
  }
  return [query, false]
}

function fullyOptimisedArray(query) {
  const optimisedElements = query.map(fullyOptimised)
  const somethingChanged =
    0 < optimisedElements.filter(([, elementChanged]) => elementChanged).length
  const newElements = optimisedElements.map(([element]) => element)
  return [newElements, somethingChanged]
}

function fullyOptimisedObject(query) {
  const [queryAfterOptimisingEntries, changedStage1] =
    fullEntriesOptimisation(query)
  const [queryAfterFullOptimisation, changedStage2] = fullObjectOptimisation(
    queryAfterOptimisingEntries
  )
  const changed = changedStage1 || changedStage2
  return [queryAfterFullOptimisation, changed]

  function fullObjectOptimisation(query) {
    const updatedQuery = applyFirstOptimisation(query)
    if (!updatedQuery) {
      return [query, false]
    }
    const [finalQuery] = fullyOptimised(updatedQuery)
    return [finalQuery, true]
  }

  function fullEntriesOptimisation(query) {
    const changedEntries = Object.entries(query)
      .map(entryOptimisation)
      .filter(([, , changed]) => changed)
    const newQuery = { ...query, ...entriesAsObject(changedEntries) }
    const changed = !!changedEntries.length
    return [newQuery, changed]
  }

  function entryOptimisation([key, value]) {
    const [newValue, changed] = fullyOptimised(value)
    return [key, newValue, changed]
  }

  function entriesAsObject(entries) {
    return entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  }
}

function applyFirstOptimisation(node) {
  for (const optimisation of optimisations) {
    const newNode = optimisation(node)
    if (newNode) {
      return newNode
    }
  }
}

function optimisedUnaryAnd(node) {
  const args = node.$and
  if (Array.isArray(args) && args.length === 1) {
    return args[0]
  }
}

function optimisedEmptyAnd(node) {
  const args = node.$and
  if (Array.isArray(args) && args.length === 0) {
    return {}
  }
  return null
}

function optimisedAndsAsObjects(node) {
  const args = node.$and
  if (!args) {
    return
  }

  let basicObjects: any[] = []
  let operatorObjects: any[] = []

  args.forEach((arg) => {
    if (isOperator(arg)) {
      operatorObjects = [...operatorObjects, arg]
    } else {
      basicObjects = [...basicObjects, arg]
    }
  })

  if (basicObjects.length <= 1 || haveOverlappingFields(basicObjects)) {
    return
  }
  const combinedBasicObjects = Object.assign({}, ...basicObjects)

  return { $and: [combinedBasicObjects, ...operatorObjects] }

  function isOperator(node) {
    const keys = Object.keys(node)
    return keys.every((name) => name.startsWith('$')) && keys.length > 0
  }

  function haveOverlappingFields(objects) {
    const nonUniqueKeys = objects
      .map((it) => Object.keys(it))
      .reduce((a, b) => [...a, ...b], [])
    const uniqueKeys = unique(nonUniqueKeys)
    return uniqueKeys.length !== nonUniqueKeys.length
  }

  function unique(values) {
    const dict = {}
    values.forEach((v) => (dict[v] = true))
    return Object.keys(dict)
  }
}

function optimisedNestedAnds(node) {
  const args = node.$and
  if (!args) {
    return
  }

  const hasNestedAnds = !!args.find((it) => it.$and)
  if (!hasNestedAnds) {
    return
  }

  const newArgs = args.reduce((result, current) => {
    const and = current.$and
    if (!and) {
      return [...result, current]
    }
    return [...result, ...and]
  }, [])
  return { $and: newArgs }
}

function optimisedNestedOrs(node) {
  const args = node.$or
  if (!args) {
    return
  }

  const hasNestedOrs = !!args.find((it) => it.$or)
  if (!hasNestedOrs) {
    return
  }

  const newArgs = args.reduce((result, current) => {
    const or = current.$or
    if (!or) {
      return [...result, current]
    }
    return [...result, ...or]
  }, [])
  return { $or: newArgs }
}

function instanceOfIgnoredType(obj) {
  return obj instanceof Date
}
