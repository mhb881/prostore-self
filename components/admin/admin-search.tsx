"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

// 统一的搜索栏，可以搜索用户、产品、订单等
const AdminSearch = () => {
  // 首先我们需要获取 URL
  const pathname = usePathname();
  let formActionUrl = "";
  if (pathname.includes("/admin/orders")) {
    formActionUrl = "/admin/orders";
  } else if (pathname.includes("/admin/users")) {
    formActionUrl = "/admin/users";
  } else if (pathname.includes("/admin/products")) {
    formActionUrl = "/admin/products";
  } else if (pathname.includes("/admin/categories")) {
    formActionUrl = "/admin/categories";
  } else if (pathname.includes("/admin/reviews")) {
    formActionUrl = "/admin/reviews";
  }

  // 获取搜索参数
  const searchParams = useSearchParams();

  // 使用一个ref来跟踪是否是首次渲染
  const [queryValue, setQueryValue] = useState(
    () => searchParams.get("query") || "",
  );

  // 不再需要useEffect来同步初始值，因为已经在useState中处理了
  // 如果需要在搜索参数变化时更新状态，应该使用自定义hook或更复杂的逻辑

  return (
    <form action={formActionUrl} method="GET" className="relative">
      <Input
        type="text"
        name="query"
        placeholder="搜索..."
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="pl-10 md:w-25 lg:w-72"
      />
      <button type="submit" className="cursor-pointer">
        <Search
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
          size={18}
        />
      </button>
    </form>
  );
};

export default AdminSearch;
