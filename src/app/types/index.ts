import { Gender, UserStatus } from "../shared_enums/enums";
export interface VerifyTokenResponse {
  status: number;
  id?: number;
  org_id?: number;
  data: {
    message: string;
  };
}

export interface CoreSearchCriteria {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key: string;
  search_key?: string;
}

export type SearchCriteriaType = CoreSearchCriteria | (CoreSearchCriteria & Record<string, string>);

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TimeSlot = {
  from_time: string;
  to_time: string;
};

export type LimitedAccessTime = {
  [day: string]: TimeSlot[];
};

export interface groupCreateType {
  org_id: number;
  name: string;
}
export interface groupRespType {
  id: number;
  name: string;
}

export interface CountryTypes {
  id: number;
  country: string;
  country_code: number;
  is_deleted: boolean;
}
export interface ErrorType {
  status?: number;
  data?: {
    message?: string;
    detail?: string;
  };
}
export interface SourceTypes {
  id: number;
  source: string;
}

export interface ResetPasswordType {
  id: number;
  org_id: number;
  new_password: string;
  confirm_password: string;
  token: string;
}

export interface StaffInputType {
  id?: number;
  profile_img?: string;
  own_staff_id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  dob: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  org_id: number;
  status: UserStatus;
  role_id: number;
  country_id: number;
  nic?: string;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  send_invitation?: boolean;
}

export interface StaffResponseType {
  own_staff_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  dob: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  org_id: number;
  role_id: number;
  nic?: string;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  status?: UserStatus;
  send_invitation?: boolean;
  id: number;
  activated_on?: string;
  last_online?: string;
  last_checkin?: string;
}

export interface staffTableTypes {
  data: staffTypesResponseList[];
  total_counts: number;
  filtered_counts: number;
}
export interface staffTypesResponseList {
  own_staff_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  dob: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  org_id: number;
  role_id: number;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  nic?: string;
  address_2?: string;
  status?: UserStatus;
  send_invitation?: boolean;
  id: number;
  role_name: string;
  activated_on?: string;
  last_online?: string;
  last_checkin?: string;
}

