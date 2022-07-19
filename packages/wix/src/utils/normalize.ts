import type { Cart, LineItem } from '../types/cart'
import type { Category } from '../types/site'
import { WIX_VIEWER_URL, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE } from '../const'
import { getCustomerToken } from './customer-token'
import Cookies from 'js-cookie'

const money = ({ price, currency }: any) => {
  return {
    value: +price,
    currencyCode: currency
  }
}

const normalizeProductOption = ({
  name: displayName,
  choices
}: any) => {
  return {
    displayName,
    values: choices.map((choice: any) => {
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

const normalizeProductImages = ({ items }: any) =>
  items?.map((i: any) => i.image)

export function normalizeProduct({
  id,
  name,
  brand,
  media,
  variants,
  description,
  descriptionHtml,
  price,
  slug,
  convertedPriceData,
  productOptions,
  metafields,
  ...rest
}: any): any {
  return {
    id,
    name: name,
    vendor: brand || '',
    path: `/${slug}`,
    slug: slug?.replace(/^\/+|\/+$/g, ''),
    price: money(convertedPriceData),
    images: normalizeProductImages(media),
    variants: [],
    options: productOptions
      ? productOptions
        .map((o: any) => normalizeProductOption(o))
      : [],
    ...(description && { description }),
    ...(descriptionHtml && { descriptionHtml }),
    ...rest
  }
}

export function normalizeCart({cart, checkoutId}: any): Cart {
  const smToken = getCustomerToken()
  const svToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE)
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
    totalPrice: cart.subtotal?.amount,
    discounts: []
  }
}

function normalizeLineItem({
  id, productName, quantity, catalogReference, image, physicalProperties, price, priceBeforeDiscounts, url, descriptionLines
}: any): LineItem {
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
      price: price?.amount,
      listPrice: priceBeforeDiscounts?.amount
    },
    path: String(url.relativePath.split('/')[2]),
    discounts: [],
    options: descriptionLines.map((line: any) => ({name: line.name.translated, value: line.colorInfo?.code || line.plainText?.translated}))
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
