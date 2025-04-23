import { z } from "zod";
import { passwordRules, requiredString } from "../../../lib/util/util";

export const loginSchema = z.object({
    email: requiredString("Email").email("Invalid email address"),
    password: passwordRules("Password"),
})

export type LoginSchema = z.infer<typeof loginSchema>;