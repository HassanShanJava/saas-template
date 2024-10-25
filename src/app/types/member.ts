import { GenderEnum } from "../shared_enums/enums";

export interface MembershipPlanIds {
  id: number; // id of the data
  planId: number; // plan id
  autoRenewal?: boolean; //auto renewal flag
  prolongationPeriod?: number; // prolongation period
  autoRenwalDays?: number; // auto renewal days
  invDaysCycle?: number; //invoice auto generate
}

export interface MemberInput {
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: GenderEnum;
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
  org_id?: number;
  coach_ids?: any[];
  send_invitation?: boolean;
  status?: string;
  membership_plans?: MembershipPlanIds[];
}
