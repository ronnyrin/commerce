import { useCallback } from 'react'
import type {
  MutationHookContext,
  HookFetcherContext,
} from '@vercel/commerce/utils/types'
import { ValidationError } from '@vercel/commerce/utils/errors'
import useRemoveItem, {
  UseRemoveItem,
} from '@vercel/commerce/cart/use-remove-item'
import type { Cart, LineItem, RemoveItemHook } from '../types/cart'
import useCart from './use-cart'

export type RemoveItemFn<T = any> = T extends LineItem
  ? (input?: RemoveItemActionInput<T>) => Promise<Cart | null | undefined>
  : (input: RemoveItemActionInput<T>) => Promise<Cart | null>

export type RemoveItemActionInput<T = any> = T extends LineItem
  ? Partial<RemoveItemHook['actionInput']>
  : RemoveItemHook['actionInput']

export default useRemoveItem as UseRemoveItem<typeof handler>

import {
  getCartId, normalizeCart
} from '../utils'
import { MutationHook } from '@vercel/commerce/utils/types'
import { cart } from '@wix/ecom'
import { clientTypes } from '../fetcherNew'

export const handler: MutationHook<RemoveItemHook> = {
  fetchOptions: {
    query: ''
  },
  async fetcher({
    input: { itemId },
    fetchNew,
  }: HookFetcherContext<RemoveItemHook>) {
    const client = await fetchNew<clientTypes>();
    const res = await client.cart.removeLineItems(getCartId()!, [itemId])
    await client.cart.createCheckout(getCartId()!, {channelType: cart.ChannelType.WEB})
    return normalizeCart(res)
  },
  useHook:
    ({ fetch }: MutationHookContext<RemoveItemHook>) =>
    <T extends LineItem | undefined = undefined>(ctx: { item?: T } = {}) => {
      const { item } = ctx
      const { mutate } = useCart()
      const removeItem: RemoveItemFn<LineItem> = async (input) => {
        const itemId = input?.id ?? item?.id

        if (!itemId) {
          throw new ValidationError({
            message: 'Invalid input used for this operation',
          })
        }

        const data = await fetch({ input: { itemId } })
        await mutate(data, false)
        return data
      }

      return useCallback(removeItem as RemoveItemFn<T>, [fetch, mutate])
    },
}
