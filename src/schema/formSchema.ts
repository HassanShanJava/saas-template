import { z } from "zod";

export const FormSchema = z.object({
  profile_img: z
    .string()
    .trim()
    .default(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    ),
  own_member_id: z.string({
    required_error: "Own Member Id Required.",
  }),
  first_name: z
    .string({
      required_error: "Firstname Required.",
    })
    .trim()
    .min(2, { message: "First Name Is Required." }),
  last_name: z
    .string({
      required_error: "Lastname Required.",
    })
    .trim()
    .min(2, { message: "Last Name Is Required" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "You need to select a gender type.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  email: z
    .string({
      required_error: "Email is Required.",
    })
    .email()
    .trim(),
  phone: z.string().trim().optional(),
  mobile_number: z.string().trim().optional(),
  notes: z.string().optional(),
  source_id: z.number({
    required_error: "Source Required.",
  }),
  language: z.string().nullable().default(null),
  coach_id: z.string().optional(),
  membership_id: z.string({
    required_error: "Membership plan is required.",
  }),
  is_business: z.boolean().default(false).optional(),
  business_id: z.number().optional(),
  send_invitation: z.boolean().default(true).optional(),
  status: z.string().default("pending"),
  city: z
    .string({
      required_error: "City Required.",
    })
    .trim(),
  zipcode: z.string().trim().optional(),
  created_by: z.number().default(4),
  address_1: z.string().optional(),
  country_id: z.number({
    required_error: "Country Required.",
  }),
  address_2: z.string().optional(),
});