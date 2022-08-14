import {
  typeForDisplay,
  isDate,
  isString,
  isArray,
  isNumber,
  clone,
} from '@wix/wix-data-utils'
import {
  AggregatingValidator,
  messages,
  validationError,
} from '@wix/wix-data-errors'
import { queryOptimiser } from './queryOptimiser'

const filterMixin = (Base: any = class {}) =>
  class extends Base {
    filterTree
    invalidArguments

    constructor(obj: { filterTree?; invalidArguments? } = {}) {
      super(obj)
      this.filterTree = obj.filterTree || { $and: [] }
      this.invalidArguments = obj.invalidArguments || []
    }

    eq(...args) {
      return this._binaryAnd('$eq', '.eq', args)
    }

    ne(...args) {
      return this._binaryAnd('$ne', '.ne', args)
    }

    ge(...args) {
      return this._AndLogicalEquivalence('$gte', '.ge', args)
    }

    gt(...args) {
      return this._AndLogicalEquivalence('$gt', '.gt', args)
    }

    le(...args) {
      return this._AndLogicalEquivalence('$lte', '.le', args)
    }

    lt(...args) {
      return this._AndLogicalEquivalence('$lt', '.lt', args)
    }

    isNotEmpty(field) {
      const [newInvalidArguments, valid] = this._filterValidator('.isNotEmpty')
        .arityIsOne(arguments)
        .validFieldName(field)
        .validateAndAggregate()

      if (valid) {
        return this.ne(field, null)
      }

      return this._copy(this.filterTree, newInvalidArguments)
    }

    isEmpty(field) {
      const [newInvalidArguments, valid] = this._filterValidator('.isEmpty')
        .arityIsOne(arguments)
        .validFieldName(field)
        .validateAndAggregate()

      if (valid) {
        return this.eq(field, null)
      }

      return this._copy(this.filterTree, newInvalidArguments)
    }

    startsWith(...args) {
      return this._AndStringOperand('$startsWith', '.startsWith', args)
    }

    endsWith(...args) {
      return this._AndStringOperand('$endsWith', '.endsWith', args)
    }

    contains(...args) {
      return this._AndStringOperand('$contains', '.contains', args)
    }

    hasSome(...args) {
      return this._AndSetOperand('$hasSome', '.hasSome', args)
    }

    hasAll(...args) {
      return this._AndSetOperand('$hasAll', '.hasAll', args)
    }

    /* eslint no-unused-vars: 0*/

    or(otherQuery) {
      const orQuery = withCollectionNameIfUnset(otherQuery, this.collectionName)
      const [newInvalidArguments, valid] = this._filterValidator('.or')
        .arityIsOne(arguments)
        .isInstanceOfSameClass(orQuery)
        .isForCollection(orQuery, this.collectionName)
        .validateAndAggregate()

      if (valid) {
        const prefix = isEmptyAnd(this.filterTree) ? [] : [this.filterTree]
        return this._copy(
          inAnd({ $or: [...prefix, orQuery.filterTree] }),
          newInvalidArguments.concat(orQuery.invalidArguments)
        )
      } else {
        return this._copy(this.filterTree, newInvalidArguments)
      }
    }

    and(otherQuery) {
      const andQuery = withCollectionNameIfUnset(
        otherQuery,
        this.collectionName
      )
      const [newInvalidArguments, valid] = this._filterValidator('.and')
        .arityIsOne(arguments)
        .isInstanceOfSameClass(andQuery)
        .isForCollection(andQuery, this.collectionName)
        .validateAndAggregate()

      if (valid) {
        const prefix = isEmptyAnd(this.filterTree) ? [] : [this.filterTree]
        return this._copy(
          inAnd(...prefix, andQuery.filterTree),
          newInvalidArguments.concat(andQuery.invalidArguments)
        )
      } else {
        return this._copy(this.filterTree, newInvalidArguments)
      }
    }

    not(otherQuery) {
      const notQuery = withCollectionNameIfUnset(
        otherQuery,
        this.collectionName
      )
      const [newInvalidArguments, valid] = this._filterValidator('.not')
        .arityIsOne(arguments)
        .isInstanceOfSameClass(notQuery)
        .isForCollection(notQuery, this.collectionName)
        .validateAndAggregate()

      if (valid) {
        const newFilterTree = clone(this.filterTree)
        const notClause = { $not: [notQuery.filterTree] }
        const resultingFilter = inAndOptimized(newFilterTree, notClause)

        return this._copy(
          resultingFilter,
          newInvalidArguments.concat(notQuery.invalidArguments)
        )
      } else {
        return this._copy(this.filterTree, newInvalidArguments)
      }
    }

    between(field, rangeStart, rangeEnd) {
      const [newInvalidArguments, valid] = this._filterValidator('.between')
        .arityIsThree(arguments)
        .sameType(rangeStart, rangeEnd)
        .typeIsStringNumberOrDate(rangeStart)
        .typeIsStringNumberOrDate(rangeEnd)
        .validateAndAggregate()

      if (valid) {
        return this.ge(field, rangeStart).lt(field, rangeEnd)
      }

      return this._copy(this.filterTree, newInvalidArguments)
    }

    getFilterModel() {
      if (this.invalidArguments.length > 0) {
        throw validationError(
          messages.filterBuilderInvalid(this.invalidArguments)
        )
      }
      return queryOptimiser(this.filterTree)
    }

    setFilterModel(filterModel) {
      return this._copy(filterModel, [])
    }

    // used only from data binding router internally
    _matchesUrlized(field, operand) {
      const [newInvalidArguments, valid] = this._filterValidator(
        '._matchesUrlized'
      )
        .arityIsTwo(arguments)
        .validFieldName(field)
        .typeIsString(operand)
        .validateAndAggregate()

      if (valid) {
        const newFilterTree = this._makeNewFilter(
          field,
          // @ts-ignore-next-line
          ...createMatchesOrInFilter(operand)
        )
        return this._copy(newFilterTree, newInvalidArguments)
      }

      return this._copy(this.filterTree, newInvalidArguments)
    }

    _binaryAnd(filterOperatorSymbol, operatorName, args) {
      const [field, operand] = Array.prototype.slice.call(args)

      const [newInvalidArguments] = this._filterValidator(operatorName)
        .arityIsTwo(args)
        .validFieldName(field)
        .validateAndAggregate()

      const newFilterTree = this._makeNewFilter(
        field,
        filterOperatorSymbol,
        operand
      )

      return this._copy(newFilterTree, newInvalidArguments)
    }

    _AndLogicalEquivalence(filterOperatorSymbol, operatorName, args) {
      const [field, operand] = Array.prototype.slice.call(args)

      const [newInvalidArguments] = this._filterValidator(operatorName)
        .arityIsTwo(args)
        .validFieldName(field)
        .typeIsStringNumberOrDate(operand)
        .validateAndAggregate()

      const newFilterTree = this._makeNewFilter(
        field,
        filterOperatorSymbol,
        operand
      )
      return this._copy(newFilterTree, newInvalidArguments)
    }

    _AndStringOperand(filterOperatorName, operatorName, args) {
      const [field, operand] = Array.prototype.slice.call(args)

      const [newInvalidArguments] = this._filterValidator(operatorName)
        .arityIsTwo(args)
        .validFieldName(field)
        .typeIsString(operand)
        .validateAndAggregate()

      const newFilterTree = this._makeNewFilter(
        field,
        filterOperatorName,
        operand
      )

      return this._copy(newFilterTree, newInvalidArguments)
    }

    _AndSetOperand(filterOperatorName, operatorName, args) {
      const [field, ...rawOperands] = Array.prototype.slice.call(args)
      const operands = isArray(rawOperands[0]) ? rawOperands[0] : rawOperands

      const [newInvalidArguments] = this._filterValidator(operatorName)
        .arityIsAtLeastTwo(args)
        .validFieldName(field)
        .typeIsStringNumberOrDateForAll(operands)
        .validateAndAggregate()

      const newFilterTree = this._makeNewFilter(
        field,
        filterOperatorName,
        operands
      )
      return this._copy(newFilterTree, newInvalidArguments)
    }

    _makeNewFilter(field, filterOperatorName, operand) {
      const newFilterTree = clone(this.filterTree)

      // filters with 'undefined' value are lost during serialization,
      // e.g. { val: { $ne: undefined } | translates to { val: {} }
      // Replacing 'undefined' with 'null' retains the filter.
      const serializableOperand = operand === undefined ? null : operand
      const newFilter = this._buildFilter(
        field,
        filterOperatorName,
        serializableOperand
      )

      if (isArray(newFilterTree.$and)) {
        newFilterTree.$and.push(newFilter)
        return newFilterTree
      } else {
        const result = isEmptyObject(newFilterTree)
          ? inAnd(newFilter)
          : inAnd(newFilterTree, newFilter)
        return result
      }
    }

    _buildFilter(field, filterOperatorName, operand) {
      if (filterOperatorName !== '$eq') {
        const newFilter = {}
        newFilter[field] = {}
        newFilter[field][filterOperatorName] = this._replaceRefs(operand)
        return newFilter
      } else {
        const newFilter = {}
        newFilter[field] = this._replaceRefs(operand)
        return newFilter
      }
    }

    _replaceRefs(operand) {
      if (isArray(operand)) {
        return operand.map((operand) => this._replaceRefs(operand))
      } else {
        return operand
      }
    }

    _copy(filterTree, invalidArguments) {
      // @ts-ignore-next-line
      return new this.constructor({ ...this, filterTree, invalidArguments })
    }

    _filterValidator(filterOperatorName) {
      return new FilterValidator(
        filterOperatorName,
        this.invalidArguments,
        this.constructor,
        this.constructorName
      )
    }
  }

