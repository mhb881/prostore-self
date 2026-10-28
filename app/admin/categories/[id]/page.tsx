import CategoryForm from "../category-form";
import { getCategoryById, getParentCategories } from "@/lib/actions/category.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "编辑分类",
};

const EditCategoryPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;
  const { id } = params;

  const [categoryResult, parentResult] = await Promise.all([
    getCategoryById(id),
    getParentCategories(id),
  ]);

  if (!categoryResult.success || !categoryResult.data) {
    notFound();
  }

  const parentCategories = parentResult.success ? parentResult.data : [];

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">编辑分类</h1>
      <CategoryForm
        category={categoryResult.data}
        parentCategories={parentCategories}
      />
    </div>
  );
};

export default EditCategoryPage;
