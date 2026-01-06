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
  price: z.coerce
    .number()
    .gt(0, "Giá sản phẩm phải là một số dương")
    .optional(),
  categoryId: requiredString("Danh mục"),
  brandId: requiredString("Thương hiệu"),
  // mainImageFile: z.preprocess(
  //   (v) => (v === "" ? undefined : v),
  //   z.string().url("Hình ảnh chính không hợp lệ").optional()
  // ),
  // detailImageFiles: z
  //   .array(z.string().url("Hình ảnh chi tiết không hợp lệ"))
  //   .default([]),
  quantityInStock: z.coerce
    .number()
    .min(1, "Số lượng trong kho phải là một số dương"),
  stockIn: z.coerce
    .number()
    .min(0, "Số lượng nhập kho phải là một số không âm")
    .optional(),
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
  productFilterTagValues: z
    .array(
      z.object({
        filterTagId: requiredString("ID bộ lọc"),
        filterTagValueId: z.string().optional(),
      })
    )
    .refine((vals) => vals.filter(v => v.filterTagValueId && v.filterTagValueId !== "").length > 0, {
      message: "Ít nhất một giá trị bộ lọc là bắt buộc",
    })
    .default([]),
  mainImageFile: z
    .any({
      required_error: "Bạn phải upload một ảnh chính",
    })
    .refine((v) => v !== undefined && v !== null && v !== "", {
      message: "Bạn phải upload một ảnh chính",
    }),
  detailImageFiles: z.array(z.any()).default([]),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
export type AddProductFormValues = z.input<typeof addProductSchema>;