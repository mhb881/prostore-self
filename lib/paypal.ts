// 读取环境变量，设置PayPal API基础URL
const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

// 定义PayPal支持的货币列表（核心修复点）
const SUPPORTED_CURRENCIES = [
    "USD", "EUR", "GBP", "AUD", "CAD", "JPY", "CHF", "HKD", "SGD", "AED", "SEK"
    // 完整列表参考：https://developer.paypal.com/docs/integration/direct/rest/currency-codes/
];

export const paypal = {
    // 修改：新增可选的currency参数，默认使用USD（最常用的支持币种）
    createOrder: async function createOrder(price: number, currency: string = "USD") {
        // 前置验证：检查货币是否支持，提前抛出友好错误
        const normalizedCurrency = currency.toUpperCase();
        if (!SUPPORTED_CURRENCIES.includes(normalizedCurrency)) {
            throw new Error(
                `Currency ${currency} is not supported by PayPal. Supported currencies: ${SUPPORTED_CURRENCIES.join(", ")}`
            );
        }

        // 验证价格格式（PayPal要求金额为正数且保留2位小数）
        if (price <= 0) {
            throw new Error("Price must be a positive number");
        }
        const formattedPrice = price.toFixed(2); // 确保金额格式正确

        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: normalizedCurrency, // 使用验证后的合规币种（替换原CNY）
                            value: formattedPrice, // 使用格式化后的金额
                        },
                    },
                ],
            }),
        });

        const orderData = await handleResponse(response);
        return orderData;
    },

    capturePayment: async function capturePayment(orderId: string) {
        // 新增：验证订单ID是否存在
        if (!orderId || typeof orderId !== "string") {
            throw new Error("Valid order ID is required");
        }

        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const captureData = await handleResponse(response);
        return captureData;
    },
};

// 生成PayPal访问令牌（原逻辑保留，补充注释）
async function generateAccessToken() {
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

    // 新增：验证环境变量是否配置
    if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
        throw new Error("PAYPAL_CLIENT_ID and PAYPAL_APP_SECRET must be set in environment variables");
    }

    // 用 Buffer 转换为 Base64 编码字符串 —— PayPal要求的Basic Auth认证格式
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`, // Basic 认证头
            "Content-Type": "application/x-www-form-urlencoded", // 请求体格式
        },
        body: "grant_type=client_credentials", // 授权类型：客户端凭证
    });

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

// 统一处理响应（原逻辑保留）
async function handleResponse(response: Response) {
    if (response.ok) {
        return await response.json();
    } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

export { generateAccessToken };