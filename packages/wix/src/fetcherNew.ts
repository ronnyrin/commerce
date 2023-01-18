import { WIX_ACCESS_TOKEN_COOKIE, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './const'
import Cookies from 'js-cookie'
import { cart, currentCart } from '@wix/ecom'
import { products } from '@wix/stores'
import { createClient, OAuthStrategy } from '@wix/sdk';

const wixClient = createClient({modules: {cart, products, currentCart}, auth: OAuthStrategy({clientId: '6730773d-e547-4beb-ab89-6c480166c29d'})})
export type clientTypes = typeof wixClient

const fetcher = async (): Promise<clientTypes> => {
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE) ?? ''
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
  const wixSession = await wixClient.auth.generateVisitorTokens({accessToken, refreshToken});
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, wixSession.accessToken!, { expires: 0.1 })
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, wixSession.refreshToken!, { expires: WIX_COOKIE_EXPIRE })
  wixClient.auth.setTokens(wixSession)

  return wixClient
}

export default fetcher
