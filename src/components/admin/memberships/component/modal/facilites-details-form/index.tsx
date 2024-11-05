import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "@/types/hook-stepper";
import { useEffect, useState } from "react";
import { facilitiesData } from "@/app/types";
import FacilityTableView from "./facilityTable/table";

const FacilityDetailsForm = () => {
  const [facilites, setFacilities] = useState<facilitiesData[]>([])

  const {
    setValue,
  } = useFormContext<StepperFormValues>();

  useEffect(() => {
    if (facilites) {
      setValue("facilities", facilites)
    }
  }, [facilites])

  return (
    <div className="text-black h-full">
      <FacilityTableView setFacilities={setFacilities} />
    </div>
  );
};

export default FacilityDetailsForm;