"use client";

import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Category, Product } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { cnToEnSlug } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import {
  Package,
  PackagePlus,
  ImagePlus,
  Star,
  AlignLeft,
  Loader2,
  X,
  Sparkles,
  DollarSign,
} from "lucide-react";

const ProductForm = ({
  type,
  product,
  productId,
  categories,
}: {
  type: "create" | "update";
  product?: Product;
  productId?: string;
  categories?: Category[];
}) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      type === "update" ? updateProductSchema : insertProductSchema,
    ),
    defaultValues:
      product && type === "update"
        ? (product as any)
        : (productDefaultValues as any),
  });

  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = cnToEnSlug(name);
      form.setValue("slug", slug);
      toast.success("Slug 已自动生成");
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    if (type === "create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/products");
      }
    }

    if (type === "update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/products");
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="text-primary h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>商品名称</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value ?? ""}
                      type="text"
                      placeholder="请输入商品名称"
                      className="h-10"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="slug"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        placeholder="URL 标识"
                        className="h-10"
                        aria-invalid={fieldState.invalid}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSlug}
                        className="shrink-0"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        生成
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>商品分类</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="brand_name"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>品牌</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value ?? ""}
                      type="text"
                      placeholder="请输入品牌名称"
                      className="h-10"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="text-primary h-5 w-5" />
              价格与库存
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>商品价格</FieldLabel>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                        ¥
                      </span>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-10 pl-7"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="stock"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-2"
                  >
                    <FieldLabel htmlFor={field.name}>库存数量</FieldLabel>
                    <div className="relative">
                      <PackagePlus className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        {...field}
                        id={field.name}
                        value={(field.value as number) || 0}
                        type="number"
                        placeholder="0"
                        className="h-10 pl-9"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImagePlus className="text-primary h-5 w-5" />
              商品图片
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Controller
              control={form.control}
              name="images"
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-3">商品图片列表</FieldLabel>
                  <div className="flex flex-wrap gap-3">
                    {images.map((image: string, index: number) => (
                      <div
                        key={image}
                        className="group relative overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={image}
                          alt={`商品图片 ${index + 1}`}
                          className="h-20 w-20 object-cover"
                          width={80}
                          height={80}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ))}
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("images", [...images, res[0].url]);
                        toast.success("图片上传成功");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`上传失败: ${error.message}`);
                      }}
                      className="ut-button:bg-primary ut-button:text-white"
                    />
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    点击上传或拖拽图片到此处，支持多张图片上传
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="text-primary h-5 w-5" />
              精选商品
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Controller
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5"
                  />
                  <span className="font-medium">设为精选商品</span>
                  <span className="text-muted-foreground text-xs">
                    (精选商品将在首页展示)
                  </span>
                </label>
              )}
            />
            {isFeatured && (
              <div className="mt-4 space-y-2">
                <FieldLabel>精选商品横幅图片</FieldLabel>
                {banner ? (
                  <div className="group relative overflow-hidden rounded-lg border">
                    <Image
                      src={banner}
                      alt="横幅图片"
                      className="w-full max-w-md object-cover"
                      width={600}
                      height={200}
                    />
                    <button
                      type="button"
                      onClick={() => form.setValue("banner", null)}
                      className="bg-destructive absolute top-2 right-2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("banner", res[0].url);
                      toast.success("横幅图片上传成功");
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`上传失败: ${error.message}`);
                    }}
                    className="ut-button:bg-primary ut-button:text-white"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlignLeft className="text-primary h-5 w-5" />
              商品描述
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    id={field.name}
                    value={field.value ?? ""}
                    placeholder="请输入商品描述..."
                    className="min-h-32 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    建议描述商品的特点、规格、使用方法等信息
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        <div className="bg-card flex gap-3 rounded-lg border p-4 shadow-sm">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : type === "create" ? (
              "创建商品"
            ) : (
              "保存修改"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
