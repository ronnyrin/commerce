import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetProductOperation } from '../../types/product'
import { normalizeProduct } from '../../utils'
import type { WixConfig, Provider } from '..'

export default function getProductOperation({
  commerce,
}: OperationContext<Provider>) {

  async function getProduct<T extends GetProductOperation>({
    variables,
    config,
  }: {
    url?: string
    variables?: any,
    config?: Partial<WixConfig>
    preview?: boolean
  } = {}): Promise<T['data']> {
    const { fetcherNew } = commerce.getConfig(config)

    const client = await fetcherNew();
    const { items } = await client.products.queryProducts().eq('slug', variables.slug).find()
    return {
      product: normalizeProduct(items[0])
    }
  }

  return getProduct
}
