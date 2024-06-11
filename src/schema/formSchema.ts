import { z } from "zod";

export const FormDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneno: z.string().min(1, "Phone no is required"),
  Subscription: z.string().min(1, "Subscription is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  bankaccount: z.string().min(12, "Bank account is required"),
  swiftcode: z.string().min(12, "Swift code is required"),
  cardholdername: z.string().min(1, "name is required"),
  bankname: z.string().min(1, "Bank name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
});
