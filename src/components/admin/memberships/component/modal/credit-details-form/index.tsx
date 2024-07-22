import { Controller, useFormContext } from "react-hook-form";
import { StepperFormValues } from "@/types/hook-stepper";

import { useEffect, useState } from "react";
import CreditsTableView from "./creditTable/table";
import { facilitiesData } from "@/app/types";


const CreditDetailsForm = () => {
  const [facilites,setFacilities]=useState<facilitiesData[]>([])
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
      <CreditsTableView setFacilities={setFacilities} />
    </div>
  );
};

export default CreditDetailsForm;
