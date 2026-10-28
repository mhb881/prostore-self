"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
  updateProfileSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import { ShippingAddress } from "@/types/types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { formatErrors } from "../utils";
import { Prisma } from "../generated/prisma/client";
import { PAGE_SIZE } from "../constants";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: any,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // 使用 try/catch 包装 signIn 调用
    try {
      await signIn("credentials", {
        email: user.email,
        password: user.password,
      });

      // 如果到这里说明登录成功
      return {
        success: true,
        message: "登录成功",
      };
    } catch (signInError) {
      // 处理具体的认证错误
      if (signInError instanceof AuthError) {
        switch (signInError.type) {
          case "CredentialsSignin":
            return {
              success: false,
              message: "邮箱或密码错误",
            };
          default:
            return {
              success: false,
              message: "登录失败，请稍后重试",
            };
        }
      }

      // 如果是重定向错误，说明认证成功
      if (isRedirectError(signInError)) {
        return {
          success: true,
          message: "登录成功",
        };
      }

      throw signInError;
    }
  } catch (error) {
    console.error("Login error:", error);

    // 处理表单验证错误
    if (error instanceof Error && error.message.includes("Invalid input")) {
      return {
        success: false,
        message: "请输入有效的邮箱和密码",
      };
    }

    // 其他错误
    return {
      success: false,
      message: "登录过程中发生错误，请稍后重试",
    };
  }
}

// Sign user out
export async function signOutUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      // 获取当前的sessionCartId
      const cookiesObject = await cookies();
      const sessionCartId = cookiesObject.get("sessionCartId")?.value;

      if (sessionCartId) {
        // 查找用户的购物车
        const userCart = await prisma.cart.findFirst({
          where: { userId },
        });

        if (userCart) {
          // 将用户购物车转换为游客购物车
          await prisma.cart.update({
            where: { id: userCart.id },
            data: {
              userId: null,
              sessionCartId,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error handling cart during sign out:", error);
  }

  await signOut();
}

// Sign up user
export async function signUpUser(prevState: any, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const { name, email, password } = user;

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }, // 假设你的 user 表中 email 是唯一键
      select: { id: true }, // 只查 id，减少数据查询量
    });

    // 如果用户已存在，返回错误提示
    if (existingUser) {
      return {
        success: false,
        message: "该邮箱已注册，请直接登录或更换邮箱",
      };
    }

    const plainPassword = user.password;
    // 哈希加密密码
    user.password = hashSync(user.password, 10);

    // 创建用户
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password, // 用明文密码登录（authorize 逻辑会比对加密密码）
        role: "user",
      },
    });

    // 自动登录用户
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Sign up error:", error);
    // 表单校验错误
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues.map((e) => e.message).join("；"),
      };
    }

    // 数据库唯一键冲突兜底（防止漏检）
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return {
        success: false,
        message: "该邮箱已注册，请直接登录或更换邮箱",
      };
    }

    // 处理表单验证错误
    if (
      error instanceof Error &&
      error.message.includes("Invalid email") &&
      error.message.includes("Password must be at least 6 characters long.")
    ) {
      return {
        success: false,
        message: "请输入有效的用户名和密码",
      };
    }

    // 其他未知错误
    console.error("注册失败：", error);
    return {
      success: false,
      message: "注册失败，请稍后重试",
    };
  }
}

// Get User By the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await getUserById(session?.user?.id as string);

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "更新地址成功",
    };
  } catch (error) {
    return {
      success: false,
      message: "更新地址失败，请稍后重试",
    };
  }
}

// Update User's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("用户不存在");

    const paymentMehod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMehod.type },
    });
    return {
      success: true,
      message: "用户的支付方式已更新",
    };
  } catch (error) {
    return {
      success: false,
      message: "更新支付方式失败，请稍后重试",
    };
  }
}

// Update the user profile
export async function updateProfile(user: {
  name: string | null;
  email: string;
}) {
  try {
    const session = await auth();

    const validatedData = updateProfileSchema.parse(user);

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: validatedData.name,
      },
    });

    revalidatePath("/user/profile");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}
