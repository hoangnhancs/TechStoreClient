import { z } from "zod";
import { passwordRules } from "../../../lib/util/util";

export const changePasswordSchema = z
  .object({
    currentPassword: passwordRules("Current Password"),
    password: passwordRules("Password"),
    confirmPassword: passwordRules("Confirm Password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;