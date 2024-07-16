import { StepperFormKeys } from "@/lib/constants/hook-stepper-constants";

export type StepperFormKeysType =
  (typeof StepperFormKeys)[keyof typeof StepperFormKeys][number];

  export type StepperFormValues = {
    [FormName in StepperFormKeysType]: FormName extends
      | "registration_fee"
      | "total_amount"
      | "tax_amount" 
      | "tax_rate"
      | "discount_percentage"
      | "net_price"
      | "days_before"
      | "next_invoice"
      | "prolongation_period"
      ? number
      : FormName extends "status" | "auto_renewal"
      ? boolean
      : string;
  };