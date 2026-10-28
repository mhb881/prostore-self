"use server";

import { Cart, CartItem } from "@/types/types";
import { convertToPlainObject, formatErrors, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

// Calculate cart prices
const calcPrices = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

// 添加商品到购物车
export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find Product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create a new cart object
      const newCart = insertCartSchema.parse({
        sessionCartId,
        userId,
        items: [item],
        ...calcPrices([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      // 重新验证商品页面，目的是清除购物车缓存，以显示最新的购物车数据
      revalidatePath(`/products/${product.slug}`);

      // Testing
      // console.log({
      //     "Session Cart ID": sessionCartId,
      //     "User ID": userId,
      //     "Item Requested": item,
      //     "Product Found": product,
      // });

      // 返回添加成功信息
      return {
        success: true,
        message: `${product.name} add to cart`,
      };
    } else {
      // Check if item alrady in thr catt
      const existItem = (cart.items as CartItem[]).find((val) => {
        return val.productId === item.productId;
      });

      // Check if item is already in cart
      if (existItem) {
        // Check stock
        if (product.stock < existItem.quantity + 1) {
          throw new Error("Out of stock");
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (a) => a.productId === item.productId,
        )!.quantity = existItem.quantity + 1;
      } else {
        // If item is not in cart
        // Check stock
        if (product.stock < 1) throw new Error("No enough stock");

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrices(cart.items),
        },
      });

      // Revalidate product page
      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

//
export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
  });
}

// Remove item from cart
export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get User Cart
    const cart = await getMyCart();

    // Check cart exists
    if (!cart) throw new Error("Cart not found");

    // Check for item
    const existItem = (cart.items as CartItem[]).find(
      (val) => val.productId === productId,
    );
    if (!existItem) throw new Error("Item not found");

    // Check if only one in qty
    if (existItem.quantity === 1) {
      // Remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (val) => val.productId !== productId,
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find(
        (a) => a.productId === productId,
      )!.quantity -= 1;
    }

    // Save to database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrices(cart.items as CartItem[]),
      },
    });

    // Revalidate product page
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}
