import { useCallback } from 'react'
import { CommerceError } from '@vercel/commerce/utils/errors'
import useAddItem, { UseAddItem } from '@vercel/commerce/cart/use-add-item'
import useCart from './use-cart'

import {
  cartCreate, getCartId, normalizeCart
} from '../utils'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { AddItemHook } from '../types/cart'

export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    query: ''
  },
  async fetcher({ input: item, fetch }: any) {
    if (
      item.quantity &&
      (!Number.isInteger(item.quantity) || item.quantity! < 1)
    ) {
      throw new CommerceError({
        message: 'The item quantity has to be a valid integer greater than 0',
      })
    }

    const lineItems = [
      {
        catalogReference: {catalogItemId: item.productId, appId: '1380b703-ce81-ff05-f115-39571d94dfcd', ...(item.selectedOptions && {options: {options: item.selectedOptions}})},
        quantity: item.quantity ?? 1,
      },
    ]

    let cartId = getCartId()

    if (!cartId) {
      return normalizeCart(await cartCreate(fetch, lineItems))
    } else {
      const res = await fetch({
        url: `ecom/v1/carts/${cartId}/add-to-cart`,
        variables: JSON.stringify({
          lineItems,
        }),
      })
      await fetch({
        url: `ecom/v1/carts/${cartId}/create-checkout`,
        variables: JSON.stringify({channelType: 'WEB'})
      })
      return normalizeCart(res)
    }
  },
  useHook:
    ({ fetch }: any) =>
    () => {
      const { mutate } = useCart()
      return useCallback(
        async function addItem(input) {
          const data = await fetch({ input })
          await mutate(data, false)
          return data
        },
        [fetch, mutate]
      )
    },
}
