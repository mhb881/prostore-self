import { z } from "zod";
import { formateNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formateNumberWithDecimal(Number(value))), "Price must have two decimal places.");

// Schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(2, "Name must be at least 1 character long."),
    slug: z.string().min(1, "Slug must be at least 1 character long."),
    category: z.string().min(1, "Category must be at least 1 character long."),
    brand_name: z.string().nullable(),
    description: z.string().min(1, "Description must be at least 1 character long."),
    stock: z.coerce.number().min(0, "Stock must be at least 0."),
    images: z.array(z.string()).min(1, "Product must have at least one image."),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
    id: z.string().min(1, "ID is required"),
});

// Schema for signing users in
export const signInFormSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for signing users up
export const signUpFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 1 character long."),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long."),
}).refine((data) => data.password === data.confirmPassword, "Passwords do not match.");

// Cart Schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID must be at least 1 character long."),
    name: z.string().min(1, "Name is required."),
    slug: z.string().min(1, "Slug is required."),
    quantity: z.coerce.number().int().nonnegative("Quantity must be a positive integer."),
    image: z.string().min(1, "Image is required."),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session cart ID is required."),
    userId: z.string().optional().nullable(),
});

// Shchema for the shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    address: z.string().min(1, "Address is required."),
    city: z.string().min(1, "City is required."),
    postalCode: z.string().min(1, "Postal code is required."),
    country: z.string().min(1, "Country is required."),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

// Shchema for the payment method
export const paymentMethodSchema = z.object({
    type: z.string().min(1, "Payment method is required."),
    // 添加自定义的精细化验证（refine）
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method.",
});

// Schema for inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, "User is required"),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: "Invalid payment method",
    }),
    shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    quantity: z.number(),
});

//
export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character").nullable(),
    email: z.string().min(1, "Email must be at least 1 character"),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, "ID is required"),
    role: z.string().min(1, "Role is required"),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    productId: z.string().min(1, "Product is required"),
    userId: z.string().min(1, "User is required"),
    rating: z.coerce
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
});

// Schema for inserting category
export const insertCategorySchema = z.object({
    name: z.string().min(1, "分类名称不能为空"),
    slug: z.string().min(1, "Slug 不能为空"),
    parentId: z.string().optional().nullable(),
});

// Schema for updating category
export const updateCategorySchema = insertCategorySchema.extend({
    id: z.string().min(1, "ID 不能为空"),
});