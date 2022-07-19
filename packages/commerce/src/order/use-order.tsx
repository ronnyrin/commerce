import Cookies from 'js-cookie'
import { useHook, useSWRHook } from '../utils/use-hook'
import type { SWRHook, HookFetcherFn } from '../utils/types'
import type { GetCartHook } from '../types/cart'
import { Provider, useCommerce } from '..'

export type UseOrder<
  H extends SWRHook<GetCartHook<any>> = SWRHook<GetCartHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<GetCartHook> = async ({
  options,
  // input: { cartId },
  fetch,
}) => {
  return await fetch(options)
}

const fn = (provider: Provider) => provider.order?.useOrder!

const useCart: UseOrder = (input) => {
  const hook = useHook(fn)
  const fetcherFn = hook.fetcher ?? fetcher
  const wrapper: typeof fetcher = (context) => {
    return fetcherFn(context)
  }
  return useSWRHook({ ...hook, fetcher: wrapper })(input)
}

export default useCart
