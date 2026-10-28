"use server";

import { prisma } from "../../db/prisma";
import { convertToPlainObject, formatErrors } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

// Get latest products
export async function getLatestProducts() {
  try {
    const data = await prisma.product.findMany({
      take: LATEST_PRODUCTS_LIMIT, // 只获取4条数据
      orderBy: {
        createdAt: "desc", // 按创建时间倒序（最新的在前）
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform the data to match the expected Product type
    // Convert Decimal values to strings and extract brand name
    const transformedData = data.map((product) => ({
      ...product,
      price: product.price.toString(),
      rating: Number(product.rating),
      brand_name: product.brand?.name || null,
    }));

    // 转换为普通对象并打印
    const plainData = convertToPlainObject(transformedData);

    return plainData;
  } catch (error) {
    // 增加错误处理，避免程序崩溃
    console.error("获取最新产品失败：", error);
    throw error; // 抛出错误让调用方处理
  }
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  try {
    const data = await prisma.product.findFirst({
      where: { slug },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!data) return null;

    const transformedData = {
      ...data,
      price: data.price.toString(),
      rating: Number(data.rating),
      brand_name: data.brand?.name || null,
    };

    return transformedData;
  } catch (error) {
    console.error("获取产品失败：", error);
    throw error;
  }
}

// Get single product by it's ID
export async function getProductById(id: string) {
  try {
    const data = await prisma.product.findFirst({
      where: { id },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!data) return null;

    const transformedData = {
      ...data,
      price: data.price.toString(),
      rating: Number(data.rating),
      brand_name: data.brand?.name || null,
    };

    return transformedData;
  } catch (error) {
    console.error("获取产品失败：", error);
    throw error;
  }
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
  });

  // Transform the data to match the expected Product type
  // Convert Decimal values to strings and extract brand name
  const transformedData = data.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
    brand_name: product.brand?.name || null,
  }));

  // 转换为普通对象并打印
  const plainData = convertToPlainObject(transformedData);

  return {
    data: plainData,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    const brand = await prisma.brand.findFirst({
      where: { name: product.brand_name || "" },
    });

    // 简单说： brand_name 是给前端用的， brandId 是给数据库用的 ，两者需要转换。
    const { brand_name, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        brandId: brand?.id || null,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const { id, brand_name, ...rest } = product;

    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    const brand = await prisma.brand.findFirst({
      where: { name: brand_name || "" },
    });

    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        brandId: brand?.id || null,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      brand: {
        select: {
          name: true,
        },
      },
    },
  });

  const transformedData = data.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
    brand_name: product.brand?.name || null,
  }));

  return convertToPlainObject(transformedData);
}
