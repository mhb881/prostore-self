"use server";

import { prisma } from "../../db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
    try {
        const data = await prisma.product.findMany({
            take: LATEST_PRODUCTS_LIMIT,          // 只获取4条数据
            orderBy: {
                createdAt: "desc",  // 按创建时间倒序（最新的在前）
            },
            include: {
                brand: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Transform the data to match the expected Product type
        // Convert Decimal values to strings and extract brand name
        const transformedData = data.map(product => ({
            ...product,
            price: product.price.toString(), // 关键：Decimal 类型转字符串（避免序列化问题）
            rating: Number(product.rating), // 把 Decimal 类型的评分转为普通数字（比如 4.5 → 4.5）
            brand: product.brand?.name || '', // 提取品牌名称：如果有品牌则取 name，否则为空字符串
        }));

        // 转换为普通对象并打印
        const plainData = convertToPlainObject(transformedData);

        return plainData;
    } catch (error) {
        // 增加错误处理，避免程序崩溃
        console.error('获取最新产品失败：', error);
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
                        name: true
                    }
                }
            }
        });

        return data;
    } catch (error) {
        console.error('获取产品失败：', error);
        throw error;
    }
}
