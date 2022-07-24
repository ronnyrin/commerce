import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'

import {
  normalizeProduct
} from '../utils'
import { SearchProductsHook } from '@vercel/commerce/types/product'

export type SearchProductsInput = {
  search?: string
  categoryId?: number
  brandId?: number
  sort?: string
  locale?: string
}

export default useSearch as UseSearch<typeof handler>

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    url: 'stores/v1/products/query',
    method: 'POST'
  },
  async fetcher({ input, options, fetch }: any) {
    const { categoryId } = input
    let products
    let sortType = input.sort.split('-')[0]
    if (sortType === 'latest' || sortType === 'trending') {
      sortType = 'lastUpdated'
    }
    const sortValue = input.sort.split('-')[1]
    const sortQuery = { sort: JSON.stringify([{ [sortType]: sortValue }]) }
    let variables

    if (categoryId) {
      variables = JSON.stringify({ query: { filter: JSON.stringify({ 'collections.id': categoryId }), ...(sortType && sortQuery) } })
    } else {
      variables = JSON.stringify({ query: { filter: JSON.stringify({ 'name': { '$startsWith': input.search } }), ...(sortType && sortQuery) } })
    }

    const data = await fetch({
      ...options,
      variables
    })
    products = data.products

    return {
      products: products?.map((p: any) =>
        normalizeProduct(p)
      ),
      found: !!products?.length
    }
  },
  useHook:
    ({ useData }: any) =>
      (input: any = {}) => {
        return useData({
          input: [
            ['search', input.search],
            ['categoryId', input.categoryId],
            ['brandId', input.brandId],
            ['sort', input.sort],
            ['locale', input.locale]
          ],
          swrOptions: {
            revalidateOnFocus: false,
            ...input.swrOptions
          }
        })
      }
}
