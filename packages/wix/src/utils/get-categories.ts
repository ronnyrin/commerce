import type { Category } from '../types/site'
import { WixConfig } from '../api'
import { normalizeCategory } from './normalize'

const getCategories = async ({
  locale,
  fetcherNew
}: WixConfig): Promise<Category[]> => {
  const client = await fetcherNew();
  const {items} = await client.collections.queryCollections().find();

  return (
    items?.filter(c => c._id !== '00000000-000000-000000-000000000001').map(collection =>
      normalizeCategory(collection)
    ) ?? []
  )
}

export default getCategories
