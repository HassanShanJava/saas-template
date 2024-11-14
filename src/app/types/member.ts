import { Gender } from "../shared_enums/enums";
interface MembershipPlanIds {
  id?: number;
  membership_plan_id?: number | undefined;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
}

export interface LinkedMember {
  member_id: number;
  membership_plan_id: number;
  transition_id: number;
}

export interface MemberInput {
  query: string;
  org_id: number;
}

export interface MemberInputTypes {
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  dob?: Date | string;
  nic?: string;
  email?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number | null;
  language?: string | null;
  is_business?: boolean;
  business_id: number | null;
  country_id: number | null;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  client_status?: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id?: number;
  coach_ids?: any[];
  send_invitation?: boolean;
  status?: string;
  membership_plans?: MembershipPlanIds[];
}

export interface MemberResponseTypes {
  profile_img?: string | null;
  own_member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: Date | string;
  email: string;
  nic?: string;
  phone?: string | null;
  mobile_number?: string | null;
  notes?: string | null;
  source_id: number;
  language?: string | null;
  is_business?: boolean | null;
  business_id?: number | null;
  country_id: number;
  city: string;
  zipcode?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  activated_on?: Date;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: any[] | null;
  membership_plans?: MembershipPlanIds[];
  send_invitation?: boolean | null;
  client_status?: string | null;
  is_deleted: boolean;
}

export interface MemberTabletypes {
  data: MemberTableDatatypes[];
  total_counts: number;
  filtered_counts: number;
}

export interface MemberTableResponsetypes {
  data: MemberTableResponseDatatypes[];
  total_counts: number;
  filtered_counts: number;
}

export interface MemberTableDatatypes {
  id: number;
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
  nic?: string;
  last_name?: string;
  gender?: Gender;
  dob?: Date | string;
  email?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number | null;
  language?: string | null;
  is_business?: boolean;
  business_id: number | null;
  country_id: number | null;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  client_status?: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_ids?: any[];
  membership_plans?: MembershipPlanIds[];
  check_in?: string | null;
  coaches: {
    id: number;
    name: string;
  }[];
  last_online?: string | null;
  business_name?: string | null;
  activated_on?: Date | string;
}

export interface MemberTableResponseDatatypes {
  id: number;
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
  last_name?: string;
  nic?: string;
  gender?: Gender;
  dob?: Date | string;
  email?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number | null;
  language?: string | null;
  is_business?: boolean;
  business_id: number | null;
  country_id: number | null;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  activated_on?: Date | string;
  client_status?: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: any[];
  send_invitation?: boolean;
  membership_plans?: MembershipPlanIds[];
  check_in?: string | null;
  coaches: {
    id: number;
    coach_name: string;
  }[];
  last_online?: string | null;
  business_name?: string | null;
}