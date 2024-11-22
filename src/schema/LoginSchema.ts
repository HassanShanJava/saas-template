import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  rememberMe: z.boolean().optional(),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type OTPFormValues = z.infer<typeof otpSchema>;

export type LoginFormSchema = z.infer<typeof loginSchema>;
