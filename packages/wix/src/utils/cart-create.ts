import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
  WIX_COOKIE_EXPIRE, WIX_CHECKOUT_ID_COOKIE
} from '../const'
import { cart } from '@wix/ecom'
import fetcherNew from '../fetcherNew'

export const cartCreate = async (
  fetcher: typeof fetcherNew,
  lineItems: any
) => {
  const res = await fetcher(cart.createCart({lineItems}))
  const {checkoutId} = await fetcher(cart.createCheckout(res.cart!._id!, {channelType: cart.ChannelType.WEB}))

  if (res) {
    const cartId = res.cart?._id
    const options = {
      expires: WIX_COOKIE_EXPIRE
    }
    Cookies.set(WIX_CART_ID_COOKIE, cartId!, options)
    Cookies.set(WIX_CHECKOUT_ID_COOKIE, checkoutId!, options)
  }

  return res
}

export default cartCreate
