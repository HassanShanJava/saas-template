import { ColumnDef } from "@tanstack/react-table";
import { Gender, UserStatus } from "@/app/shared_enums/enums";

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

export type SearchCriteriaType =
  | CoreSearchCriteria
  | (CoreSearchCriteria & Record<string, string>);

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

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

export type TimeSlot = {
  from_time: string;
  to_time: string;
};

export type LimitedAccessTime = {
  [day: string]: TimeSlot[];
};