import { useMemo } from 'react'
import useCommerceCart, { UseCart } from '@vercel/commerce/cart/use-cart'
import { normalizeCart, getCustomerToken } from '../utils'
import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE, WIX_CHECKOUT_ID_COOKIE
} from '../const'
import { SWRHook } from '@vercel/commerce/utils/types'
import { GetCartHook } from '../types/cart'
import { clientTypes } from '../fetcherNew'

export default useCommerceCart as UseCart<typeof handler>

export const handler: SWRHook<GetCartHook> = {
  fetchOptions: {
    query: ''
  },
  async fetcher({ fetch, fetchNew }) {
    try {
      const client = await fetchNew<clientTypes>();
      const cart = await client.currentCart.getCurrentCart();

      if (getCustomerToken()) {
        await fetch({url: '/api/login'});
      }

      Cookies.set(WIX_CART_ID_COOKIE, cart!._id!)
      return normalizeCart({
        cart,
      })
    } catch (e) {
      console.log(e)
      Cookies.remove(WIX_CART_ID_COOKIE)
      Cookies.remove(WIX_CHECKOUT_ID_COOKIE)
    }
  },
  useHook:
    ({ useData }) =>
    (input) => {
      const response = useData({
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })
      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}
