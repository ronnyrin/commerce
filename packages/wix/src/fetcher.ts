import { API_URL, WIX_ACCESS_TOKEN_COOKIE, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './const'
import { handleFetchResponse } from './utils'
import Cookies from 'js-cookie'
import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores'


const fetcher: any = async ({
  method = 'POST',
  url,
  variables
}: any) => {
  const wixClient = createClient({modules: {products}, auth: OAuthStrategy({clientId: '6730773d-e547-4beb-ab89-6c480166c29d'})})
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE)
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE)
  const wixSession = await wixClient.auth.generateVisitorTokens({accessToken, refreshToken});

  accessToken = wixSession.accessToken;
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, accessToken!, {expires: 0.3})
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, refreshToken || wixSession.refreshToken!, {expires: WIX_COOKIE_EXPIRE})

  return handleFetchResponse(
    await fetch(url[0] === '/' ? url : `${API_URL}/${url}`, {
      method,
      ...(variables && { body: variables }),
      headers: {
        'origin': WIX_DOMAIN!,
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      }
    })
  )
}

export default fetcher
