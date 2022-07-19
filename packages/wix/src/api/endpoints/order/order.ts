import { WIX_ACCESS_TOKEN_COOKIE } from '../../../const'

const order = async ({
  res,
  req: { cookies },
  config
  // commerce
}: any) => {
  try {
    const accessToken = cookies[WIX_ACCESS_TOKEN_COOKIE]
    const response = await fetch('https://www.wixapis.com/ecom/v1/orders/0591e474-fd39-4201-be49-056e8dadca70', {
      headers: {
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    const data = await response.json()

    res.status(200).json({ order: data.order })
  } catch (e) {
    res.status(500).json({ error: 'errorrrr' })
  }
}

export default order
