import { z } from "zod"
import { formateNumberWithDecimal } from "./utils";

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formateNumberWithDecimal(Number(value))), "Price must have two decimal places.");

// Schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character long."),
    slug: z.string().min(1, "Slug must be at least 1 character long."),
    category: z.string().min(1, "Category must be at least 1 character long."),
    brand: z.string().min(1, "Brand must be at least 1 character long."),
    description: z.string().min(1, "Description must be at least 1 character long."),
    stock: z.coerce.number().min(0, "Stock must be at least 0."),
    images: z.array(z.string()).min(1, "Product must have at least one image."),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});