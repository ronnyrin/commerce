import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import useOrder from '@framework/order/use-order'
import { useRouter } from 'next/router'
import { CartItem } from '@components/cart'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

export default function Success() {
  const router = useRouter()
  const { data, isLoading } = useOrder({orderId: router.query.orderId})
  return !isLoading && (
    <Container className="pt-4">
      <Text variant="pageHeading">Thank you for purchasing {data.billingInfo.contactDetails.firstName} {data.billingInfo.contactDetails.lastName}</Text>
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        You just bought:
        <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b border-accent-2">
          {data!.lineItems.map((item: any) => (
            <CartItem
              hideButtons={true}
              key={item.id}
              item={item}
              currencyCode={data?.currency.code!}
            />
          ))}
        </ul>
        <br/>
        We will ship to {data.shippingInfo.logistics.shippingDestination.address.addressLine}, {data.shippingInfo.logistics.shippingDestination.address.city}, {data.shippingInfo.logistics.shippingDestination.address.subdivisionFullname}, {data.shippingInfo.logistics.shippingDestination.address.countryFullname}
      </div>
    </Container>
  )
}

Success.Layout = Layout
