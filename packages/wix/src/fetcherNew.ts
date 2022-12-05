import { WIX_ACCESS_TOKEN_COOKIE, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './const'
import Cookies from 'js-cookie'
import { cart, currentCart } from '@wix/ecom'
import { products } from '@wix/stores'
import { createClient, session } from '@wix/sdk';

const wixClient = createClient({cart, products, currentCart})

export type clientTypes = typeof wixClient

const fetcher = async (): Promise<typeof wixClient> => {
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE) ?? ''
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
  const wixSession = await session({ refreshToken, accessToken }, { domain: WIX_DOMAIN!} );
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, wixSession.accessToken!, { expires: 0.3 })
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, wixSession.refreshToken!, { expires: WIX_COOKIE_EXPIRE })
  wixClient.setSession(wixSession)

  return wixClient
}

export default fetcher
