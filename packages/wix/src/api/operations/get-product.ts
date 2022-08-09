import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetProductOperation, QueryProductsResponse } from '../../types/product'
import { normalizeProduct } from '../../utils'
import type { WixConfig, Provider } from '..'
import { products as productsApi } from '../../product.universal'

export default function getProductOperation({
  commerce,
}: OperationContext<Provider>) {

  async function getProduct<T extends GetProductOperation>({
    url = 'stores/v1/products/query',
    variables,
    config,
    preview
  }: {
    url?: string
    variables?: any,
    config?: Partial<WixConfig>
    preview?: boolean
  } = {}): Promise<T['data']> {
    const { fetcher, fetcherNew } = commerce.getConfig(config)
    const { products }: QueryProductsResponse = await fetcher({url, variables: JSON.stringify({query: {filter: JSON.stringify({slug: variables.slug})}})})
    // const { products }: QueryProductsResponse = await fetcherNew(productsApi.queryProducts().eq('slug', variables.slug).find())
    return {
      product: normalizeProduct(products[0])
    }
  }

  return getProduct
}
