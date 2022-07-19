import Cookies from 'js-cookie'
import {
  WIX_CUSTOMER_TOKEN_COOKIE,
  WIX_REFRESH_TOKEN_COOKIE,
  WIX_ACCESS_TOKEN_COOKIE,
  WIX_CART_ID_COOKIE,
  WIX_CHECKOUT_ID_COOKIE
} from '../const'

export const getCustomerToken = () => Cookies.get(WIX_CUSTOMER_TOKEN_COOKIE)

export const clearTokens = () => {
    Cookies.remove(WIX_CUSTOMER_TOKEN_COOKIE)
    Cookies.remove(WIX_REFRESH_TOKEN_COOKIE)
    Cookies.remove(WIX_ACCESS_TOKEN_COOKIE)
    Cookies.remove(WIX_CART_ID_COOKIE)
    Cookies.remove(WIX_CHECKOUT_ID_COOKIE)
}
