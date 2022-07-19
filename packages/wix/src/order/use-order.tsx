import useCommerceOrder, { UseOrder } from '@vercel/commerce/order/use-order'
export default useCommerceOrder as UseOrder<typeof handler>

export const handler: any = {
  fetchOptions: {
    url: '/api/order',
    method: 'GET',
  },
  async fetcher({ options, fetch, input }: any) {
    const { order } = await fetch({
      ...options,
      url: `/api/order?orderId=${input.orderId}`
    })
    return order
  },

  useHook:
    ({ useData }: any) =>
      (input: any) => {
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
