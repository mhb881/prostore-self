export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "非遗商城";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern ecommerce store built with Next.js";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 8;
export const signInDefaultValues = { email: "admin@example.com", password: "123456" } as const;
export const signUpDefaultValues = { name: "", email: "", password: "", confirmPassword: "" };
export const shippingAddressDefaultValues = {
    fullName: "admin",
    address: "123 Main St",
    city: "New York",
    postalCode: "12345",
    country: "China",
    latitude: undefined,
    longitude: undefined,
};

export const PAYMENT_METHODS = process.env.NEXT_PUBLIC_PAYMENT_METHODS
    ? process.env.NEXT_PUBLIC_PAYMENT_METHODS.split(", ")
    : ["PayPal", "Stripe", "WeChat", "Alipay", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
    process.env.NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 6;

// 修正默认值类型（stock 为 number，匹配 schema）
export const productDefaultValues = {
    name: "",
    slug: "",
    category: "",
    images: [] as string[], // 明确数组类型
    brand_name: "",
    description: "",
    price: "",
    stock: 0 as number, // 明确为 number
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    banner: null as string | null, // 明确 nullable 类型
};

export const USER_ROLES = process.env.USER_ROLES
    ? process.env.USER_ROLES.split(", ")
    : ["admin", "user"];


export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

