import { z } from "zod";
import { requiredString } from "../../../lib/util/util";

export const addProductSchema = z.object({
  name: requiredString("Product Name"),
  description: requiredString("Product Description"),
  oldPrice: z.coerce.number().min(0, "Price must be a positive number").optional(),
  discount: z.coerce.number().min(0, "Price must be a positive number").max(100, "Discount cannot exceed 100%").optional(),
  category: requiredString("Category"),
  brand: requiredString("Brand"),
  mainImage: z.string().url("Main image URL must be a valid URL").optional(),
  detailImages: z
    .array(z.string().url("Image URL must be a valid URL"))
    .optional()
    .default([]),
  quantityInStock: z
    .coerce
    .number()
    .min(0, "Quantity in stock must be a non-negative number")
    .optional(),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;