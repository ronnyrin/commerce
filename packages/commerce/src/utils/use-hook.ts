import { useCallback } from 'react'
import { Provider, useCommerce } from '..'
import type { MutationHook, PickRequired, SWRHook } from './types'
import useData from './use-data'

export function useFetcher() {
  const { providerRef, fetcherRef } = useCommerce()
  return providerRef.current.fetcher ?? fetcherRef.current
}

export function useFetcherNew() {
  const { providerRef, fetcherRef } = useCommerce()
  return providerRef.current.fetcherNew ?? fetcherRef.current
}

export function useHook<
  P extends Provider,
  H extends MutationHook<any> | SWRHook<any>
>(fn: (provider: P) => H) {
  const { providerRef } = useCommerce<P>()
  const provider = providerRef.current
  return fn(provider)
}

export function useSWRHook<H extends SWRHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher()
  const fetcherNew = useFetcherNew()

  return hook.useHook({
    useData(ctx) {
      const response = useData(hook, ctx?.input ?? [], fetcher, fetcherNew, ctx?.swrOptions)
      return response
    },
  })
}

export function useMutationHook<H extends MutationHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher()
  const fetcherNew = useFetcherNew()

  return hook.useHook({
    fetch: useCallback(
      ({ input } = {}) => {
        return hook.fetcher({
          input,
          options: hook.fetchOptions,
          fetch: fetcher,
        // @ts-ignore
          fetchNew: fetcherNew,
        })
      },
      [fetcher, hook.fetchOptions]
    ),
  })
}
