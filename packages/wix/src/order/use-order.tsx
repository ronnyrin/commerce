import useCommerceOrder, { UseOrder } from '@vercel/commerce/order/use-order'
import { normalizeOrder } from '../utils'
import Cookies from 'js-cookie'
import { WIX_CART_ID_COOKIE, WIX_CHECKOUT_ID_COOKIE } from '../const'
export default useCommerceOrder as UseOrder<typeof handler>

export const handler: any = {
  fetchOptions: {
    url: '/api/order',
    method: 'GET',
  },
  async fetcher({ options, fetch, input }: any) {
    if (!input.orderId) {
      return;
    }

    const { order } = await fetch({
      ...options,
      url: `/api/order?orderId=${input.orderId}`
    })
    return normalizeOrder(order)
  },

  useHook:
    ({ useData }: any) =>
      (input: any) => {
        Cookies.remove(WIX_CHECKOUT_ID_COOKIE)
        Cookies.remove(WIX_CART_ID_COOKIE)
        return useData({
          input: [
            ['orderId', input?.orderId],
          ],
          swrOptions: {
            revalidateOnFocus: false,
            ...input?.swrOptions,
          },
        })
      },
}
