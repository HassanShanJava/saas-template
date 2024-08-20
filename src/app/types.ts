import { statusEnum } from "@/components/admin/staff/staffForm/form";
import { JSONObject } from "@/types/hook-stepper";

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
  id: number;
  total_credits: number | null;
  validity: {
    duration_type?: string | undefined | null;
    duration_no?: number | null;
  };
}

export interface updateMembershipType {
  id: number | null;
  org_id: number | null;
  name?: string;
  group_id?: number | null;
  description?: string;
  status?: string;
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
  access_time: object;
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

enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}
export interface MemberInputTypes {
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
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
  client_since?: Date | string;
  created_at?: string | null;
  created_by?: number | null;
  org_id?: number;
  coach_id?: any[];
  membership_plan_id: number | undefined;
  send_invitation?: boolean;
  status?: string;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
}

export interface MemberResponseTypes {
  profile_img?: string | null;
  own_member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: Date | string;
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
  client_since?: Date;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: any[] | null;
  membership_plan_id: number | undefined;
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
  client_since?: Date;
  client_status?: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: any[];
  membership_plan_id: number | undefined;
  send_invitation?: boolean;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
  check_in?: string | null;
  coaches: {
    id: number;
    name: string;
  }[];
  last_online?: string | null;
  business_name?: string | null;
}

export interface MemberTableResponseDatatypes {
  id: number;
  profile_img?: string;
  own_member_id?: string;
  first_name?: string;
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
  client_since?: Date;
  client_status?: string;
  created_at?: string | null;
  created_by?: number | null;
  org_id: number;
  coach_id?: any[];
  membership_plan_id: number | undefined;
  send_invitation?: boolean;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
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
  gender?: "male" | "female" | "other";
  dob: string;
  email: string;
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
  coach_since?: string | null;
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
  gender?: "male" | "female" | "other";
  dob?: string;
  email?: string;
  phone?: string;
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
  dob: string;
  gender?: "male" | "female" | "other";
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
  coach_since?: string;
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
  gender?: "male" | "female" | "other";
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
  coach_since?: string | null;
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
  gender: "male" | "female" | "other";
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
  coach_since?: string | null; // ISO date string
  coach_status: "pending" | "active" | "inactive";
  org_id: number;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_at?: string;
  members: number[];
}
export interface CoachResponseTypeById {
  id: number;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: "male" | "female" | "other";
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
  coach_since?: string | null; // ISO date string
  coach_status: "pending" | "active" | "inactive";
  org_id: number;
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
  created_at?: string;
  member_ids: Member[];
}

export interface ServerResponseById {
  id: number;
  own_coach_id: string;
  profile_img?: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: "male" | "female" | "other";
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
  last_online: string | null;
  coach_since: string | null; // ISO date string
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
  gender?: "male" | "female" | "other";
  email?: string;
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
  coach_since?: string;
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
  Advance = "Advance",
  Expert = "Expert",
}
export enum IntensityEnum {
  max_intensity = "Max Intensity",
  irm = "irm",
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
  exercise_name: string;
  visible_for?: VisibilityEnum;
  org_id?: number;
  exercise_type?: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value: number;
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
  category_id: number | null;
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

export interface ExerciseResponseViewType {
  exercise_name: string;
  visible_for?: VisibilityEnum;
  org_id?: number;
  exercise_type?: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value?: number | null;
  difficulty?: difficultyEnum;
  sets?: number | null;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  distance?: number | null;
  speed?: number | null;
  met_id?: number | null;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id: number | null;
  equipment_ids: number[];
  primary_muscle_ids: number[];
  secondary_muscle_ids?: number[];
  primary_joint_ids: number[];
  id: number;
  category_name: string;
}

export interface ExerciseResponseServerViewType {
  exercise_name: string;
  visible_for?: VisibilityEnum;
  org_id?: number;
  exercise_type?: ExerciseTypeEnum;
  exercise_intensity?: IntensityEnum;
  intensity_value?: number | null;
  difficulty?: difficultyEnum;
  sets?: number | null;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  distance?: number | null;
  speed?: number | null;
  met_id?: number | null;
  gif_url: string;
  video_url_male?: string;
  video_url_female?: string;
  thumbnail_male?: string;
  thumbnail_female?: string;
  image_url_female?: string;
  image_url_male?: string;
  category_id: number | null;
  equipments: baseExerciseApiResponse[];
  primary_muscles: baseExerciseApiResponse[];
  secondary_muscles?: baseExerciseApiResponse[];
  primary_joints: baseExerciseApiResponse[];
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
