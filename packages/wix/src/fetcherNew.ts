import { WIX_ACCESS_TOKEN_COOKIE, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './const'
import Cookies from 'js-cookie'
import { WixClient } from './wixClient'

const wixClient = new WixClient({ domain: WIX_DOMAIN! })

const fetcher: any = async (factory: any) => {
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE) ?? ''
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
  // let customerToken = getCustomerToken()
  const session = await wixClient.session({ refreshToken, accessToken })
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, session.accessToken!, { expires: 0.3 })
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, session.refreshToken!, { expires: WIX_COOKIE_EXPIRE })

  return wixClient.withIdentity(session).send(factory)
}

export default fetcher
