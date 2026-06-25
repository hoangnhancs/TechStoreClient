import { z } from "zod";
import { format, DateArg } from "date-fns";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { BasicUser, UserNotification } from "../types";

export type DateFormatStyle = 'ddmmyyyy' | 'ddmmyyyyhhmm' | 'hhmm' | 'iso' | 'full';

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

export const formatVNDate = (
  date: string | Date,
  style: DateFormatStyle = "ddmmyyyy"
): string => {
  const d = new Date(date);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());

  switch (style) {
    case "ddmmyyyy":
      return `${day}/${month}/${year}`;
    case "ddmmyyyyhhmm":
      return `${day}/${month}/${year} ${hour}:${minute}`;
    case "hhmm":
      return `${hour}:${minute}`;
    case "iso":
      return d.toISOString(); // "2025-08-02T13:45:00.000Z"
    case "full":
    default:
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
  }
};

export const formatCurrency = (
  value: number | string,
  currency: "VND" | "USD" | "EUR" = "VND",
  fractionDigits = 0
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(num);
};

export const flattenErrors = <T extends FieldValues>(errObj: FieldErrors<T>): string[] => {
  let msgs: string[] = [];
  
  if (Array.isArray(errObj)) {
    errObj.forEach(item => {
      if (item) msgs = msgs.concat(flattenErrors(item));
    });
  } else {
    Object.values(errObj).forEach(val => {
      if (val && typeof (val as FieldError).message === "string") {
        const msg = (val as FieldError).message;
        if (msg !== undefined) {
          msgs.push(msg);
        }
      } else if (val && typeof val === "object") {
        msgs = msgs.concat(
          flattenErrors(val as FieldErrors<T>)
        );
      }
    });
  }
  return msgs;
};

export const buildNotificationLink = (notification: UserNotification, currentUser: BasicUser | null) => {
  if (notification.referenceType.toLocaleLowerCase() === "order") {
    if (currentUser?.isAdmin) {
      return `/dashboard/orders/${notification.referenceId}`;
    }
    return `/my-orders/${notification.referenceId}`;
  }

  if (notification.referenceType.toLocaleLowerCase() === "comment") {
    if (notification.parentReferenceType.toLocaleLowerCase() === "product") {
      return `/products/${notification.parentReferenceId}?commentId=${notification.referenceId}`;
    }
  }

  if (notification.referenceType.toLocaleLowerCase() === "review") {
    if (notification.parentReferenceType.toLocaleLowerCase() === "product") {
      return `/products/${notification.parentReferenceId}?reviewId=${notification.referenceId}`;
    }
  }
  return "";
}; 
