import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types/types";
import { Star, Package } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group w-full gap-0 overflow-hidden border-0 border-black p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="eager"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                售罄
              </span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {product.brand_name && (
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
            {product.brand_name}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h2 className="group-hover:text-primary mb-2 line-clamp-2 text-sm leading-tight font-medium transition-colors">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-muted-foreground text-sm">
              {Number(product.rating).toFixed(1)}
            </span>
          </div>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <div className="text-destructive flex items-center gap-1 text-sm">
              <Package className="h-4 w-4" />
              <span>缺货</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
