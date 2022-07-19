import { CommerceAPIError } from '../utils/errors'

const orderEndpoint = async (ctx: any) => {
  const { req, res, handlers } = ctx
  try {
    const body = req.body ?? {}
    return await handlers['order']({ ...ctx, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof CommerceAPIError
        ? 'An unexpected error ocurred with the Commerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export default orderEndpoint
