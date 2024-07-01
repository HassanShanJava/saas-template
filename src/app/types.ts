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