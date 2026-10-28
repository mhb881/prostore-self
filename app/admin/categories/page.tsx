import Link from "next/link";
import {
  getAllCategories,
  deleteCategory,
} from "@/lib/actions/category.actions";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "分类管理",
};

const AdminCategoriesPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  await requireAdmin();
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";

  const result = await getAllCategories({ page, query: searchText });

  if (!result.success || !result.data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">{result.message}</p>
      </div>
    );
  }

  const categories = result.data;
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">分类管理</h1>
          {searchText && (
            <div>
              已按 <i>&quot;{searchText}&quot;</i> 过滤{" "}
              <Link href="/admin/categories">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  清除过滤
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default">
          <Link href="/admin/categories/create">创建分类</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>父分类</TableHead>
            <TableHead className="text-center">商品数量</TableHead>
            <TableHead className="w-25">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground text-center"
              >
                暂无分类数据
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{formatId(category.id)}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <code className="bg-muted rounded px-2 py-1 text-sm">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell>
                  {category.parentName ? (
                    <Badge variant="secondary">{category.parentName}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{category.productCount}</Badge>
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/categories/${category.id}`}>编辑</Link>
                  </Button>
                  <DeleteDialog id={category.id} action={deleteCategory} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </div>
  );
};

export default AdminCategoriesPage;
