import type { SignupEndpoint } from '.'
import { WIX_ACCESS_TOKEN_COOKIE, WIX_CUSTOMER_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from '../../../const'

const signup: SignupEndpoint['handlers']['signup'] = async ({
  res,
  body: { firstName, lastName, email, password },
  req: {cookies},
  config,
  // commerce
}) => {
  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }]
    })
  }

  try {
    const accessToken = cookies[WIX_ACCESS_TOKEN_COOKIE]
    const response = await fetch('http://www.wix.com/_api/wix-sm/v1/auth/register?petri_ovr=specs.ShouldForceCaptchaVerificationOnSignupSpec:Disabled', {
      headers: {
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        'contactInfo': { firstName, lastName }
      })
    })
    const data = await response.json()
    res.setHeader(
      'Set-Cookie',
      [`${WIX_CUSTOMER_TOKEN_COOKIE}=${data.session.token}; Max-Age=${WIX_COOKIE_EXPIRE * 86400}; Path=/`,
        `${WIX_ACCESS_TOKEN_COOKIE}=; expires=Thu, Jan 01 1970 00:00:00 UTC;; Path=/`,
        `credentials=${email}|${password}; Max-Age=86400; Path=/`
      ]
    )
    res.status(200).json({ data: data.member })
  } catch (error) {
    throw error
  }

  // Login the customer right after creating it
  // await commerce.login({ variables: { email, password }, res, config })

  // res.status(200).json({ data })
}

export default signup
