import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetAllProductsOperation } from '../../types/product'
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
    const { fetcherNew } = commerce.getConfig(config)
    const client = await fetcherNew();
    const { items } = await client.products.queryProducts().descending('createdDate').limit(4).find()
    return {
      products: items.map(p =>
        normalizeProduct(p)
      ),
    }
  }

  return getAllProducts
}
