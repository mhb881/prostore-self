"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { insertCategorySchema, updateCategorySchema } from "@/lib/validators";
import { Category } from "@/lib/generated/prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { cnToEnSlug } from "@/lib/utils";

const NO_PARENT_VALUE = "none";

interface CategoryFormProps {
  category?:
    | (Category & { parent?: { id: string; name: string } | null })
    | null;
  parentCategories: { id: string; name: string }[];
}

const CategoryForm = ({ category, parentCategories }: CategoryFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   // 使用 useEffect 在客户端挂载后设置 mounted 状态，避免服务端与客户端渲染不一致
  //   // 由于这是初始化 mounted 状态，不会触发级联渲染，因此可以安全使用
  //   setMounted(true);
  // }, []);

  const form = useForm({
    resolver: zodResolver(
      category ? updateCategorySchema : insertCategorySchema,
    ),
    defaultValues: {
      id: category?.id || "",
      name: category?.name || "",
      slug: category?.slug || "",
      parentId: category?.parentId || NO_PARENT_VALUE,
    } as {
      id?: string;
      name: string;
      slug: string;
      parentId?: string | null;
    },
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof insertCategorySchema | typeof updateCategorySchema>
  > = async (data: Record<string, unknown>) => {
    startTransition(async () => {
      const submitData = {
        ...data,
        parentId: data.parentId === NO_PARENT_VALUE ? null : data.parentId,
      };

      const res = category
        ? await updateCategory(submitData)
        : await createCategory(submitData);

      if (res.success) {
        toast.success(res.message);
        router.push("/admin/categories");
      } else {
        toast.error(res.message);
      }
    });
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = cnToEnSlug(name);
      form.setValue("slug", slug);
    }
  };

  // if (!mounted) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6">
  //         <div className="flex h-40 items-center justify-center">
  //           <Loader2 className="text-primary h-8 w-8 animate-spin" />
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入分类名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="请输入 Slug" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateSlug}
                          className="cursor-pointer"
                        >
                          自动生成
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>父分类（可选）</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || NO_PARENT_VALUE}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择父分类（留空为顶级分类）" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_PARENT_VALUE}>
                        无（顶级分类）
                      </SelectItem>
                      {parentCategories.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {category ? "更新中..." : "创建中..."}
                  </>
                ) : category ? (
                  "更新分类"
                ) : (
                  "创建分类"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
