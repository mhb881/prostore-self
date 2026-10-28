"use client";

import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types/types";
import {
  ArrowRight,
  Minus,
  Plus,
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 提取数量调整按钮的渲染逻辑
  const renderQuantityButton = (type: "add" | "remove", item: CartItem) => {
    const Icon = type === "add" ? Plus : Minus;
    const handleClick = async () => {
      try {
        const res =
          type === "add"
            ? await addItemToCart(item)
            : await removeItemFromCart(item.productId);

        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
      } catch (error) {
        toast.error("操作失败，请重试");
      }
    };

    return (
      <Button
        disabled={isPending}
        variant={"outline"}
        size="icon"
        type="button"
        onClick={() => startTransition(handleClick)}
        aria-label={type === "add" ? "增加数量" : "减少数量"}
        className="hover:bg-accent h-8 w-8 transition-colors"
      >
        {isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </Button>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <ShoppingCart className="h-7 w-7" />
          购物车
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="text-muted-foreground mb-4 h-20 w-20 opacity-30" />
            <p className="text-foreground mb-4 text-xl font-medium">
              您的购物车是空的
            </p>
            <Button
              asChild
              className="from-primary to-secondary bg-gradient-to-r transition-all duration-200 hover:opacity-90"
            >
              <Link href="/">继续购物</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-6">
            <div className="overflow-x-auto md:col-span-3">
              <Table>
                <TableCaption className="text-muted-foreground">
                  您的购物车商品列表
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">商品</TableHead>
                    <TableHead className="text-center font-semibold">
                      数量
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      价格
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => {
                    return (
                      <TableRow
                        key={item.productId}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="relative overflow-hidden rounded-md">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <span className="text-foreground group-hover:text-primary font-medium transition-colors">
                              {item.name}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {renderQuantityButton("remove", item)}
                            <span className="min-w-[2rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            {renderQuantityButton("add", item)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <Card className="border-border/50 bg-card/80 shadow-md backdrop-blur-sm md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-border/50 space-y-2 border-b pb-4">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">小计</span>
                    <span className="font-medium">
                      {formatCurrency(cart.itemsPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">商品数量</span>
                    <span className="font-medium">
                      {cart.items.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>总计</span>
                  <span className="text-primary">
                    {formatCurrency(cart.itemsPrice)}
                  </span>
                </div>

                <Button
                  className="from-primary to-secondary h-12 w-full bg-gradient-to-r text-base shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                  disabled={isPending}
                  type="button"
                  onClick={() =>
                    startTransition(() => {
                      router.push("/shipping-address");
                    })
                  }
                >
                  {isPending ? (
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      去结算
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default CartTable;
