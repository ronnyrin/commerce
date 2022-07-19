import { WIX_ACCESS_TOKEN_COOKIE } from '../../../const'

const order = async ({
  res,
  req: { cookies, query },
  config
  // commerce
}: any) => {
  try {
    const orderId = query.orderId
    const accessToken = cookies[WIX_ACCESS_TOKEN_COOKIE]
    const response = await fetch(`https://www.wixapis.com/ecom/v1/orders/${orderId}`, {
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
