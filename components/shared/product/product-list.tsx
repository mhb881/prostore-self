"use client";

import ViewAllProductsButton from "@/components/view-all-products-button";
import ProductCard from "./product-card";
import { Product } from "@/types/types";
import { PackageOpen } from "lucide-react";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-8 space-y-6">
      {limitedData.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          {title && <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>}
          <div className="ml-auto">
            <ViewAllProductsButton />
          </div>
        </div>
      )}

      {limitedData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 transition-colors hover:border-gray-300 hover:bg-gray-50">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <PackageOpen className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700">暂无商品</p>
          <p className="mt-2 text-sm text-gray-500">请稍后再来查看</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
