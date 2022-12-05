import type { Category } from '../types/site'
import { WIX_VIEWER_URL, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_CHECKOUT_ID_COOKIE } from '../const'
import { getCustomerToken } from './customer-token'
import Cookies from 'js-cookie'
import { LineItem, DescriptionLine, WixCartLineItem } from '../types/cart'
import {
  Product,
  ProductOption
} from '../types/product'
import { Cart } from '@vercel/commerce/types/cart'
import { parse } from 'querystring'
import { products } from '@wix/stores'

const money = ({ price, currency }: products.PriceData) => {
  return {
    value: +price,
    currencyCode: currency
  }
}

const normalizeProductOption = ({
  name: displayName,
  choices
}: any): ProductOption => {
  return {
    id: '',
    displayName,
    values: choices.map((choice: products.Choice) => {
      let output: any = {
        label: choice.description
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

const normalizeProductImages = ({ items }: products.Media) =>
  items?.map((i: products.MediaItem) => i.image)

export function normalizeProduct({
  _id,
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
}: any): Product {
  return {
    id: _id,
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
        .map((o: any) => normalizeProductOption(o))
      : [],
    ...rest
  }
}

export function normalizeCart({ cart }: any): Cart {
  if (!cart) {
    return {
      id: '',
      createdAt: '',
      currency: { code: '' },
      taxesIncluded: false,
      lineItems: [],
      lineItemsSubtotalPrice: 0,
      totalPrice: 0,
      subtotalPrice: 0
    }
  }

  const smToken = getCustomerToken()
  const svToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE)
  const checkoutId = Cookies.get(WIX_CHECKOUT_ID_COOKIE)
  const baseUrl = WIX_VIEWER_URL!.split('/').slice(0, 3).join('/')
  const checkoutUrl = `${WIX_VIEWER_URL}/checkout?appSectionParams={"checkoutId":"${checkoutId}","successUrl":"https://${WIX_DOMAIN}/success"}`
  const redirectUrl = `${baseUrl}/_serverless/vercel-cookie-redirect/redirect-to-checkout?svToken=${svToken}${smToken ? `&token=${smToken}` : ''}&domain=${WIX_VIEWER_URL}&url=${checkoutUrl}`
  return {
    id: cart._id!,
    url: redirectUrl,
    customerId: '',
    email: '',
    createdAt: cart._createdDate!.toString(),
    currency: {
      code: cart.currency!
    },
    taxesIncluded: !!cart.taxIncludedInPrices,
    lineItems: cart.lineItems!.map(normalizeLineItem),
    lineItemsSubtotalPrice: +cart.subtotal!.amount!,
    subtotalPrice: +cart.subtotal!.amount!,
    totalPrice: Number(cart.subtotal!.amount!),
    discounts: []
  }
}

const URL_HASH_PREFIX = '#'
const WIX_PROTOCOL = 'wix:'
const WIX_IMAGE = 'image'

export function decodeText(s: string) {
  if (!s) {
    return s
  }

  return decodeURIComponent(s)
}

function alignIfLegacy(url: string, type: string): string {
  const { protocol } = new URL(url)

  return protocol === `${type}:` ? `${WIX_PROTOCOL}${url}` : url
}

function convertToImageUrl(val: string) {
  const alignedImage = alignIfLegacy(val, WIX_IMAGE)

  const { hash, pathname } = new URL(alignedImage)

  const { originHeight: height, originWidth: width } = parse(
    hash.replace(URL_HASH_PREFIX, '')
  )
  const [id, filenameOrAltText] = pathname
    .replace(`${WIX_IMAGE}://v1/`, '')
    .split('/')

  const decodedFilenameOrAltText = decodeText(filenameOrAltText)

  const res = { id, url: `https://static.wixstatic.com/media/${id}`, height: Number(height), width: Number(width) }

  if (!decodedFilenameOrAltText) {
    return res
  }

  return {
    ...res,
    altText: decodedFilenameOrAltText,
    filename: decodedFilenameOrAltText
  }
}

function normalizeLineItem({
  _id, productName, quantity, catalogReference, image, physicalProperties, price, priceBeforeDiscounts, descriptionLines
}: any): LineItem {
  return {
    id: _id!,
    variantId: catalogReference!.catalogItemId!,
    productId: catalogReference!.catalogItemId!,
    name: productName!.translated!,
    quantity: quantity!,
    variant: {
      id: catalogReference!.catalogItemId!,
      sku: physicalProperties?.sku ?? '',
      name: productName!.translated!,
      image: {
        url: convertToImageUrl(image)?.url! || '/product-img-placeholder.svg'
      },
      requiresShipping: physicalProperties?.shippable ?? false,
      price: Number(price?.amount),
      listPrice: Number(priceBeforeDiscounts?.amount)
    },
    path: '',
    discounts: [],
    options: descriptionLines!.map((line: any) => ({
      name: line.name.translated,
      value: line.colorInfo?.code || line.plainText?.translated
    }))
  }
}

export function normalizeOrder(order: any) {
  return {
    ...order,
    lineItems: order.lineItems?.map(normalizeOrderLineItem)
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
    options: descriptionLines.map((line: DescriptionLine) => ({
      name: line.name.translated,
      value: line.colorInfo?.code || line.plainText?.translated
    }))
  }
}

export const normalizeCategory = ({
  name,
  id
}: any): Category => ({
  id,
  name,
  slug: name,
  path: `/${name}`
})
