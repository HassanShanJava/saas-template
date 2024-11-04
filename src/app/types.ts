import { JSONObject } from "@/types/hook-stepper";

enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
  prefer_no_to_say = "prefer not to say",
}

export interface sellItem {
  item_id: number;
  item_type: string;
  description: string;
  quantity: number;
  price: number;
  tax_type: string;
  tax_name: string;
  tax_rate: number;
  discount: number;
  sub_total: number;
  total: number;
  tax_amount: number;
}

export interface Payments {
  payment_method_id: number;
  payment_method: string;
  amount: number;
}

export interface sellForm {
  id?: number;
  counter_id: number;
  discount_amt?: number;
  batch_id?: number | null;
  member_id?: number | null;
  member_name?: string | null;
  member_email?: string | null;
  member_address?: string | null;
  member_gender?: genderEnum | null;
  member_nic?: string ;
  notes?: string;
  staff_id?: number | null;
  staff_name?: string;
  receipt_number?: string;
  tax_number?: number | null;
  total?: number | null;
  subtotal?: number | null;
  tax_amt?: number | null;
  main_transaction_id?: number | null;
  status?: "Unpaid" | "Paid" | "Partially Paid";
  transaction_type?: "Refund" | "Sale";
  transaction_date?: Date;
  items?: sellItem[];
  membership_plans?: sellItem[];
  events?: sellItem[];
  products?: sellItem[];
  payments?: Payments[];
  created_by: number;
  updated_at?: number;
}

export interface TransactionTable {
  data: sellForm[];
  filtered_counts: number;
  total_counts: number;
}

export enum statusEnum {
  pending = "pending",
  active = "active",
  inactive = "inactive",
}
export interface createTransaction {
  batch_id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  member_address: string;
  member_gender: string;
  staff_id: number;
  staff_name: string;
  receipt_number: string;
  notes: string;
  tax_number: number;
  total_amount: number;
  status: string;
  transaction_type: string;
  products: {
    item_id: number;
    description: string;
    quantity: number;
    price: number;
    tax_rate: number;
    discount: number;
    sub_total: number;
    total: number;
    tax_amount: number;
  }[];
  membership_plans: {
    item_id: number;
    description: string;
    quantity: number;
    price: number;
    tax_rate: number;
    discount: number;
    sub_total: number;
    total: number;
    tax_amount: number;
  }[];
  events: {
    item_id: number;
    description: string;
    quantity: number;
    price: number;
    tax_rate: number;
    discount: number;
    sub_total: number;
    total: number;
    tax_amount: number;
  }[];
}
export interface counterTableType {
  data: counterDataType[];
  total_counts: number;
  filtered_counts: number;
}

export interface counterDataType {
  id?: number;
  name: string;
  staff: {
    id: number;
    name: string;
  }[];
  staff_ids?: number[];
  staff_id?: number | null;
  status?: string;
  is_open?: boolean;
}

export interface CreateCounter {
  id?: number | null;
  name?: string;
  staff_ids?: number[];
  status?: string;
  staff_id?: number | null;
  is_open?: boolean;
}

export interface mealPlanTableType {
  data: mealPlanDataType[];
  total_counts: number;
  filtered_counts: number;
}

export interface mealPlanDataType {
  id?: number;
  meal_plan_id?: number;
  org_id?: number;
  visible_for?: string;
  carbs?: number | null;
  protein?: number | null;
  fats?: number | null;
  name?: string;
  profile_img?: string | null;
  description?: string;
  member_id?: number[];
  meals?: {
    meal_time: string;
    food_id: number;
    quantity: number;
  }[];
}
export interface ResetPasswordType {
  id: number;
  org_id: number;
  new_password: string;
  confirm_password: string;
  token: string;
}

