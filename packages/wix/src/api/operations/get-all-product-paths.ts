import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import { GetAllProductPathsOperation } from '../../types/product'
import type { WixConfig, Provider } from '..'

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
    url,
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
    const client = await fetcherNew()
    const { items } = await client.products.queryProducts().find()
    return {
    // @ts-ignore
      products: items.map(({slug}) =>
        ({path: `/${slug}`})
      ),
    }
  }

  return getAllProductPaths
}
