import Cookies from 'js-cookie'
import {
  WIX_CUSTOMER_TOKEN_COOKIE,
  WIX_REFRESH_TOKEN_COOKIE,
  WIX_ACCESS_TOKEN_COOKIE
} from '../const'

export const getCustomerToken = () => Cookies.get(WIX_CUSTOMER_TOKEN_COOKIE)

export const setCustomerToken = () => {
    Cookies.remove(WIX_CUSTOMER_TOKEN_COOKIE)
    Cookies.remove(WIX_REFRESH_TOKEN_COOKIE)
    Cookies.remove(WIX_ACCESS_TOKEN_COOKIE)
}
