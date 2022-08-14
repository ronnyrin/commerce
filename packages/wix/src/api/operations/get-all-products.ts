import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetAllProductsOperation } from '../../types/product'
import type { WixConfig, Provider } from '..'
import { normalizeProduct } from '../../utils'
import { products as productsApi } from '../../product.universal'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<Provider>) {

  async function getAllProducts<T extends GetAllProductsOperation>({
    url = 'stores/v1/products/query',
    config,
    variables,
    preview
  }: {
    url?: string
    config?: Partial<WixConfig>
    variables?: T['variables']
    preview?: boolean
  } = {}): Promise<T['data']> {
    const { fetcherNew, fetcher } = commerce.getConfig(config)
    // const { products }: QueryProductsResponse = await fetcher({url, ...(variables && {variables: JSON.stringify({query: {paging: {limit: variables.first}}})})})
    const { items } = await fetcherNew(productsApi.queryProducts().limit(4).build())
    return {
    // @ts-ignore
      products: items.map(p =>
        normalizeProduct(p)
      ),
    }
  }

  return getAllProducts
}
