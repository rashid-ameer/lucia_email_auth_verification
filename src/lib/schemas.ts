import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});

export const signupFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
  username: z.string().trim().min(1, "Username is required"),
});

export const verificationCodeSchema = z
  .string()
  .regex(/^\d{8}$/, "Invalid code");
