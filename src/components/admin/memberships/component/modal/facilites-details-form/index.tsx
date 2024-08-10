import { Controller, useFormContext } from "react-hook-form";
import { StepperFormValues } from "@/types/hook-stepper";

import { useEffect, useState } from "react";
import FacilityTableView from "./facilityTable/table";
import { facilitiesData } from "@/app/types";


const FacilityDetailsForm = () => {
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

  useEffect(()=>{
    if(facilites){
      setValue("facilities",facilites)
    }
  },[facilites])


  return (
    <div className="text-black h-full">
      <FacilityTableView setFacilities={setFacilities} />
    </div>
  );
};

export default FacilityDetailsForm;
