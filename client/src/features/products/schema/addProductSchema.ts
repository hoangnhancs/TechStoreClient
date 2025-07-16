import { z } from "zod";
import { requiredString } from "../../../lib/util/util";

export const addProductSchema = z.object({
  name: requiredString("Tên sản phẩm"),
  description: requiredString("Mô tả sản phẩm"),
  oldPrice: z.coerce
    .number()
    .gt(0, "Giá sản phẩm phải là một số dương")
    .optional(),
  discount: z.coerce
    .number()
    .min(0, "Giảm giá phải là một số dương")
    .max(100, "Giảm giá không được vượt quá 100%")
    .optional(),
  category: requiredString("Danh mục"),
  brand: requiredString("Thương hiệu"),
  mainImage: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().url("Hình ảnh chính không hợp lệ").optional()
  ),
  detailImages: z.array(z.string().url("Hình ảnh chi tiết không hợp lệ")).default([]),
  quantityInStock: z.coerce
    .number()
    .min(1, "Số lượng trong kho phải là một số dương"),
  attributeGroups: z
    .array(
      z.object({
        groupName: requiredString("Tên nhóm"),
        attributes: z
          .array(
            z.object({
              key: requiredString("Tên thuộc tính"),
              value: requiredString("Giá trị thuộc tính"),
            })
          )
          .min(1, "Ít nhất một thuộc tính là bắt buộc")
          .refine((attrs) => attrs.length > 0, {
            message: "Ít nhất một thuộc tính là bắt buộc",
          }),
      })
    )
    .optional()
    .default([]),
  filterTags: z.record(z.string(), z.string())
    .refine(obj => Object.keys(obj).length > 0, {
    message: "Bộ lọc không hợp lệ",
    }).default({}),
  mainImageFile: z
    .any({
      required_error: "Bạn phải upload một ảnh chính",
    })
    .refine((v) => v instanceof File, {
      message: "Bạn phải upload một ảnh chính",
    }),
  detailImageFiles: z.array(z.any()).default([]),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
export type AddProductFormValues = z.input<typeof addProductSchema>;