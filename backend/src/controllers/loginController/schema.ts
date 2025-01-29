import { z } from "zod";

// Base login schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
