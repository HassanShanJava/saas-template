import { Controller, useFormContext } from "react-hook-form";
import { JSONObject, StepperFormValues } from "@/types/hook-stepper";

import { useEffect, useState } from "react";
import CreditsTableView from "./creditTable/table";

export interface facilites extends JSONObject{
  "id":number,
  "total_credits":number,
  "validity": {
    "duration_type": string;
    "duration_no": number;
  }
}

const CreditDetailsForm = () => {
  const [facilites,setFacilities]=useState<facilites[]>([])
  const {
    control,
    formState: { errors },
    register,
    setValue,
    getValues,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();

  console.log(errors,facilites,"credit detail form")
  useEffect(()=>{
    if(facilites){
      setValue("facilities",facilites)
    }
  },[facilites])


  return (
    <div className="text-black h-full">
      <CreditsTableView setFacilities={setFacilities} facilities={facilites} />
    </div>
  );
};

export default CreditDetailsForm;
