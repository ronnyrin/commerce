import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi
} from '@vercel/commerce/api'
import createGraphqlFetcher from './utils/graphql-fetch'

import {
  API_URL,
  WIX_CUSTOMER_TOKEN_COOKIE,
  WIX_CART_ID_COOKIE
} from '../const'

import fetcher from '../fetcher'
import fetcherNew from '../fetcherNew'

import * as operations from './operations'

export interface WixConfig extends CommerceAPIConfig {
  fetcher: typeof fetcher
  fetcherNew: typeof fetcherNew
}

const ONE_DAY = 60 * 60 * 24

const config: WixConfig = {
  commerceUrl: API_URL,
  apiToken: '',
  customerCookie: WIX_CUSTOMER_TOKEN_COOKIE,
  cartCookie: WIX_CART_ID_COOKIE,
  cartCookieMaxAge: ONE_DAY * 30,
  fetch: createGraphqlFetcher(() => getCommerceApi().getConfig()),
  fetcher,
  fetcherNew: fetcherNew
}

export const provider = {
  config,
  operations
}

export type Provider = typeof provider

export type WixAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): WixAPI<P> {
  return commerceApi(customProvider)
}
