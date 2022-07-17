import useCustomer, {
  UseCustomer,
} from '@vercel/commerce/customer/use-customer'
import type { CustomerHook } from '../types/customer'
import { SWRHook } from '@vercel/commerce/utils/types'

export default useCustomer as UseCustomer<typeof handler>

export const handler: SWRHook<CustomerHook> = {
  fetchOptions: {
    url: '/api/customer',
    method: 'GET',
  },
  async fetcher({ options, fetch }) {
    const res = await fetch(options)
    // @ts-ignore
    return res.data?.customer ? {...res.data?.customer} : null
  },
  useHook:
    ({ useData }) =>
      (input) => {
        return useData({
          swrOptions: {
            revalidateOnFocus: false,
            ...input?.swrOptions,
          },
        })
      },
}
