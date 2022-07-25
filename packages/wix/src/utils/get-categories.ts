import type { Category } from '../types/site'
import { WixConfig } from '../api'
import { normalizeCategory } from './normalize'
import { QueryCollectionsResponse, Collection } from '../types/product'

const getCategories = async ({
  fetcher,
  locale,
}: WixConfig): Promise<Category[]> => {
  const { collections }: QueryCollectionsResponse = await fetcher({url: 'stores/v1/collections/query', method: 'POST'})

  return (
    collections?.filter(c => c.id !== '00000000-000000-000000-000000000001').map(collection =>
      normalizeCategory(collection)
    ) ?? []
  )
}

export default getCategories
