import { StepperFormKeys } from "@/lib/constants/hook-stepper-constants";
import {renewalData,facilitiesData}from "@/app/types"

type JSONValue = string | number | boolean | Date | undefined | JSONObject;

export interface JSONObject {
  [x: string]: JSONValue;
}






export type StepperFormKeysType =
  (typeof StepperFormKeys)[keyof typeof StepperFormKeys][number];

export type StepperFormValues = {
  [FormName in StepperFormKeysType]: FormName extends
    | "reg_fee"
    | "duration_no"
    | "total_price"
    | "tax_amount"
    | "tax_rate"
    | "discount"
    | "net_price"
    | "prolongation_period"
    | "days_before"
    | "next_invoice"
    | "org_id"
    | "group_id"
    | "income_category_id"
    | "created_by"
    ? number
    : FormName extends "auto_renewal"
      ? boolean
      : FormName extends "renewal_data"  
        ? renewalData | object
      : FormName extends  "access_time" 
        ? object
      : FormName extends "facilities" 
        ? facilitiesData[]
        : string;
};
