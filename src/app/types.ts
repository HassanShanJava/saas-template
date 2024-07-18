export interface incomeCategoryTableType {
  id: number;
  name: string;
  org_id: number;
  sale_tax_id: number;
}
export interface incomeCategoryResponseType {
  id: number;
  org_id: number;
  name: string;
  sale_tax_id: number;
}
export interface updateIncomeCategoryType {
  id?: number|undefined;
  org_id?: number;
  name?: string;
  sale_tax_id?: number;
}
export interface createIncomeCategoryType {
  org_id: number;
  name: string;
  sale_tax_id: number;
}
export interface deleteIncomeCategoryType {
  id: number;
}
export interface deleteSaleTaxesType {
  id: number;
}
export interface updateSaleTaxesType {
  name?: string;
  percentage?: number;
  org_id: number;
}
export interface saleTaxesInputType {
  name: string;
  percentage: number;
  org_id: number;
}
export interface saleTaxesTableType {
  id: number;
  name: string;
  org_id: number;
  percentage: number;
}
export interface saleTaxesResponseType {
  name: string;
  percentage: number;
  org_id: number;
  id: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface creditsResponseType {
  created_at: Date;
  id: number;
  is_deleted: boolean;
  min_limit: number;
  name: string;
  org_id: number;
  updated_at: Date;
}
export interface createCreditsType {
  org_id: number;
  name: string;
  min_limit: number;
  status: boolean | string;
}
export interface updateCreditsType {
  id?: number;
  org_id?: number;
  name?: string;
  min_limit?: number;
  status?: boolean | string;
}
export interface deleteCreditsType {
  credit_id: number;
}
export interface creditDetailsTablestypes {
  id: number;
  name: string;
  org_id: number;
}
export interface creditTablestypes {
  id: number;
  name: string;
  org_id: number;
  min_limit: number;
  status?: boolean;
}
export interface updateLeadInput {
  id: number;
  own_member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  source_id: number;
  country_id: number;
  city: string;
  client_since: string;
  org_id: number;
  membership_id: number;
  // optional
  profile_img?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  language?: string | null;
  is_business?: boolean;
  business_id?: number;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  created_at?: string | null;
  created_by?: number | null;
  coach_id?: number;
  send_invitation?: boolean;
  status?: string;
}
export interface CountryTypes {
  id: number;
  country: string;
  country_code: number;
  is_deleted: boolean;
}
export interface ErrorType {
  data?: {
    detail?: string;
  };
}
export interface CoachTypes {
  coach_name: string;
  id: number;
  is_deleted: boolean;
}

export interface sourceTypes {
  id: number;
  source: string;
}

export interface BusinessTypes {
  id: number;
  first_name: string;
}

export interface membershipplanTypes {
  name: string;
  price: string;
  org_id: number;
  id: number;
  is_deleted: boolean;
}

export interface staffType {
  org_id: number;
  id: number;
  first_name: string;
}
export interface leadType {
  id: number;
  name: string;
  email: string;
  status: string;
  source: string;
  owner: string;
  lead_since: string;
}

export interface LeadInputTypes {
  first_name: string;
  last_name: string;
  staff_id?: number | null | undefined;
  mobile?: string | null | undefined;
  status: string;
  source_id?: number | null | undefined;
  lead_since: string;
  phone?: string | null | undefined;
  email?: string | null | undefined;
  notes?: string | null | undefined;
  created_by?: number | null | undefined;
  updated_by?: number | null | undefined;
  org_id: number;
}

export interface LeadResponseTypes {
  first_name: string;
  last_name: string;
  staff_id?: number | null | undefined;
  mobile?: string | null | undefined;
  status: string;
  source_id?: number | null | undefined;
  lead_since: string;
  phone?: string | null | undefined;
  email?: string | null | undefined;
  notes?: string | null | undefined;
  created_by?: number | null | undefined;
  updated_by?: number | null | undefined;
  org_id: number;
}

export interface ClientInputTypes {
  profile_img?: string;
  own_member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  language?: string | null;
  is_business?: boolean;
  business_id?: number;
  country_id: number;
  city: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  client_since: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: number;
  membership_id: number;
  send_invitation?: boolean;
  status?: string;
}

export interface ClientResponseTypes {
  profile_img?: string | null;
  own_member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
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
  client_since: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: number | null;
  membership_id: number;
  send_invitation?: boolean | null;
  status?: string | null;
}

export interface updateStatusInput {
  status: string;
  lead_id: number;
}
export interface clientTablestypes {
  id: number;
  own_member_id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  mobile_number?: string | null;
  check_in?: string | null;
  last_online?: string | null;
  client_since?: string | null;
  business_name?: string | null;
  coach_name?: string | null;
}
export interface clientFilterSchema {
  search_key: string;
  client_name: string;
  membership_plan: number;
  status: string;
  coach_signed: number;
}
export interface updateStaffInput {
  lead_id: number;
  staff_id: number;
}
export interface updateStatusInput {
  lead_id: number;
  status: string;
}
