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
    const { fetcher } = commerce.getConfig(config)
    const { products } = await fetcher({url, variables: JSON.stringify({query: {filter: JSON.stringify({slug: variables.slug})}})})
    return {
      product: normalizeProduct(products[0])
    }
  }

  return getProduct
}
