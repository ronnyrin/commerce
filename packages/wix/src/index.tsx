import {
  getCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@vercel/commerce'
import { wixProvider, WixProvider } from './provider'

export { wixProvider }
export type { WixProvider }

// @ts-ignore
export const CommerceProvider = getCommerceProvider(wixProvider)

// @ts-ignore
export const useCommerce = () => useCoreCommerce<WixProvider>()
