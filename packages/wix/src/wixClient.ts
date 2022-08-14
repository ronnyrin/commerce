import {RequestOptions} from '@wix/sdk-types'

interface SessionParams {
  accessToken: string;
  refreshToken: string;
}

interface IWixClient {
  session(tokens?: Partial<SessionParams>): Promise<SessionParams>

  withIdentity(tokens: SessionParams): any
}

const API_URL = 'www.wixgateway.com'

function parseJWT(token: string) {
  const base64Url = token.split('.')[1];
  if (window) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } else {
    return JSON.parse(Buffer.from(base64Url, 'base64').toString());
  }
}

function isTokenExpired(token: string): boolean {
  const { expirationDate } = parseJWT(token)
  if (expirationDate) {
    const expirationDateObj = new Date(expirationDate)
    const currentDateObj = new Date()
    return currentDateObj > expirationDateObj
  }
  return false
}

export class WixClient implements IWixClient {
  constructor(private readonly config: { apiKey?: string; domain: string }) {
  }

  async session(tokens: Partial<SessionParams> = {}): Promise<SessionParams> {
    if (tokens.accessToken && !isTokenExpired(tokens.accessToken)) {
      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken! }
    }
    const res = await fetch(
      `https://${API_URL}/v1/meta-site/session-token`,
      {
        method: 'POST',
        headers: {
          'origin': this.config.domain,
          'Content-Type': 'application/json',
          ...(tokens.refreshToken && { 'refresh-token': tokens.refreshToken })
        }
      })
    return res.json()
  }

  withIdentity({ accessToken }: SessionParams) {
    return {
      send: async <T = any>(factory: RequestOptions<T>): Promise<T> => {
        const requestOptions = factory.toJSON({ host: API_URL })
        try {
          const res = await fetch(`https://${API_URL}${requestOptions.url}`, {
            method: requestOptions.method,
            ...(requestOptions.data && { body: JSON.stringify(requestOptions.data) }),
            headers: {
              'origin': this.config.domain,
              'Authorization': accessToken,
              'Content-Type': 'application/json'
            }
          })
          const json = await res.json()
          return factory.fromJSON(json)
        } catch (e) {
          throw e
        }
      }
    }
  }
}
