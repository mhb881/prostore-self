import ProductForm from "@/components/admin/product-form";
import { getCategoryTree } from "@/lib/actions/category.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "创建商品",
};

const CreateProductPage = async () => {
  const categories = await getCategoryTree();

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="h2-bold">Update Product</h1>
        <ProductForm
          type="create"
          categories={categories.success ? categories.data : []}
        />
      </div>
    </>
  );
};

export default CreateProductPage;
