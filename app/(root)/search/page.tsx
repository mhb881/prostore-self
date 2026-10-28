import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllCategoriesNoLimit } from "@/lib/actions/category.actions";
import { getAllProducts } from "@/lib/actions/product.actions";
import { Product } from "@/types/types";
import { PackageOpen, X, Filter } from "lucide-react";
import Link from "next/link";
import SortSelect from "@/components/shared/sort-select";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/shared/pagination";
const priceRange = [
  { label: "所有", value: "all" },
  { label: "0-100", value: "0-100" },
  { label: "100-200", value: "100-200" },
  { label: "200-500", value: "200-500" },
  { label: "500-800", value: "500-800" },
  { label: "800以上", value: "800-999999" },
];

const ratings = [4, 3, 2, 1];

const SearchPage = async (props: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const getFilterUrl = (filters: {
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }) => {
    const params = new URLSearchParams();

    const finalQuery = filters.query ?? query;
    const finalCategory = filters.category ?? category;
    const finalPrice = filters.price ?? price;
    const finalRating = filters.rating ?? rating;
    const finalSort = filters.sort ?? sort;
    const finalPage = filters.page ?? page;

    if (finalQuery && finalQuery !== "all") params.append("query", finalQuery);
    if (finalCategory && finalCategory !== "all")
      params.append("category", finalCategory);
    if (finalPrice && finalPrice !== "all") params.append("price", finalPrice);
    if (finalRating && finalRating !== "all")
      params.append("rating", finalRating);
    if (finalSort && finalSort !== "all") params.append("sort", finalSort);
    if (finalPage && finalPage !== "1") params.append("page", finalPage);

    return `/search?${params.toString()}`;
  };

  const products = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: Number(page),
    limit: 12,
  });

  const categories = await getAllCategoriesNoLimit({ query: "" });

  const hasFilters =
    (query !== "all" && query !== "") ||
    (category !== "all" && category !== "") ||
    (price !== "all" && price !== "") ||
    (rating !== "all" && rating !== "");

  return (
    <div className="grid md:grid-cols-5 md:gap-6">
      <div className="bg-card space-y-6 rounded-lg border p-4 md:sticky md:top-4 md:h-fit">
        <div className="flex items-center gap-2 border-b pb-3">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">筛选条件</h3>
        </div>

        <div>
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
            类别
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link
                className={`hover:bg-accent block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  category === "all" || category === ""
                    ? "bg-accent text-primary font-medium"
                    : ""
                }`}
                href={getFilterUrl({ category: "all" })}
              >
                所有
              </Link>
            </li>
            {categories.data.map((c) => (
              <li key={c.name}>
                <Link
                  className={`hover:bg-accent block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    category === c.name
                      ? "bg-accent text-primary font-medium"
                      : ""
                  }`}
                  href={getFilterUrl({ category: c.name })}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
            价格范围
          </h4>
          <ul className="space-y-1.5">
            {priceRange.map((p) => (
              <li key={p.value}>
                <Link
                  className={`hover:bg-accent block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    price === p.value
                      ? "bg-accent text-primary font-medium"
                      : ""
                  }`}
                  href={getFilterUrl({ price: p.value })}
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
            评分
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link
                className={`hover:bg-accent block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  rating === "all" || rating === ""
                    ? "bg-accent text-primary font-medium"
                    : ""
                }`}
                href={getFilterUrl({ rating: "all" })}
              >
                所有
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`hover:bg-accent block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    rating === r.toString()
                      ? "bg-accent text-primary font-medium"
                      : ""
                  }`}
                  href={getFilterUrl({ rating: r.toString() })}
                >
                  {r} 星及以上
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4 md:col-span-4">
        <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              共{" "}
              <span className="text-foreground font-medium">
                {products.data.length}
              </span>{" "}
              个商品
            </span>

            {hasFilters && (
              <>
                <span className="text-muted-foreground">|</span>
                <div className="flex flex-wrap gap-1.5">
                  {query !== "all" && query !== "" && (
                    <Badge variant="secondary" className="gap-1">
                      搜索: {query}
                    </Badge>
                  )}
                  {category !== "all" && category !== "" && (
                    <Badge variant="secondary" className="gap-1">
                      类别: {category}
                    </Badge>
                  )}
                  {price !== "all" && price !== "" && (
                    <Badge variant="secondary" className="gap-1">
                      价格: {price}
                    </Badge>
                  )}
                  {rating !== "all" && rating !== "" && (
                    <Badge variant="secondary" className="gap-1">
                      评分: {rating}星
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-auto md:ml-0"
                >
                  <Link href="/search" className="gap-1">
                    <X className="h-3 w-3" />
                    重置
                  </Link>
                </Button>
              </>
            )}
          </div>

          <SortSelect
            query={query}
            category={category}
            price={price}
            rating={rating}
            sort={sort}
            page={page}
          />
        </div>

        {products.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {products.data.map((product: Product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 transition-colors hover:border-gray-300 hover:bg-gray-50">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <PackageOpen className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">暂无商品</p>
            <p className="mt-2 text-sm text-gray-500">
              请调整筛选条件或稍后再来查看
            </p>
          </div>
        )}

        {products.totalPages > 1 && (
          <Pagination page={page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
