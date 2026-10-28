"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { LoaderCircle } from "lucide-react";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
}: {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (isPending) {
      return <LoaderCircle className="text-primary w-full animate-spin" />;
    } else if (isRejected) {
      return (
        <div className="text-destructive flex h-40 items-center justify-center text-center">
          PayPal 加载失败
        </div>
      );
    }
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, {
      orderID: data.orderID,
    });

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          })
        }
      >
        {isPending ? "处理中..." : "标记为已支付"}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          })
        }
      >
        {isPending ? "处理中..." : "标记为已发货"}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl">订单 {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">支付方式</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge className="" variant={"secondary"}>
                  已支付于 {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge className="" variant={"destructive"}>
                  未支付
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="my-2">
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">收货地址</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge className="" variant={"secondary"}>
                  已发货于 {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge className="" variant={"destructive"}>
                  未发货
                </Badge>
              )}
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
                  {orderitems.map((item) => (
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
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">税费</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">运费</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div className="">总计</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/* PayPal Payment */}
              {!isPaid && paymentMethod === "PayPal" && (
                <div className="w-full">
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    {/* 加载状态占位，避免按钮跳动 */}
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Cash on Delivery */}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