export interface FoodTableResponse {
  data: CreateFoodTypes[];
  total_counts: number;
  filtered_counts: number;
}
export interface CreateFoodTypes {
  id?: number;
  org_id?: number;
  name: string;
  brand: string;
  category: string;
  description?: string;
  other_name?: string;
  visible_for?: string;
  total_nutrition: number | null;
  kcal: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrates: number | null;
  carbs_sugar?: number | null;
  carbs_saturated?: number | null;
  kilojoules?: number | null;
  fiber?: number | null;
  calcium?: number | null;
  iron?: number | null;
  magnesium?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  sodium?: number | null;
  zinc?: number | null;
  copper?: number | null;
  selenium?: number | null;
  vitamin_a?: number | null;
  vitamin_b1?: number | null;
  vitamin_b2?: number | null;
  vitamin_b6?: number | null;
  vitamin_b12?: number | null;
  vitamin_c?: number | null;
  vitamin_d?: number | null;
  vitamin_e?: number | null;
  folic_acid?: number | null;
  fat_unsaturated?: number | null;
  cholesterol?: number | null;
  alcohol?: number | null;
  alchohol_mono?: number | null;
  alchohol_poly?: number | null;
  trans_fat?: number | null;
  weight: number | null;
  weight_unit: string | undefined;
  img_url?: string | null;
  created_at?: Date;
  created_by?: number;
  is_deleted?: boolean;
  is_validated?: boolean;
}

export interface createRoleTypes {
  org_id: number;
  status: string;
  name: string;
  resource_id: Array<number>;
  access_type: Array<string>;
}

export interface deleteMemberTypes {
  id: number;
}

export interface updateRoleTypes extends createRoleTypes {
  id: number;
}
export interface resourceTypes {
  id: number;
  name: string;
  code: string | undefined;
  parent: string | undefined;
  subRows?: resourceTypes[];
  access_type?: string;
  children?: resourceTypes[];
  is_parent: boolean;
  index: number;
  is_root: boolean;
  link: string;
  icon: string;
}

export interface renewalData extends JSONObject {
  days_before: number | null;
  next_invoice: number | null;
  prolongation_period: number | null;
}
export interface facilitiesData extends JSONObject {
  facility_id: number;
  total_credits: number | null;
  credit_type:string
  validity: {
    type?: string | undefined | null;
    duration?: number | null;
  };
}

export interface updateMembershipType {
  id: number | null;
  org_id: number | null;
  name?: string;
  group_id?: number | null;
  description?: string;
  status?: string;
  duration?: number | null;
  duration_period?: string;
  access_time?: object;
  net_price?: number | null;
  discount?: number | null;
  income_category_id?: number | undefined;
  total_price?: number | null;
  payment_method?: string;
  reg_fee?: number | null;
  billing_cycle?: string;
  auto_renewal?: boolean;
  renewal_details?: renewalData | object;
  facilities?: facilitiesData[] | [];
  created_by?: number | null;
}
export interface createMembershipType {
  org_id: number | null;
  name: string;
  group_id: number | null;
  description: string;
  status: string;
  duration: number | null;
  duration_period: string;
  access_type: string
  net_price: number | null;
  discount: number | null;
  income_category_id: number | undefined;
  total_price: number | null;
  payment_method: string;
  reg_fee: number | null;
  billing_cycle: string;
  auto_renewal: boolean;
  renewal_details: renewalData | object;
  facilities: facilitiesData[] | [];
  created_by: number | null;
  inv_days_cycle?: number | null;
  auto_renew_days?: number | null;
  prolongation_period?: number | null;
}

export interface membeshipsTableResonseType {
  data: membeshipsTableType[];
  total_counts: number;
  filtered_counts: number;
}

export interface membeshipsTableType extends createMembershipType {
  id: number;
}

export interface groupCreateType {
  org_id: number;
  name: string;
}
export interface groupRespType {
  id: number;
  name: string;
}
export interface incomeCategoryTableType {
  id: number;
  name: string;
  org_id: number;
  sale_tax_id: number;
  status: string;
}

export interface incomeCategoryTableResponseType {
  data: incomeCategoryResponseType[];
  total_counts: number;
  filtered_counts: number;
}
export interface incomeCategoryResponseType {
  id: number;
  org_id: number;
  name: string;
  sale_tax_id: number;
  status: string;
}
export interface updateIncomeCategoryType {
  id?: number | undefined;
  org_id?: number;
  name?: string;
  sale_tax_id?: number;
  status?: string;
}
export interface createIncomeCategoryType {
  org_id: number;
  name: string;
  sale_tax_id: number;
  status: string;
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
  status?: string;
  org_id: number;
}
export interface saleTaxesInputType {
  name: string;
  percentage: number;
  status: string;
  org_id: number;
}
export interface saleTaxesTableType {
  id: number;
  name: string;
  org_id: number;
  percentage: number;
  status: string;
}

