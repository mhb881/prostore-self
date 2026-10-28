import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, compareSync } from "bcrypt-ts";
import { cookies } from "next/headers";
import { CartItem } from "./types/types";
import { authConfig } from "./auth.config";
import { updateProfileSchema } from "./lib/validators";

// 合并购物车商品的函数
function mergeCartItems(
  userItems: CartItem[],
  sessionItems: CartItem[],
): CartItem[] {
  // 创建一个Map来存储商品，键为商品ID
  const itemsMap = new Map<string, CartItem>();

  // 先添加用户购物车的商品
  userItems.forEach((item) => {
    itemsMap.set(item.productId, { ...item });
  });

  // 然后添加游客购物车的商品，如果商品已存在则增加数量
  sessionItems.forEach((item) => {
    if (itemsMap.has(item.productId)) {
      // 商品已存在，增加数量
      const existingItem = itemsMap.get(item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        itemsMap.set(item.productId, existingItem);
      }
    } else {
      // 商品不存在，直接添加
      itemsMap.set(item.productId, { ...item });
    }
  });

  // 将Map转换回数组
  return Array.from(itemsMap.values());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
    signOut: "/sign-out",
  },
  session: {
    strategy: "jwt" as const, // 会话存储策略：使用 JWT（不依赖数据库存储会话） 登录状态存在 JWT 里,用 cookie 存 JWT
    maxAge: 30 * 24 * 60 * 60, // 会话有效期：30 天（单位：秒）
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // 定义前端表单需要收集的字段（邮箱、密码）
    CredentialsProvider({
      // 凭证对象
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // 核心验证函数：接收前端传的 credentials（邮箱+密码），返回用户/空
      /*
            执行流程是：
            前端调用 signIn("credentials")
            Auth.js 调用 authorize()
            你查数据库
            返回 user 或 null
            如果返回 user → 自动生成 JWT
             */
      async authorize(credentials) {
        // 这是包含来着我们表单数据的对象
        // 1. 校验凭证是否存在
        if (credentials == null) return null;

        // 2. 根据邮箱查数据库中的用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // 3. 校验用户存在 + 密码匹配
        if (user && user.password) {
          // 对比「用户输入的密码」和「数据库加密密码」
          const isMatch = await compare(
            credentials.password as string,
            user.password,
          );
          // 密码正确则返回用户（NextAuth 会自动处理登录）
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // 4. 无用户/密码错误，返回 null（登录失败）
        return null;
      },
    }),
  ],
  // 回调函数（扩展会话信息）
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // 1. 给会话添加用户 ID（token.sub 是 JWT 中默认存储的用户唯一标识）
      // 让前端能拿到 user.id
      session.user.id = token.sub; // sub is the user ID
      session.user.role = token.role;
      session.user.name = token.name;

      // 每次获取 session 时都从数据库读取最新的用户数据
      // 每次拉取 session 时都刷新用户最新资料，保证前端展示实时
      if (token.sub) {
        // 只查必要字段，减少 IO；用 select 避免查 password 等敏感列
        const latestUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { name: true, email: true },
        });

        if (latestUser) {
          // 直接覆写，保证与库一致
          session.user.name = latestUser.name;
          session.user.email = latestUser.email;
        }
      }

      // If there is an update, set the user name
      // 2. 当触发「update」（比如用户信息更新）时，同步用户名到会话
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session; // 返回扩展后的会话对象
    },
    // 这段代码是 Auth.js（NextAuth.js）的 jwt 回调函数，核心作用是自定义 JWT Token 的内容：在生成 / 刷新 Token 时，为 Token 补充用户角色信息
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (!user) return token; // 仅在用户首次登录时触发（user 对象仅此时存在）
      token.id = user.id;
      token.role = user.role; // 将用户的角色信息添加到 JWT Token 中

      // 如果用户名为 NO_NAME，则用邮箱前缀作为用户名
      if (user.name === "NO_NAME" && user.email) {
        // 截取邮箱@前的部分作为新用户名（如 admin@example.com → admin）
        token.name = user.email!.split("@")[0]; // 非空断言操作符（TypeScript 语法）确定 user.email 这个值绝对不是 null 或 undefined

        // Update database to reflect the token name
        // 同步更新数据库中的用户名，确保数据一致性
        await prisma.user.update({
          where: { id: user.id }, // 按用户ID定位
          data: { name: token.name }, // 更新name字段
        });
      }

      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        if (!sessionCartId) return token;
        // 你保证的是 查询时存在，而不是 更新时仍然存在。
        const sessionCart = await prisma.cart.findFirst({
          where: { sessionCartId },
        });

        if (!sessionCart) return token;
        // 查找用户现有的购物车
        const userCart = await prisma.cart.findFirst({
          where: { userId: user.id },
        });

        if (userCart) {
          // 合并购物车：将游客购物车的商品添加到用户购物车
          const mergedItems = mergeCartItems(
            (userCart.items as CartItem[]) ?? [],
            (sessionCart.items as CartItem[]) ?? [],
          );

          // 更新用户购物车
          await prisma.cart.update({
            where: { id: userCart.id },
            data: { items: mergedItems as CartItem[] },
          });

          // 删除游客购物车
          await prisma.cart.delete({
            where: { id: sessionCart.id },
          });
        } else {
          // 安全分配 sessionCart 给用户：不存在就创建
          // upsert 的逻辑是：if exists -> update else -> create
          // 这在数据库里叫：Time Of Check To Time Of Use
          await prisma.cart.upsert({
            where: { id: sessionCart.id },
            update: { userId: user.id },
            create: {
              ...sessionCart,
              userId: user.id,
              items: (sessionCart.items ?? []) as CartItem[],
            },
          });
        }
      }

      // Handle session updates
      if (trigger === "update" && session?.user?.name) {
        // Validate the incoming name data

        try {
          const validatedName = updateProfileSchema.shape.name.parse(
            session.user.name,
          );
          token.name = validatedName;
        } catch (error) {
          console.error("Invalid name provided in session update:", error);
          // Optionally throw an error or return the original token
          // throw new Error('Invalid name format');
        }
      }

      return token; // 返回修改后的 Token，Auth.js 会自动签名并存储
    },
    ...authConfig.callbacks,
  },
});
