import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { StepperFormValues } from "@/types/hook-stepper";
import { useEffect, useState } from "react";

import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const AutoRenewalForm = () => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    control,
    formState: { errors },
    register,
    getValues,
    setValue,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();

  const [autoRenewal, setAutoRenewal] = useState<boolean | undefined>(
    (getValues("auto_renewal") as boolean) || false
  );

  useEffect(() => {
    const subscription = watch((value) => {
      setAutoRenewal(value?.auto_renewal);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleDayInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof StepperFormValues
  ) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 15) {
      setValue(field, 15);
    }
  };

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-xl">
        Renewal and Billing Cycle
      </h1>
      <div className="mt-6 flex gap-6 items-center">
        <Controller
          name="auto_renewal"
          control={control}
          defaultValue={false}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => (
            <div className="flex py-0.5 items-center gap-2">
              <Checkbox
                checked={value}
                onCheckedChange={(e) => onChange(e)}
                aria-label="Auto Renewal?"
              />
              <Label className="">Auto Renewal?</Label>
            </div>
          )}
        />
        {autoRenewal && (
          <div className="flex items-center gap-3 text-sm">
            <Label className="font-semibold ">Prolongation period*</Label>
            <FloatingLabelInput
              id="prolongation_period"
              type="number"
              min={0}
              className="w-20 "
              {...register("prolongation_period", {
                required: "Prolongation period is Required",
              })}
              error={errors.prolongation_period?.message}
            />
          </div>
        )}
      </div>
      {autoRenewal && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-4">
            <Label className="font-semibold ">Auto renewal takes place*</Label>
            <FloatingLabelInput
              id="days_before"
              type="number"
              min={1}
              max={15}
              className="w-20 "
              {...register("days_before", { required: "Days are Required",
                valueAsNumber: true,
                validate: (value) =>
                  (value && value <= 15) || "Value must be 15 or less",
                onChange:(e)=> handleDayInput(e,'days_before'),
               })}
              error={errors.days_before?.message}
            />
            <p>days before contracts runs out.</p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="font-semibold ">
              Next invoice will be created *
            </Label>
            <FloatingLabelInput
              id="next_invoice"
              type="number"
              min={1}
              max={15}
              className="w-20 "
              {...register("next_invoice", {
                required: "Days are Required",
                valueAsNumber: true,
                validate: (value) =>
                  (value && value <= 15) || "Value must be 15 or less",
                onChange:(e)=> handleDayInput(e,'next_invoice'),
              })}
              error={errors.next_invoice?.message}
            />
            <p>days before the start of the new billing cycle.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoRenewalForm;
