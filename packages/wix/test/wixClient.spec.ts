import { WixClient } from '../src/wixClient'
import { createCart } from '../src/cart.universal'

describe('wixClient', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ accessToken: 'some-accessToken', refreshToken: 'some-refreshToken' })
    }))
  })

  it('should generate new session', async () => {
    const client = new WixClient({ domain: 'my-domain.com' })
    const session = await client.session()
    expect(session).toEqual({ accessToken: 'some-accessToken', refreshToken: 'some-refreshToken' })
    expect(global.fetch).toHaveBeenCalledWith('https://www.wixgateway.com/v1/meta-site/session-token',
      expect.objectContaining({ headers: { 'origin': 'my-domain.com', 'Content-Type': 'application/json' } }))
  })

  it('should not generate if already exist and not expired', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiJiYWNhODEyOS1mYzIyLTRmYTktOGFlZC0zNTI5NTIxMjUzNjIiLCJleHBpcmF0aW9uRGF0ZSI6IlN1biwgMjEgSmFuIDIwMzUgMDk6MTE6MTEgR01UIiwiaWF0IjoxNjU5OTU2NzY1fQ'
    const client = new WixClient({ domain: 'my-domain.com' })
    await client.session({ accessToken: token, refreshToken: 'some-refreshToken' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should generate if already exist but expired', async () => {
    const token = 'vqSVCBy6xYPLdlbEUSHvpz0Vv7iNxLJI_Enoolg4Ifs.eyJpbnN0YW5jZUlkIjoiMmViMDhmZmYtMDkwOS00YWYxLTgyMjUtYmJhOTY2NTE5OThiIiwiYXBwRGVmSWQiOiIxMzgwYjcwMy1jZTgxLWZmMDUtZjExNS0zOTU3MWQ5NGRmY2QiLCJtZXRhU2l0ZUlkIjoiNzNjYTBiYmItOGZiYi00N2Y5LTg3MjQtODIyNjczZWM4MjE2Iiwic2lnbkRhdGUiOiIyMDIyLTA4LTA4VDA3OjE1OjEyLjU0OVoiLCJ1aWQiOiJkYTMzYWM2Yy00YjRlLTRkNTUtYmEyMS1jNzg5ZTU3NTk1MTQiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJzdG9yZXNfc2lsdmVyIiwiZGVtb01vZGUiOmZhbHNlLCJhaWQiOiJiYWNhODEyOS1mYzIyLTRmYTktOGFlZC0zNTI5NTIxMjUzNjIiLCJiaVRva2VuIjoiNWQ3YTg0NDQtODZiMi0wZDA4LTA1MDEtMzk4ZjE1YmQxYjlkIiwic2l0ZU93bmVySWQiOiJlNzZkNzE0NC00MjkzLTRlYWYtYThkOS0wMGMyODlmNDdiNWIiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjItMDgtMDhUMTE6MTU6MTIuNTQ5WiIsImhhc1VzZXJSb2xlIjpmYWxzZX0'
    const client = new WixClient({ domain: 'my-domain.com' })
    await client.session({ accessToken: token, refreshToken: 'some-refreshToken' })
    expect(global.fetch).toHaveBeenCalled()
  })

  it('should not generate if already exist without expiration', async () => {
    const token = 'QIzvautlQj9XQUcchx30TKxnd6rY-UpTNxQPslY0lCI.eyJpbnN0YW5jZUlkIjoiMmViMDhmZmYtMDkwOS00YWYxLTgyMjUtYmJhOTY2NTE5OThiIiwiYXBwRGVmSWQiOiIxMzgwYjcwMy1jZTgxLWZmMDUtZjExNS0zOTU3MWQ5NGRmY2QiLCJtZXRhU2l0ZUlkIjoiNzNjYTBiYmItOGZiYi00N2Y5LTg3MjQtODIyNjczZWM4MjE2Iiwic2lnbkRhdGUiOiIyMDIyLTA4LTA3VDEyOjUxOjU5LjgzM1oiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJzdG9yZXNfc2lsdmVyIiwiZGVtb01vZGUiOmZhbHNlLCJhaWQiOiJiYWNhODEyOS1mYzIyLTRmYTktOGFlZC0zNTI5NTIxMjUzNjIiLCJiaVRva2VuIjoiNWQ3YTg0NDQtODZiMi0wZDA4LTA1MDEtMzk4ZjE1YmQxYjlkIiwic2l0ZU93bmVySWQiOiJlNzZkNzE0NC00MjkzLTRlYWYtYThkOS0wMGMyODlmNDdiNWIifQ'
    const client = new WixClient({ domain: 'my-domain.com' })
    await client.session({ accessToken: token, refreshToken: 'some-refreshToken' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should generate access with refresh if exist', async () => {
    const client = new WixClient({ domain: 'my-domain.com' })
    await client.session({ refreshToken: 'some-refreshToken' })
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ 'refresh-token': 'some-refreshToken' }) }))
  })

  it('should send request with access token', async () => {
    const token = 'vqSVCBy6xYPLdlbEUSHvpz0Vv7iNxLJI_Enoolg4Ifs.eyJpbnN0YW5jZUlkIjoiMmViMDhmZmYtMDkwOS00YWYxLTgyMjUtYmJhOTY2NTE5OThiIiwiYXBwRGVmSWQiOiIxMzgwYjcwMy1jZTgxLWZmMDUtZjExNS0zOTU3MWQ5NGRmY2QiLCJtZXRhU2l0ZUlkIjoiNzNjYTBiYmItOGZiYi00N2Y5LTg3MjQtODIyNjczZWM4MjE2Iiwic2lnbkRhdGUiOiIyMDIyLTA4LTA4VDA3OjE1OjEyLjU0OVoiLCJ1aWQiOiJkYTMzYWM2Yy00YjRlLTRkNTUtYmEyMS1jNzg5ZTU3NTk1MTQiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJzdG9yZXNfc2lsdmVyIiwiZGVtb01vZGUiOmZhbHNlLCJhaWQiOiJiYWNhODEyOS1mYzIyLTRmYTktOGFlZC0zNTI5NTIxMjUzNjIiLCJiaVRva2VuIjoiNWQ3YTg0NDQtODZiMi0wZDA4LTA1MDEtMzk4ZjE1YmQxYjlkIiwic2l0ZU93bmVySWQiOiJlNzZkNzE0NC00MjkzLTRlYWYtYThkOS0wMGMyODlmNDdiNWIiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjItMDgtMDhUMTE6MTU6MTIuNTQ5WiIsImhhc1VzZXJSb2xlIjpmYWxzZX0'
    const client = new WixClient({ domain: 'my-domain.com' })
    await client.withIdentity({ accessToken: token, refreshToken: 'some-refreshToken' }).send(createCart({}))
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: token }) }))
  })
})
