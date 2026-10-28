import CategoryForm from "../category-form";
import { getParentCategories } from "@/lib/actions/category.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "创建分类",
};

const CreateCategoryPage = async () => {
  const result = await getParentCategories();

  const parentCategories = result.success ? result.data : [];

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">创建分类</h1>
      <CategoryForm parentCategories={parentCategories} />
    </div>
  );
};

export default CreateCategoryPage;
