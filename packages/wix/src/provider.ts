import { WIX_CART_ID_COOKIE } from './const'

import { handler as useCheckout } from './checkout/use-checkout'

import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useRemoveItem } from './cart/use-remove-item'

import { handler as useCustomer } from './customer/use-customer'
import { handler as useOrder } from './order/use-order'
import { handler as useSearch } from './product/use-search'

import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'

import fetcher from './fetcher'

export const wixProvider = {
  locale: 'en-us',
  cartCookie: WIX_CART_ID_COOKIE,
  fetcher,
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  checkout: {useCheckout},
  customer: { useCustomer },
  products: { useSearch },
  order: { useOrder },
  auth: { useLogin, useLogout, useSignup },
}

export type WixProvider = typeof wixProvider
