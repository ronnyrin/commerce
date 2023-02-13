import {WIX_ACCESS_TOKEN_COOKIE, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE, WIX_CLIENT_ID} from './const'
import Cookies from 'js-cookie'
import { cart, currentCart } from '@wix/ecom'
import { products, collections } from '@wix/stores'
import { createClient, OAuthStrategy } from '@wix/api-client';

const wixClientForTypes = createClient({modules: {cart, products, currentCart, collections}})
export type clientTypes = typeof wixClientForTypes

const fetcher = async (): Promise<clientTypes> => {
  const wixClient = createClient({modules: {cart, products, currentCart, collections}, auth: OAuthStrategy({clientId: WIX_CLIENT_ID})})
  let accessToken = JSON.parse(Cookies.get(WIX_ACCESS_TOKEN_COOKIE) || '{}') ?? ''
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
  const wixSession = await wixClient.auth.generateVisitorTokens({accessToken, refreshToken});
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, JSON.stringify(wixSession.accessToken!), { expires: 0.1 })
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, wixSession.refreshToken!, { expires: WIX_COOKIE_EXPIRE })
  wixClient.auth.setTokens(wixSession)

  return wixClient
}

export default fetcher
