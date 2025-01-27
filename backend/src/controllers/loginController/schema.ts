import { z } from "zod";

// Base login schema
export const baseLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" }),
});

export const MobileLoginSchema = baseLoginSchema.extend({
  refreshToken: z.string().optional(),
});

export type BaseLoginInput = z.infer<typeof baseLoginSchema>;
export type MobileLoginInput = z.infer<typeof MobileLoginSchema>;
