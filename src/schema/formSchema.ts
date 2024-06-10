import { z } from "zod";

export const FormDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "date is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneno: z.string().min(1, "Phone no is required"),
  Subscription: z.string().min(1, "Subscription is required"),
  country: z.string().min(1, "Country is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
});
