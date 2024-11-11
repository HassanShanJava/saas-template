import { Gender, UserStatus } from "../shared_enums/enums";
import { BankDetail } from "./shared_types";

export interface CoachInput {
  profile_img?: string;
  own_coach_id?: string;
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
  coach_status?: UserStatus;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  member_ids?: any;
  org_id: number;
  bank_detail?: BankDetail;
}

export interface CoachUpdate {
  id: number;
  profile_img?: string;
  own_coach_id?: string;
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
  coach_status?: UserStatus;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  bank_detail?: BankDetail;
  member_ids?: any;
  org_id: number;
}
