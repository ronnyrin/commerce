import {
  API_URL,
  WIX_ACCESS_TOKEN_COOKIE,
  WIX_REFRESH_TOKEN_COOKIE,
  WIX_COOKIE_EXPIRE,
  WIX_CLIENT_ID
} from './const'
import { handleFetchResponse } from './utils'
import Cookies from 'js-cookie'
import { createClient, OAuthStrategy } from '@wix/api-client';
import { products } from '@wix/stores'


const fetcher: any = async ({
  method = 'POST',
  url,
  variables
}: any) => {
  const wixClient = createClient({modules: {products}, auth: OAuthStrategy({clientId: WIX_CLIENT_ID})})
  let accessToken = JSON.parse(Cookies.get(WIX_ACCESS_TOKEN_COOKIE) || '{}') ?? ''
  let refreshToken = JSON.parse(Cookies.get(WIX_REFRESH_TOKEN_COOKIE) || '{}') ?? ''
  const wixSession = await wixClient.auth.generateVisitorTokens({accessToken, refreshToken});

  accessToken = wixSession.accessToken;
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, JSON.stringify(accessToken!), {expires: 0.1})
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, JSON.stringify(refreshToken || wixSession.refreshToken!), {expires: WIX_COOKIE_EXPIRE})

  return handleFetchResponse(
    await fetch(url[0] === '/' ? url : `${API_URL}/${url}`, {
      method,
      ...(variables && { body: variables }),
      headers: {
        'Authorization': accessToken!.accessToken,
        'Content-Type': 'application/json'
      }
    })
  )
}

export default fetcher
