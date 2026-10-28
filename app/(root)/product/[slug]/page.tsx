import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Star, Package, ShieldCheck, Truck } from "lucide-react";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ProductImages images={product.images} />
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-6">
            <div>
              {product.brand?.name && (
                <Badge variant="secondary" className="mb-3">
                  {product.brand.name}
                </Badge>
              )}
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">
                  {Number(product.rating).toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({product.numReviews} 条评价)
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>

            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
              <ProductPrice
                value={Number(product.price)}
                className="text-2xl font-bold text-green-700 dark:text-green-400"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">商品描述</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="text-primary h-6 w-6" />
                <span className="text-muted-foreground text-xs">免费配送</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="text-primary h-6 w-6" />
                <span className="text-muted-foreground text-xs">正品保障</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Package className="text-primary h-6 w-6" />
                <span className="text-muted-foreground text-xs">7天退换</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="sticky top-24 border-0 shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">价格</span>
                <ProductPrice
                  value={Number(product.price)}
                  className="text-xl font-bold"
                />
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-muted-foreground">库存状态</span>
                {product.stock > 0 ? (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600"
                  >
                    有货 ({product.stock} 件)
                  </Badge>
                ) : (
                  <Badge variant="destructive">缺货</Badge>
                )}
              </div>

              <div className="border-t pt-4">
                {product.stock > 0 ? (
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price.toString(),
                      quantity: 1,
                      image: product.images![0],
                    }}
                  />
                ) : (
                  <Button disabled className="w-full">
                    暂时缺货
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
