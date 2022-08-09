import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import { GetAllProductPathsOperation, QueryProductsResponse } from '../../types/product'
import type { WixConfig, Provider } from '..'
import { products as productsApi } from '../../product.universal'

export default function getAllProductPathsOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getAllProductPaths<
    T extends GetAllProductPathsOperation
  >(opts?: {
    variables?: T['variables']
    config?: WixConfig
  }): Promise<T['data']>

  async function getAllProductPaths<T extends GetAllProductPathsOperation>(
    opts: {
      variables?: T['variables']
      config?: WixConfig
    } & OperationOptions
  ): Promise<T['data']>

  async function getAllProductPaths<T extends GetAllProductPathsOperation>({
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
    const { fetcher, fetcherNew } = commerce.getConfig(config)
    // const { products }: QueryProductsResponse = await fetcher({url})
    const { products }: QueryProductsResponse = await fetcherNew(productsApi.queryProducts().find())
    return {
      products: products.map(({slug}) =>
        ({path: `/${slug}`})
      ),
    }
  }

  return getAllProductPaths
}
