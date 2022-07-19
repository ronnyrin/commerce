import { createEndpoint } from '@vercel/commerce/api'
import orderEndpoint from '@vercel/commerce/api/endpoints/order'
import order from './order'

export const handlers = { order }

const orderApi = createEndpoint({
  handler: orderEndpoint,
  handlers,
})

export default orderApi
