import { z } from "zod";
import { requiredString } from "../../../lib/util/util";

export const forgotPwSchema = z.object({
    email: requiredString("Email").email("Invalid email address"),
})

export type ForgotPwSchema = z.infer<typeof forgotPwSchema>;