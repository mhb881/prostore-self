import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// 处理 Supabase 连接池模式：
// 如果使用的是 pooler.supabase.com:5432 (Session Mode)，并发打满 15 个连接会导致 EMAXCONNSESSION
// 自动转换为 6543 (Transaction Mode)，完美适配 Serverless 与 Next.js 生产构建并发
const getConnectionString = () => {
  const rawUrl = process.env.DATABASE_URL || "";
  if (rawUrl.includes("pooler.supabase.com:5432")) {
    return rawUrl.replace("pooler.supabase.com:5432", "pooler.supabase.com:6543");
  }
  return rawUrl;
};

const connectionString = getConnectionString();

// 类型断言：将 Node.js 的 global 对象转为包含 prisma 和 pool 属性的类型
const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof createPrismaClient>;
  pool: Pool;
};

const pool =
  globalForPrisma.pool ||
  new Pool({
    connectionString,
    max: 5, // 限制连接池上限，防止突发流量或构建并发打满连接数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

globalForPrisma.pool = pool;

const createPrismaClient = () => {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter }).$extends({
    result: {
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      orderItem: {
        price: {
          needs: { price: true },
          compute(orderItem) {
            return orderItem.price.toString();
          },
        },
      },
    },
  });
};

// 单例检查 ：如果全局变量中已存在实例，则复用；否则创建新实例
const prisma = globalForPrisma.prisma || createPrismaClient();

// 无论开发还是生产环境，统一持久化到 global，避免 Next.js 页面预渲染多 worker 重复实例化
globalForPrisma.prisma = prisma;

export { prisma };
