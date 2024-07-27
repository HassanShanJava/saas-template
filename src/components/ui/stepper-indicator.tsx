import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { Check } from "lucide-react";
import React, { Fragment } from "react";

interface StepperIndicatorProps {
  activeStep: number;
  lastKey?:number
  labels: {
    label:string;
    key:number;
  }[]
}

const StepperIndicator = ({ activeStep, labels, lastKey }: StepperIndicatorProps) => {
  return (
    <div className=" flex justify-center items-center ">
      {labels.map((label, step) => (
        <Fragment key={label.key}>
          <div className="relative">
            <div
              className={clsx(
                "w-[40px] h-[40px] flex justify-center items-center m-[5px] border-[2px] rounded-full",
                label.key <  activeStep && "bg-primary text-white",
                label.key === activeStep && "border-primary text-primary"
              )}
            >
              {label.key >= activeStep ?label.key : <Check className="h-5 w-5" />}
            </div>
            <span className="absolute text-center text-xs font-semibold  w-28 -right-8">{label.label}</span>
          </div>

          {label.key !== lastKey && (
            <Separator
              orientation="horizontal"
              className={clsx(
                "w-[130px] h-[2px]",
                step <= activeStep - 1 && "bg-primary"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default StepperIndicator;
