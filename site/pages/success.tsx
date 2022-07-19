import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import useOrder from '@framework/order/use-order'
import { useRouter } from 'next/router'

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
  const { data } = useOrder({orderId: router.query.orderId})

  return (
    <Container className="pt-4">
      <Text variant="pageHeading">Thank you for purchasing {data.shippingInfo.shipmentDetails.address.fullName.firstName} {data.shippingInfo.shipmentDetails.address.fullName.lastName}</Text>
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        You just bought:
        {data.lineItems.map((item: any) => {
          return (
            <span><b>{item.name}</b> at {item.price}</span>
          )
        })}
        <br/>
        We will ship to {data.shippingInfo.shipmentDetails.address.addressLine1} {data.shippingInfo.shipmentDetails.address.city} {data.shippingInfo.shipmentDetails.address.country}
      </div>
    </Container>
  )
}

Success.Layout = Layout
