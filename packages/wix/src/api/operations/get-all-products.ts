import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetAllProductsOperation, QueryProductsResponse } from '../../types/product'
import type { WixConfig, Provider } from '..'
import { normalizeProduct } from '../../utils'

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
    const { fetcher } = commerce.getConfig(config)
    const { products }: QueryProductsResponse = await fetcher({url, ...(variables && {variables: JSON.stringify({query: {paging: {limit: variables.first}}})})})
    return {
      products: products.map(p =>
        normalizeProduct(p)
      ),
    }
  }

  return getAllProducts
}
