import "dotenv/config";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { Order } from "@/types/types";
import { formatCurrency } from "@/lib/utils";
import crypto from "node:crypto";

import sampleData from "@/db/sample-data";
interface OrderInformationProps {
  order: Order;
}

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main st",
      city: "New York",
      postalCode: "10001",
      country: "US",
    },
    createdAt: new Date(),
    totalPrice: "100",
    taxPrice: "10",
    shippingPrice: "10",
    itemsPrice: "80",
    orderitems: sampleData.products.map((x) => ({
      name: x.name,
      orderId: "123",
      productId: "123",
      slug: x.slug,
      quantity: x.stock,
      image: x.images[0],
      price: x.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: "123",
      status: "succeeded",
      pricePaid: "100",
      email_address: "test@test.com",
    },
  },
} satisfies OrderInformationProps;

const dateFormater = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "long",
});

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  const renderPrices = [
    { name: "商品金额", value: order.itemsPrice },
    { name: "运费", value: order.shippingPrice },
    { name: "税费", value: order.taxPrice },
    { name: "总计", value: order.totalPrice },
  ];
  return (
    <Html>
      <Preview>查看订单收据</Preview>
      <Tailwind>
        <Head />
        <Body className="mx-auto my-auto max-w-xl bg-white font-sans">
          <Container className="mx-auto my-10 w-full rounded-lg border border-solid border-[#eaeaea] p-5">
            <Heading>购买收据</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mr-4 mb-0 text-nowrap whitespace-nowrap text-gray-500">
                    订单编号
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>

                <Column>
                  <Text className="mr-4 mb-0 text-nowrap whitespace-nowrap text-gray-500">
                    购买日期
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormater.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className="mr-4 mb-0 text-nowrap whitespace-nowrap text-gray-500">
                    支付金额
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="rounded-lg border border-solid border-gray-500 p-4 md:p-6">
              {order.orderitems.map((item) => {
                return (
                  <Row key={item.slug} className="mt-8">
                    <Column>
                      <Img
                        src={
                          item.image.startsWith("/")
                            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                            : item.image
                        }
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </Column>
                    <Column className="align-top">
                      {item.name} x {item.quantity}
                    </Column>
                    <Column align="right" className="align-top">
                      {formatCurrency(item.price)}
                    </Column>
                  </Row>
                );
              })}
              {renderPrices.map(({ name, value }) => (
                <Row key={name} className="py-1">
                  <Column align="right" className="">
                    {name}
                  </Column>
                  <Column align="right" className="align-top" width={70}>
                    <Text className="m-0">{formatCurrency(value)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
