import { z } from "zod";
import { passwordRules, requiredString } from "../../../lib/util/util";


export const registerSchema = z.object({
    email: requiredString("Email").email("Invalid email address"),
    displayName: requiredString("Display name"),
    password: passwordRules("Password"),
    confirmPassword: passwordRules("Confirm Password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type RegisterSchema = z.infer<typeof registerSchema>;