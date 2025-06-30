import { z } from "zod";
import { passwordRules } from "../../../lib/util/util";

export const resetPwSchema = z.object({
    password: passwordRules("Password"),
    confirmPassword: passwordRules("Confirm Password")
})

export type ResetPwSchema = z.infer<typeof resetPwSchema>;