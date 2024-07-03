export interface CountryTypes {
  id: number;
  country: string;
  country_code: number;
  is_deleted: boolean;
}

export interface CoachTypes{
  coach_name:string;
  id:number;
  is_deleted:boolean;
}

export interface sourceTypes{
  id:number;
  source:string;
}

export interface BusinessTypes{
  id:number;
  first_name:string;
}

export interface membershipplanTypes{
  name:string;
  price:string;
  org_id:number;
  id:number;
  is_deleted:boolean;
}

export interface staffType{
  org_id:number;
  id:number;
  first_name:string;
}

export interface LeadInputTypes{
first_name:string;
last_name:string;
staff_id?:number|null|undefined;
mobile?:string|null|undefined;
status:string;
source_id?:number|null|undefined;
lead_since:string;
phone?:string|null|undefined;
email?:string|null|undefined;
notes?:string|null|undefined;
created_by?:number|null|undefined;
updated_by?:number|null|undefined;
org_id:number;
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

export interface ClientInputTypes{
profile_img?:string;
own_member_id:string;
first_name:string;
last_name:string;
gender:string;
dob:string;
email:string;
phone?:string;
mobile_number?:string;
notes?:string;
source_id:number;
is_business?:boolean;
business_id?:number;
country_id:number;
city:string;
zipcode?:string;
address_1?:string;
address_2?:string;
org_id:number;
coach_id?:number;
membership_id:number;
send_invitation?:boolean;
status?:string;
client_since:string;
}

export interface ClientResponseTypes{

}