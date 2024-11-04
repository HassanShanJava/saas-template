import { StepperFormKeys } from "@/lib/constants/hook-stepper-constants";
import { renewalData, facilitiesData } from "@/app/types"

type JSONValue = string | number | boolean | Date | undefined | null | JSONObject;

export interface JSONObject {
  [x: string]: JSONValue;
}

export type StepperFormKeysType =
  (typeof StepperFormKeys)[keyof typeof StepperFormKeys][number];

export type StepperFormValues = {
  [FormName in StepperFormKeysType]: FormName extends
  | "reg_fee"
  | "duration"
  | "total_price"
  | "tax_amount"
  | "tax_rate"
  | "discount"
  | "net_price"
  | "prolongation_period"
  | "days_before"
  | "next_invoice"
  | "org_id"
  | "id"
  | "group_id"
  | "created_by"
  ? (number | null)
  : FormName extends "auto_renewal"
  ? boolean
  : FormName extends "income_category_id"
  ? (number | undefined)
  : FormName extends "limited_access_data"
  ? Array<object>
  : FormName extends "renewal_data"
  ? renewalData | object
  : FormName extends "access_time" | "renewal_details"
  ? object
  : FormName extends "facilities"
  ? facilitiesData[]
  : string;
};
