import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { transliterate } from "transliteration";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formateNumberWithDecimal(num: number, decimalPlaces = 2): string {
  const [integerPart, decimalPart] = num.toFixed(decimalPlaces).split(".");
  return decimalPart ? `${integerPart}.${decimalPart.padEnd(decimalPlaces, "0")}` : `${integerPart}.00`;
}

// Format errors 
export function formatErrors(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod errors
    const fieldErrors = Object.keys(error.issues).map(key => {
      const issue = error.issues[key];
      return `${issue.path.join(".")}: ${issue.message}`;
    });

    return fieldErrors.join("\n");
  } else if (error.name === "PrismaClientKnownRequestError" && error?.code === "P2002") {
    // Handle Prisma errors
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase()} + ${field.slice(1)} already exists}`;
  } else {
    // Handle other errors
    return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    // 加上 EPSILON 以解决一些浮点数问题
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Invalid value type");
  }
};


const CURRENCY_FORMATTER = new Intl.NumberFormat("zh-CN", {
  style: "currency", currency: "CNY", minimumFractionDigits: 2,
});

export function formatCurrency(value: number | string | null) {
  if (typeof value === "number") {
    return CURRENCY_FORMATTER.format(value);
  } else if (typeof value === "string") {
    return CURRENCY_FORMATTER.format(Number(value));
  } else {
    return NaN;
  }
}

// Format number
const NUMBER_FORMATTER = new Intl.NumberFormat("zh-CN");

// Format number
export function formatNumber(value: number | string | null) {
  if (typeof value === "number") {
    return NUMBER_FORMATTER.format(value);
  } else if (typeof value === "string") {
    return NUMBER_FORMATTER.format(Number(value));
  } else {
    return NaN;
  }
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "zh-CN",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "zh-CN",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "zh-CN",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}

/**
 * 中文名称 → 翻译风格的英文 slug
 * 示例：商品名称 → shang-pin-ming-cheng
 */
export function cnToEnSlug(text: string): string {
  if (!text) return "";

  // 中文转英文风格（不是机器翻译，是安全的英文化）
  const enText = transliterate(text);

  const slug = slugify(enText, {
    lower: true,
    strict: true,
    replacement: "-",
  });

  slug.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fa5-]/g, "");

  // 转成标准 slug
  return slug;
}


