import { z } from "zod";

export const creditCardFormSchema = z.object({
    cardNumber: z.string().nonempty("Mã số thẻ không được để trống")
        .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Mã số thẻ không hợp lệ"),
    cardholderName: z.string().nonempty("Tên chủ thẻ không được để trống")
        .regex(/^[a-zA-Z\s]+$/, "Tên chủ thẻ không hợp lệ"),
    expiryDate: z.string().nonempty("Ngày hết hạn không được để trống")
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Ngày hết hạn không hợp lệ"),
    cvv: z.string().nonempty("CVV không được để trống")
        .regex(/^\d{3,4}$/, "CVV không hợp lệ"),
})

export type CreditCardFormSchema = z.infer<typeof creditCardFormSchema>;