import { z } from "zod";
import { loginFormSchema, signupFormSchema } from "./schemas";

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