export interface saleTaxTableType {
  data: saleTaxesResponseType[];
  total_counts: number;
  filtered_counts: number;
}
export interface saleTaxesResponseType {
  name: string;
  percentage: number;
  status: string;
  org_id: number;
  id: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface creditsTableResponseType {
  data: creditsResponseType[];
  total_counts: number;
  filtered_counts: number;
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
  min_limit: number;
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
  membership_plan_id: number;
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
  status?: number;
  data?: {
    detail?: string;
  };
}
export interface sourceTypes {
  id: number;
  source: string;
}

export interface BusinessTypes {
  id: number;
  full_name: string;
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

interface membership_planids {
  id?: number;
  membership_plan_id?: number | undefined;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
}

export interface MemberInputTypes {
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: genderEnum;
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
  membership_plans?: membership_planids[];
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
  membership_plans?: membership_planids[];
  send_invitation?: boolean | null;
  client_status?: string | null;
  is_deleted: boolean;
}

export interface updateStatusInput {
  status: string;
  lead_id: number;
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
  gender?: genderEnum;
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
  membership_plans?: membership_planids[];
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
  gender?: genderEnum;
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
  membership_plans?: membership_planids[];
  check_in?: string | null;
  coaches: {
    id: number;
    coach_name: string;
  }[];
  last_online?: string | null;
  business_name?: string | null;
}
export interface CoachTableTypes {
  id: number;
  profile_img?: string;
  own_coach_id: string;
  first_name: string;
  last_name: string;
  gender?: genderEnum;
  dob: string;
  email: string;
  nic?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  country_id: number;
  city: string;
  coach_status: "pending" | "active" | "inactive" | undefined;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_by?: number;
  member_ids: any;
  org_id: number;
  check_in: string | null;
  last_online: string | null;
  activated_on?: string | null;
}

export interface updateStaffInput {
  lead_id: number;
  staff_id: number;
}
export interface updateStatusInput {
  lead_id: number;
  status: string;
}

export interface getRolesType {
  name: string;
  status?: boolean;
  id: number;
}

export interface createRole {
  name: string;
  org_id: number;
}

export interface CoachInputTypes {
  profile_img?: string;
  own_coach_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: genderEnum;
  dob?: string;
  email?: string;
  phone?: string;
  nic?: string;
  mobile_number?: string;
  notes?: string;
  source_id?: number;
  country_id?: number;
  city?: string;
  coach_status?: "pending" | "active" | "inactive" | undefined;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_by?: number;
  member_ids?: any;
  org_id: number;
}
export interface addCoachResponseType {
  wallet_address?: string;
  org_id: number;
  coach_status: "pending" | "active" | "inactive";
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  nic?: string;
  dob: string;
  gender?: genderEnum;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  check_in?: string;
  last_online?: string;
  activated_on?: string;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  id: number;
  created_at?: string;
  updated_at?: string;
  member_ids?: any;
}

export interface CoachResponseType {
  id: number;
  wallet_address?: string | null;
  org_id: number;
  coach_status: string;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string;
  nic?: string;
  gender?: genderEnum;
  email: string;
  password?: string;
  phone?: string;
  mobile_number?: string | null;
  notes?: string | null;
  source_id: number;
  country_id: number;
  city?: string;
  zipcode?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  check_in?: string | null;
  last_online?: string | null;
  activated_on?: string | null;
  bank_name?: string | null;
  iban_no?: string | null;
  acc_holder_name?: string | null;
  swift_code?: string | null;
  created_by: number;
  member_ids: number[];
}

export interface coachdeleteType {
  id: number;
}
interface Member {
  id: number;
  name: string;
}

export interface CoachTypes {
  data: CoachTableDataTypes[];
  total_counts: number;
  filtered_counts: number;
}

export interface CoachTableDataTypes {
  id: number;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: genderEnum;
  email: string;
  nic?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  check_in?: string | null;
  last_online?: string | null;
  activated_on?: string | null; // ISO date string
  coach_status: "pending" | "active" | "inactive";
  org_id: number;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_at?: string;
  member_ids?: number[];
  members?: number[];
}
export interface CoachResponseTypeById {
  id: number;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: genderEnum;
  nic?: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  check_in?: string | null;
  last_online?: string | null;
  activated_on?: string | null; // ISO date string
  coach_status: "pending" | "active" | "inactive";
  org_id: number;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_at?: string;
  member_ids: number[];
}

export interface ServerResponseById {
  id: number;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: genderEnum;
  email: string;
  nic?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  country_id: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  check_in?: string | null;
  last_online: string | null;
  activated_on: string | null; // ISO date string
  coach_status: "pending" | "active" | "inactive";
  org_id: number;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_at: string;
  members: Member[]; // Original members array
}

export interface StaffInputType {
  id?: number;
  profile_img?: string;
  own_staff_id: string;
  first_name: string;
  last_name: string;
  gender: genderEnum;
  dob: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id: number;
  org_id: number;
  status: statusEnum;
  role_id: number;
  country_id: number;
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
  gender: genderEnum;
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
  address_2?: string;
  status?: statusEnum;
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
  gender: genderEnum;
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
  address_2?: string;
  status?: statusEnum;
  send_invitation?: boolean;
  id: number;
  role_name: string;
  activated_on?: string;
  last_online?: string;
  last_checkin?: string;
}

export interface coachUpdateInput {
  wallet_address?: string;
  org_id?: 0;
  coach_status?: "pending" | "active" | "inactive";
  own_coach_id?: string;
  profile_img?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  gender?: genderEnum;
  email?: string;
  nic?: string;
  password?: string;
  phone?: string;
  mobile_number?: string;
  notes?: string;
  source_id?: number;
  country_id?: number;
  city?: string;
  zipcode?: string;
  address_1?: string;
  address_2?: string;
  check_in?: string;
  last_online?: string;
  activated_on?: string;
  bank_name: string;
  iban_no: string;
  acc_holder_name: string;
  swift_code: string;
  id: number;
  updated_by?: number;
  member_ids?: any;
}

export interface muscleserverResponse {
  id: number;
  muscle_name: string;
}
export interface baseExerciseApiResponse {
  value: number;
  label: string;
}

export interface EquipmentApiResponse {
  id: number;
  equipment_name: string;
}

export interface EquipmentApiResponseServer {
  id: number;
  name: string;
}

export interface CategoryApiResponse {
  id: number;
  category_name: string;
}

export interface JointApiResponse {
  id: number;
  joint_name: string;
}

export interface MetApiResponse {
  id: number;
  met_value: string;
}

export interface ExerciseCreationResponse {
  status_code: string;
  id: number;
  message: string;
}

export enum ExerciseTypeEnum {
  time_based = "Time Based",
  repetition_based = "Repetition Based",
}

export enum difficultyEnum {
  Novice = "Novice",
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}
export enum IntensityEnum {
  max_intensity = "Max Intensity",
  irm = "irm",
}
export enum WorkoutIntensityEnum {
  "Max Intensity" = "Max Intensity",
  "irm" = "%1RM",
}
enum VisibilityEnum {
  only_myself = "Only Myself",
  staff_of_my_club = "Staff of My Club",
  members_of_my_club = "Members of My Club",
  everyone_in_my_club = "Everyone in My Club",
}
export enum Difficulty {
  Novice = 0,
  Beginner,
  Intermediate,
  Advance,
  Expert,
}

export interface createExerciseInputTypes {
  id?: number;
  exercise_name: string;
  visible_for?: string;
  org_id?: number;
  exercise_type?: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value?: number;
  difficulty: string;
  sets?: number | null;
  distance?: number;
  speed?: number;
  met_id?: number | null;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id?: string;
  equipment_ids: number[];
  primary_muscle_ids: number[];
  secondary_muscle_ids?: number[];
  primary_joint_ids: number[];
  timePerSet?: { value: number | null }[];
  restPerSet?: { value: number | null }[];
  restPerSetrep?: { value: number | null }[];
  repetitionPerSet?: { value: number | null }[];
  gif: File[];
  imagemale: File[];
  imagefemale: File[];
}

export interface ExerciseCreationInputTypes {
  id?: number;
  exercise_name: string;
  visible_for: string;
  org_id: number;
  exercise_type: string;
  exercise_intensity: string;
  intensity_value?: number;
  difficulty: string;
  sets: number;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  distance?: number;
  speed?: number;
  met_id?: number;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id: number;
  equipment_ids: number[];
  primary_muscle_ids: number[];
  secondary_muscle_ids?: number[];
  primary_joint_ids: number[];
}

export interface ExerciseResponseViewType {
  exercise_name: string;
  visible_for?: string;
  org_id?: number;
  exercise_type?: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value?: number;
  difficulty: string;
  sets?: number | null;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  distance?: number;
  speed?: number;
  met_id?: number | null;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id?: string;
  equipment_ids: number[];
  primary_muscle_ids: number[];
  secondary_muscle_ids?: number[];
  primary_joint_ids: number[];
  id: number;
  category_name: string;
  gif: File[];
  imagemale: File[];
  imagefemale: File[];
}

export interface ExerciseResponseServerViewType {
  exercise_name: string;
  visible_for?: VisibilityEnum;
  org_id?: number;
  exercise_type: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value: number | null;
  difficulty?: difficultyEnum;
  sets?: number | null;
  seconds_per_set: number[];
  repetitions_per_set: number[];
  rest_between_set: number[];
  distance: number | null;
  speed: number | null;
  met_id: number | null;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id: number;
  equipments: EquipmentApiResponseServer[];
  primary_muscles: muscleserverResponse[];
  secondary_muscles?: muscleserverResponse[];
  primary_joints: JointApiResponse[];
  id: number;
  category_name: string;
}

export interface ExerciseTableTypes {
  data: ExerciseResponseViewType[];
  total_counts: number;
  filtered_counts: number;
}

export interface ExerciseTableServerTypes {
  data: ExerciseResponseServerViewType[];
  total_counts: number;
  filtered_counts: number;
}
export interface deleteExerciseResponse {
  detail: string;
}

export interface deleteExerciseInput {
  id: number;
}

export interface Workout {
  workout_name: string;
  org_id: number;
  description?: string;
  visible_for: string | undefined;
  goals: string;
  level: string;
  weeks: number;
  img_url?: string;
  members: number[];
  file?: File[];
}

export interface Workoutupdate {
  id: number;
  workout_name: string;
  description?: string;
  goals: string;
  img_url?: string;
  level: string;
  visible_for: string | undefined;
  weeks: number;
  members: number[];
}
export interface workoutResponse {
  status_code: string;
  id: number;
  message: string;
}

export interface WorkoutUpdateResponse {
  status: string;
  workout_id: number;
  message: string;
}

interface members {
  member_id: number;
}

export interface WorkoutPlanView {
  id: number;
  workout_name: string;
  description?: string;
  goals: string;
  image_url?: string;
  level: difficultyEnum;
  visible_for: VisibilityEnum;
  weeks: number;
  members: members[];
  org_id: number;
  is_published: boolean;
}

export interface WorkoutPlansTableResponse {
  data: WorkoutPlanView[];
  total_counts: number;
  filtered_counts: number;
}

export type Option = {
  id: string;
  name: string;
};

export type MultiSelectOption = {
  name: number;
  label: string;
};

export interface days {
  workout_id: number;
  day_name: string;
  week: number;
  day: number;
  id?: number;
  exercises?: exercises[]; // Assuming exercises have their own structure
}
export interface exercises {
  workout_day_id: number;
  exercise_id: number;
  exercise_type: string;
  sets: number;
  seconds_per_set: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity: string;
  intensity_value: number;
  notes?: string;
  distance: number;
  speed: number;
  met_id?: number | null;
  id: number;
  exercise_name: string;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
}
export interface WorkoutDatabyId {
  workout_name: string;
  org_id: number;
  description?: string;
  visible_for: VisibilityEnum;
  goals: string;
  level: difficultyEnum;
  weeks: number;
  img_url?: string;
  id: number;
  members: members[];
  days: days[];
  is_published: boolean;
}

export interface workoutUpdateStatus {
  id: number;
  goals?: string;
  level?: difficultyEnum;
  weeks: number;
}

export interface exerciseByWorkoutDayUpdateResponse {
  workout_day_id: number;
  id: number;
  exercise_type?: ExerciseTypeEnum;
  intensity_value?: number;
  exercise_id: number;
  distance?: number;
  sets?: number;
  speed?: number;
  met_id?: number;
  seconds_per_set?: number[];
  notes?: string;
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity?: IntensityEnum;
}

export interface exerciseByWorkoutDayUpdateInput {
  id: number;
  exercise_type?: ExerciseTypeEnum;
  sets: number;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity?: IntensityEnum;
  intensity_value?: number;
  notes?: string;
  exercise_id: number;
}

export interface getWorkoutdayExerciseResponse {
  workout_day_id: number;
  exercise_id: number;
  exercise_type?: ExerciseTypeEnum;
  sets: number;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity?: IntensityEnum;
  intensity_value?: number;
  notes?: string;
  distance?: number;
  speed?: number;
  met_id?: number;
  id: number;
  exercise_name: string;
  gif_url: string;
}

export interface workoutDayExerciseInput {
  workout_day_id?: number;
  exercise_id?: number;
  exercise_type: ExerciseTypeEnum;
  sets?: number | null;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity?: IntensityEnum;
  intensity_value?: number | null;
  notes?: string;
  distance?: number | null;
  speed?: number | null;
  met_id?: number | null;
}

export interface RegisterSession {
  counter_id: number;
  opening_balance: number;
  id: number;
  closing_balance: number;
  opening_time: string;
  closing_time: string;
  discrepancy?: number;
  notes?: string;
  created_by: string;
  created_date: string;
}

export interface RegisterationTableType {
  data: RegisterSession[];
  total_counts: number;
  filtered_counts: number;
}

export interface refundhistory {
  id: number;
  receiptNumber: string;
  user: string;
  type: "Receipt" | "Refund";
  taxRate: number;
  taxName: string;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: "Paid" | "Unpaid" | "Partially Paid";
  created_by: string;
  created_at: string;
}
export interface Salehistory {
  id: number;
  receiptNumber: string;
  type: "Receipt" | "Refund";
  user: string;
  taxRate: number;
  taxName: string;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: "Paid" | "Unpaid" | "Partially Paid";
  created_by: string;
  created_at: string;
  refunditems?: refundhistory[];
}

export interface SaleshistoryTableType {
  data: Salehistory[];
  total_counts: number;
  filtered_counts: number;
}

export interface counterRegisterSession {
  counter_id?: number;
  opening_balance?: number;
  id?: number;
  closing_balance?: number;
  opening_time?: string;
  closing_time?: string;
  discrepancy?: number;
  notes?: string;
  total_amount?: number;
  refund_amount?: number;
}

export interface registerSessionStorage {
  time: string;
  isOpen: boolean;
  isContinue: boolean;
  sessionId: number;
  opening_balance: number;
  opening_time: string;
}
export interface PaymentMethodPlugin {
  id: number;
  name: string;
  code: string;
  payment_method_id: number;
  org_id: number;
  sort_order: number;
  status: boolean;
  username: string;
  password: string;
  is_test: boolean;
  url: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: number | null;
  updated_by: number | null;
}

export interface PaymentMethodUpdate {
  id: number;
  data: {
    payment_method_id: number;
    sort_order?: number;
    status?: boolean;
    username?: string;
    password?: string;
    is_test?: boolean;
    url?: string;
  };
}

export enum statusEnumGrid {
  Sale = "Sale",
  Refund = "Refund",
}

export enum typeTransactionEnum {
  Paid = "Paid",
  Unpaid = "Unpaid",
  // Partially_Paid = "Partially Paid",
}

export interface lineItems {
  item_id: number;
  item_type: string;
  description: string;
  quantity: number;
  price: number;
  tax_rate: number;
  discount: number;
  sub_total: number;
  tax_type: string;
  tax_name: string;
  total: number;
  tax_amount: number;
}

export interface paymentOptions {
  payment_method_id: number;
  payment_method: string;
  amount: number;
}
export interface salesReportInterface {
  id: number;
  batch_id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  member_address: string;
  member_gender: genderEnum;
  staff_id: number;
  staff_name: string;
  receipt_number: string;
  notes: string;
  member_nic?: string;
  tax_number: number;
  total: number;
  subtotal: number;
  tax_amt: number;
  discount_amt: number;
  main_transaction_id: number;
  transaction_type: statusEnumGrid;
  status: typeTransactionEnum;
  transaction_date?: Date;
  items?: lineItems[];
  payments?: paymentOptions[];
}

export interface salesReportTableTypes {
  data: salesReportInterface[];
  total_counts: number;
  filtered_counts: number;
}
