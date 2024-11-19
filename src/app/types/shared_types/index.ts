import { Gender } from "@/app/shared_enums/enums";
import type { JWTPayload } from "jose";

export interface BankDetail {
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
}

export interface ApiResponse {
  status_code: number;
  id: number;
  message: string;
}

export interface DeleteResponse {
  status: number;
  detail: string;
}

export interface User {
  profile_img?: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  dob?: string;
  email?: string;
  phone?: string;
  nic?: string;
  mobile_number?: string;
  notes?: string;
  source_id?: number;
  country_id?: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  org_id: number;
  bank_detail?: BankDetail;
}

export interface TableResponse<T> {
  data: T[];
  total_counts: number;
  filtered_counts: number;
}

export interface JwtPayload extends JWTPayload {
  id: number;
  user_type: string;
  org_id: number;
  created_on: string;
}
