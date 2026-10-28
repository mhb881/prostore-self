"use server";

import { prisma } from "../../db/prisma";
import { formatErrors } from "../utils";
import { revalidatePath } from "next/cache";
import { insertCategorySchema, updateCategorySchema } from "../validators";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";

export async function getAllCategoriesNoLimit({ query }: { query: string }) {
  try {
    const queryFilter: Prisma.CategoryWhereInput =
      query && query !== "all"
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          }
        : {};

    // 获取分类
    const categories = await prisma.category.findMany({
      where: { ...queryFilter },
      include: {
        parent: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 批量获取分类名称列表
    const categoryNames = categories.map((c) => c.name);

    // // 一次性获取所有分类的商品
    // const allProducts = await prisma.product.findMany({
    //     where: { category: { in: categoryNames } },
    //     select: {
    //         id: true,
    //         category: true
    //     }
    // });

    // // 按分类名称分组产品
    // const productsByCategory = allProducts.reduce((acc, product) => {
    //     if (!acc[product.category]) {
    //         acc[product.category] = [];
    //     }
    //     acc[product.category].push(product);
    //     return acc;
    // }, {} as Record<string, typeof allProducts>);

    // 使用groupBy一次性获取所有分类的商品数量
    const productCountMap = await prisma.product.groupBy({
      by: ["category"],
      where: { category: { in: categoryNames } },
      _count: { id: true },
    });

    // 转换为映射表
    const countMap = Object.fromEntries(
      productCountMap.map((item) => [item.category, item._count.id]),
    );

    return {
      success: true,
      data: categories.map((category) => ({
        ...category,
        productCount: countMap[category.name] || 0,
        parentName: category.parent?.name || null,
      })),
    };
  } catch (error) {
    return { success: false, message: formatErrors(error), data: [] };
  }
}

export async function getAllCategories({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query: string;
}) {
  try {
    const queryFilter: Prisma.CategoryWhereInput =
      query && query !== "all"
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          }
        : {};

    const categories = await prisma.category.findMany({
      where: { ...queryFilter },
      include: {
        parent: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 批量获取分类名称列表
    const categoryNames = categories.map((c) => c.name);

    // 使用groupBy一次性获取所有分类的商品数量
    const productCountMap = await prisma.product.groupBy({
      by: ["category"],
      where: { category: { in: categoryNames } },
      _count: { id: true },
    });

    // 转换为映射表
    const countMap = Object.fromEntries(
      productCountMap.map((item) => [item.category, item._count.id]),
    );

    const dataCount = await prisma.category.count();

    return {
      success: true,
      data: categories.map((category) => ({
        ...category,
        productCount: countMap[category.name] || 0,
        parentName: category.parent?.name || null,
      })),
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    return { success: false, message: formatErrors(error), data: [] };
  }
}

export async function getCategoryTree() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    // 优化：先查所有分类，再批量统计商品数（减少数据库请求）
    // 一次数据库批量统计所有分类的商品数，大幅减少数据库请求次数（从 N 次 → 1 次），显著提升接口响应速度。
    /*
        作用：从第一步查询到的所有分类（categories）中，提取出所有分类的 name 字段，
        生成一个字符串数组（比如 ["电子产品", "服装", "食品"]）。
        目的：为后续批量统计提供 “分类名称列表”，让数据库知道要统计哪些分类的商品数。
        */
    const categoryNames = categories.map((c) => c.name);
    /*
        by: ["category"]：按 Product 表的 category 字段分组（即 “按分类名称分组”）；
        where: { category: { in: categoryNames } }：只统计指定名称的分类下的商品数（即 “按分类名称分组” 下的 “商品数”）。
        _count: { id: true }：统计每个分类下的商品数（即 “按分类名称分组” 下的 “商品数”）。
         */
    const productCountMap = await prisma.product.groupBy({
      by: ["category"],
      where: { category: { in: categoryNames } },
      _count: { id: true },
    });

    /*
        转换为映射表
        productCountMap.map(...)：将分组结果转换为「键值对数组」，比如 [["电子产品", 50], ["服装", 30]]；
        Object.fromEntries()：将键值对数组转换为普通对象（映射表），最终 countMap 结构：{ "电子产品": 50, "服装": 30 }。
         */
    const countMap = Object.fromEntries(
      productCountMap.map((item) => [item.category, item._count.id]),
    );
    /*
        遍历所有分类（categories），为每个分类补充商品数量：
        ...category：保留原分类的所有字段（id/name/slug/children 等）；
        _count: { products: countMap[category.name] || 0 }：从映射表 countMap 中取当前分类的商品数，若该分类无商品（countMap 中无对应值），则默认赋值 0
         */
    const categoriesWithCount = categories.map((category) => ({
      ...category,
      _count: { products: countMap[category.name] || 0 },
    }));

    return { success: true, data: categoriesWithCount };
  } catch (error) {
    return { success: false, message: formatErrors(error), data: [] };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findFirst({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true },
        },
      },
    });

    if (!category) throw new Error("分类不存在");

    return { success: true, data: category };
  } catch (error) {
    return { success: false, message: formatErrors(error), data: null };
  }
}

export async function createCategory(data: unknown) {
  try {
    const category = insertCategorySchema.parse(data);

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: category.name }, { slug: category.slug }],
      },
    });

    if (existingCategory) {
      if (existingCategory.name === category.name) {
        throw new Error("分类名称已存在");
      }
      if (existingCategory.slug === category.slug) {
        throw new Error("Slug 已存在");
      }
    }

    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || null,
      },
    });

    revalidatePath("/admin/categories");

    return { success: true, message: "分类创建成功" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

export async function updateCategory(data: unknown) {
  try {
    const category = updateCategorySchema.parse(data);

    const existingCategory = await prisma.category.findFirst({
      where: { id: category.id },
    });

    if (!existingCategory) throw new Error("分类不存在");

    const duplicateCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: category.name }, { slug: category.slug }],
        NOT: { id: category.id },
      },
    });

    if (duplicateCategory) {
      if (duplicateCategory.name === category.name) {
        throw new Error("分类名称已存在");
      }
      if (duplicateCategory.slug === category.slug) {
        throw new Error("Slug 已存在");
      }
    }

    await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || null,
      },
    });

    revalidatePath("/admin/categories");

    return { success: true, message: "分类更新成功" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findFirst({
      where: { id },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) throw new Error("分类不存在");

    if (category._count.products > 0) {
      throw new Error("该分类下存在商品，无法删除");
    }

    if (category._count.children > 0) {
      throw new Error("该分类下存在子分类，无法删除");
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");

    return { success: true, message: "分类删除成功" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

export async function getParentCategories(excludeId?: string) {
  try {
    const where = excludeId
      ? {
          AND: [{ parentId: null }, { NOT: { id: excludeId } }],
        }
      : { parentId: null };

    const categories = await prisma.category.findMany({
      where,
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, message: formatErrors(error), data: [] };
  }
}
