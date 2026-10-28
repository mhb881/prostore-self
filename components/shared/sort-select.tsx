"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const sortOrders = [
  { label: "最新上架", value: "newest" },
  { label: "价格最低", value: "lowest" },
  { label: "价格最高", value: "highest" },
  { label: "评分最高", value: "rating" },
];

interface SortSelectProps {
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
}

const SortSelect = ({
  query = "all",
  category = "all",
  price = "all",
  rating = "all",
  sort = "newest",
  page = "1",
}: SortSelectProps) => {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams();
    if (query && query !== "all") params.append("query", query);
    if (category && category !== "all") params.append("category", category);
    if (price && price !== "all") params.append("price", price);
    if (rating && rating !== "all") params.append("rating", rating);
    if (value && value !== "all") params.append("sort", value);
    if (page && page !== "1") params.append("page", page);

    router.push(`/search?${params.toString()}`);
  };

  const currentSort = sortOrders.find((o) => o.value === sort);

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="text-muted-foreground h-4 w-4" />
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className="border-muted-foreground w-35 cursor-pointer border-2 bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="排序方式">
            {currentSort?.label || "排序"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectItem className="cursor-pointer" value="all">
              默认排序
            </SelectItem>
            {sortOrders.map((o) => (
              <SelectItem
                className="cursor-pointer"
                key={o.value}
                value={o.value}
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
