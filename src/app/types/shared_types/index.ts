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
  id?: number;
  message: string;
  detail?: string;
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  email: string;
  phone_num?: string;
  notes?: string;
  country_id: number;
  city?: string;
  org_id?: number;
  bank_detail?: BankDetail;
}

export interface TableResponse<T> {
  data: T[];
  total_count: number;
  filtered_count: number;
}

export interface JwtPayload extends JWTPayload {
  id: number;
  user_type: string;
  org_id: number;
  created_on: string;
}
