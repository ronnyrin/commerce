import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import type { WixConfig, Provider } from '..'
import { GetPageOperation } from '../../types/page'

export default function getPageOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getPage<T extends GetPageOperation>(opts: {
    variables: T['variables']
    config?: Partial<WixConfig>
    preview?: boolean
  }): Promise<T['data']>

  async function getPage<T extends GetPageOperation>(
    opts: {
      variables: T['variables']
      config?: Partial<WixConfig>
      preview?: boolean
    } & OperationOptions
  ): Promise<T['data']>

  async function getPage<T extends GetPageOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables: T['variables']
    config?: Partial<WixConfig>
    preview?: boolean
  }): Promise<T['data']> {
    return Promise.resolve({page: undefined})
  }

  return getPage
}
