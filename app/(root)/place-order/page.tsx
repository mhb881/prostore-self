import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
  title: "提交订单",
};

const PlaceOredrPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("用户不存在");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }
  if (!user.address) {
    redirect("/shipping-address");
  }
  if (!user.paymentMethod) {
    redirect("/payment-method");
  }

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">提交订单</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">收货地址</h2>
              <p>
                {userAddress.address}, {userAddress.city},{" "}
                {userAddress.postalCode}, {userAddress.country}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address" className="text-primary">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer transition-colors"
                  >
                    编辑收货地址
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">支付方式</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/payment-method" className="text-primary">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer transition-colors"
                  >
                    编辑支付方式
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">订单商品</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">商品</TableHead>
                    <TableHead className="">数量</TableHead>
                    <TableHead className="text-right">价格</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="relative overflow-hidden rounded-md">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <span className="text-foreground group-hover:text-primary font-medium transition-colors">
                            {item.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="">
          <Card>
            <CardContent className="gap-4 space-y-4 p-4">
              <div className="flex justify-between">
                <div className="">商品金额</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">税费</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">运费</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">总计</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>

              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOredrPage;
