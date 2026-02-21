import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formateNumberWithDecimal(num: number, decimalPlaces = 2): string {
  const [integerPart, decimalPart] = num.toFixed(decimalPlaces).split('.');
  return decimalPart ? `${integerPart}.${decimalPart.padEnd(decimalPlaces, "0")}` : `${integerPart}.00`;
}
