"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
  maxVisiblePages?: number;
};

const Pagination = ({
  page,
  totalPages,
  urlParamName,
  maxVisiblePages = 5,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(page);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage)
      return;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageNumber.toString(),
    });

    router.push(newUrl);
  };

  /**
   * 根据当前页码和最大可见页数，生成要展示的页码数组
   * 规则：
   * 1. 始终显示第一页和最后一页
   * 2. 当前页尽量居中，两侧各显示 halfVisible 页
   * 3. 当靠近边界时，优先保证 maxVisiblePages 数量
   * 4. 省略号“...”表示被折叠的页码区间
   */
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2); // 当前页一侧最多可见页数

    // 计算初始可见区间 [startPage, endPage]
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 如果当前页靠近首页，则向后扩展，保证可见页数达到 maxVisiblePages
    if (currentPage - halfVisible <= 1) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    // 如果当前页靠近尾页，则向前扩展，保证可见页数达到 maxVisiblePages
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // 首页处理：若起始页大于 1，则插入首页及可能的省略号
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // 插入当前可见区间内的所有页码
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // 尾页处理：若结束页小于总页数，则插入可能的省略号及尾页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 cursor-pointer p-0"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum, index) => (
        <Button
          key={index}
          variant={pageNum === currentPage ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-9 min-w-9 cursor-pointer p-0",
            pageNum === "..." && "pointer-events-none",
          )}
          onClick={() => typeof pageNum === "number" && goToPage(pageNum)}
          disabled={pageNum === currentPage || pageNum === "..."}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 cursor-pointer p-0"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
