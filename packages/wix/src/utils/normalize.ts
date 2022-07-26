import type { Cart, WixCartLineItem } from '../types/cart'
import type { Category } from '../types/site'
import { WIX_VIEWER_URL, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_CHECKOUT_ID_COOKIE } from '../const'
import { getCustomerToken } from './customer-token'
import Cookies from 'js-cookie'
import { GetCartResponse, LineItem, DescriptionLine } from '../types/cart'
import {
  WixProduct,
  Media,
  MediaItem,
  Product,
  WixProductOption,
  PriceData,
  Choice,
  ProductOption,
  Collection
} from '../types/product'

const money = ({ price, currency }: PriceData) => {
  return {
    value: +price,
    currencyCode: currency
  }
}

const normalizeProductOption = ({
  name: displayName,
  choices
}: WixProductOption): ProductOption => {
  return {
    id: '',
    displayName,
    values: choices.map((choice: Choice) => {
      let output: any = {
        label: choice.description,
      }
      if (displayName.match(/colou?r/gi)) {
        output = {
          ...output,
          hexColors: [choice.value]
        }
      }
      return output
    })
  }
}

const normalizeProductImages = ({ items }: Media) =>
  items?.map((i: MediaItem) => i.image)

export function normalizeProduct({
  id,
  name,
  brand,
  media,
  variants,
  description,
  price,
  slug,
  sku,
  convertedPriceData,
  productOptions,
  ...rest
}: WixProduct): Product {
  return {
    id,
    name,
    vendor: brand || '',
    sku: sku || '',
    description: description || '',
    path: `/${slug}`,
    slug: slug?.replace(/^\/+|\/+$/g, ''),
    price: money(convertedPriceData),
    images: normalizeProductImages(media),
    variants: [],
    options: productOptions
      ? productOptions
        .map((o: WixProductOption) => normalizeProductOption(o))
      : [],
    ...rest
  }
}

export function normalizeCart({cart}: GetCartResponse): Cart {
  const smToken = getCustomerToken()
  const svToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE)
  const checkoutId = Cookies.get(WIX_CHECKOUT_ID_COOKIE)
  const baseUrl = WIX_VIEWER_URL!.split('/').slice(0, 3).join('/');
  const checkoutUrl = `${WIX_VIEWER_URL}/checkout?appSectionParams={"checkoutId":"${checkoutId}","successUrl":"https://${WIX_DOMAIN}/success"}`;
  const redirectUrl = `${baseUrl}/_serverless/vercel-cookie-redirect/redirect-to-checkout?svToken=${svToken}${smToken ? `&token=${smToken}` : ''}&domain=${WIX_VIEWER_URL}&url=${checkoutUrl}`
  return {
    id: cart.id,
    url: redirectUrl,
    customerId: '',
    email: '',
    createdAt: cart.createdDate,
    currency: {
      code: cart.currency
    },
    taxesIncluded: cart.taxIncludedInPrices,
    lineItems: cart.lineItems?.map(normalizeLineItem),
    lineItemsSubtotalPrice: +cart.subtotal?.amount,
    subtotalPrice: +cart.subtotal?.amount,
    totalPrice: Number(cart.subtotal?.amount),
    discounts: []
  }
}

function normalizeLineItem({
  id, productName, quantity, catalogReference, image, physicalProperties, price, priceBeforeDiscounts, url, descriptionLines
}: WixCartLineItem): LineItem {
  return {
    id,
    variantId: catalogReference.catalogItemId,
    productId: catalogReference.catalogItemId,
    name: productName.translated,
    quantity,
    variant: {
      id: catalogReference.catalogItemId,
      sku: physicalProperties?.sku ?? '',
      name: productName.translated,
      image: {
        url: image.url || '/product-img-placeholder.svg'
      },
      requiresShipping: physicalProperties?.shippable ?? false,
      price: Number(price?.amount),
      listPrice: Number(priceBeforeDiscounts?.amount)
    },
    path: String(url.relativePath.split('/')[2]),
    discounts: [],
    options: descriptionLines.map((line: any) => ({name: line.name.translated, value: line.colorInfo?.code || line.plainText?.translated}))
  }
}

export function normalizeOrder(order: any) {
  return {
    ...order,
    lineItems: order.lineItems?.map(normalizeOrderLineItem),
  }
}

function normalizeOrderLineItem({
  id, productName, quantity, catalogReference, image, physicalProperties, price, priceBeforeDiscounts, descriptionLines
}: WixCartLineItem): LineItem {
  return {
    id,
    variantId: catalogReference.catalogItemId,
    productId: catalogReference.catalogItemId,
    name: productName.translated,
    quantity,
    variant: {
      id: catalogReference.catalogItemId,
      sku: physicalProperties?.sku ?? '',
      name: productName.translated,
      image: {
        url: image.url || '/product-img-placeholder.svg'
      },
      requiresShipping: physicalProperties?.shippable ?? false,
      price: Number(price?.amount),
      listPrice: Number(priceBeforeDiscounts?.amount)
    },
    path: '',
    discounts: [],
    options: descriptionLines.map((line: DescriptionLine) => ({name: line.name.translated, value: line.colorInfo?.code || line.plainText?.translated}))
  }
}

export const normalizeCategory = ({
  name,
  id
}: Collection): Category => ({
  id,
  name,
  slug: name,
  path: `/${name}`
})
