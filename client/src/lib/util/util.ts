import { z } from "zod";
import { format, DateArg } from "date-fns";

export function formatDate(date: DateArg<Date>) {
  return format(date, "dd MMM yyyy h:mm a");
}

export const requiredString = (fieldName: string) => {
  return z.string({ required_error: `${fieldName} là bắt buộc` }).min(1, {
    message: `${fieldName} là bắt buộc`,
  });
};

export const passwordRules = (fieldName: string) => {
  return z.string({ required_error: `${fieldName} là bắt buộc` })
    .min(1, { message: `${fieldName} là bắt buộc` })
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự")
    .max(32, "Mật khẩu không được vượt quá 32 ký tự")
    .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ cái viết hoa (A-Z)")
    .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ cái viết thường (a-z)")
    .regex(/[0-9]/, "Phải chứa ít nhất 1 chữ số (0-9)")
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Phải chứa ít nhất 1 ký tự đặc biệt (!@#$...)"
    )
    .refine((val) => !/\s/.test(val), "Mật khẩu không được chứa khoảng trắng");
};