function createMatchesOrInFilter(operand) {
  if (looksLikeAnInteger(operand)) {
    // eslint-disable-next-line radix
    return ['$in', [operand, Number.parseInt(operand)]]
  } else {
    return [
      '$matches',
      {
        ignoreCase: true,
        spec: createMatchSpec(operand),
      },
    ]
  }

  function looksLikeAnInteger(str) {
    return /^-?[0-9]{1,16}$/.test(str)
  }
}

function createMatchSpec(fieldValue) {
  const literals = fieldValue.split('-')
  const result = []

  for (let i = 0; i < literals.length - 1; i++) {
    appendLiteralSegment(result, literals[i])
    appendAnyOfSegment(result)
  }
  appendLiteralSegment(result, literals[literals.length - 1])

  return result

  function appendLiteralSegment(result, literalValue) {
    if (literalValue.length !== 0) {
      result.push({ type: 'literal', value: literalValue })
    }
  }

  function appendAnyOfSegment(result) {
    result.push({ type: 'anyOf', value: ' \t\n-' })
  }
}

function isConjunctiveFormFilter(filterTree) {
  return isArray(filterTree.$and)
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

function inAnd(...args) {
  return {
    $and: args,
  }
}

function inAndOptimized(...args) {
  return {
    $and: args.reduce(
      (aggr, val) =>
        isConjunctiveFormFilter(val)
          ? aggr.concat(val.$and)
          : aggr.concat([val]),
      []
    ),
  }
}

export class FilterValidator extends AggregatingValidator {
  private ctor
  private constructorName

  constructor(operatorName, previousInvalidArguments, ctor, constructorName) {
    super(previousInvalidArguments)
    this.operatorName = operatorName
    this.ctor = ctor
    this.constructorName = constructorName
  }

  typeIsString(value) {
    return this.addValidation(
      () => isString(value),
      () => messages.filterValidations.typeIsString(this.operatorName, value)
    )
  }

  typeIsStringNumberOrDate(value) {
    return this.addValidation(
      () => isDateStringOrNumber(value),
      () =>
        messages.filterValidations.typeIsStringNumberOrDate(
          this.operatorName,
          value
        )
    )
  }

  sameType(first, second) {
    return this.addValidation(
      () => typeForDisplay(first) === typeForDisplay(second),
      () =>
        messages.filterValidations.sameType(this.operatorName, first, second)
    )
  }

  typeIsStringNumberOrDateForAll(values) {
    return this.addValidation(
      () => values.every(isDateStringOrNumber),
      () =>
        messages.filterValidations.typeIsStringNumberOrDateForAll(
          this.operatorName
        )
    )
  }

  validFieldName(field) {
    return this.addValidation(
      () => isString(field),
      () => messages.filterValidations.validFieldName(this.operatorName, field)
    )
  }

  isInstanceOfSameClass(obj) {
    return this.addValidation(
      () => obj instanceof this.ctor,
      () =>
        messages.filterValidations.isInstanceOfSameClass(
          this.operatorName,
          this.constructorName,
          obj
        )
    )
  }

  isForCollection(otherFilterBuilder, expectedCollectionName) {
    return this.addValidation(
      () => otherFilterBuilder.collectionName === expectedCollectionName,
      () =>
        messages.filterValidations.isForCollection(
          this.operatorName,
          this.constructorName,
          otherFilterBuilder.collectionName
        )
    )
  }
}

function isDateStringOrNumber(value) {
  return isString(value) || isNumber(value) || isDate(value)
}

function withCollectionNameIfUnset(filter, name) {
  if (!filter || !filter.constructor) {
    return filter
  }

  const collectionName = filter.collectionName ? filter.collectionName : name

  return new filter.constructor({ ...filter, collectionName })
}

function isEmptyAnd(node) {
  return node && node.$and && node.$and.length === 0
}

export default filterMixin
