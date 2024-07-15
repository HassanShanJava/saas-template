import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { StepperFormValues } from "@/types/hook-stepper";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetIncomeCategoryQuery } from "@/services/incomeCategoryApi";
import { useGetSalesTaxQuery } from "@/services/salesTaxApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const AutoRenewalForm = () => {
  const [incomeCategoryListData, setIncomeCategoryListData] = useState([]);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    data: incomeCategoryData,
    isLoading,
    refetch,
  } = useGetIncomeCategoryQuery(orgId);

  const { data: salesTaxData } = useGetSalesTaxQuery(orgId);

  useEffect(() => {
    const data = [];
  }, [salesTaxData, incomeCategoryData]);

  const {
    control,
    formState: { errors },
    register,
    trigger,
  } = useFormContext<StepperFormValues>();

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-2xl">Renewal and Billing Cycle</h1>
      <div className="mt-3 flex gap-4 items-center">
        <Controller
          name="auto_renewal"
          control={control}
          defaultValue={'false'}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => (
            <div className="flex py-0.5 items-center gap-2">
              <Checkbox
                checked={value === "true"}
                onCheckedChange={(e) => onChange(e ? "true" : "false")}
                aria-label="Auto Renewal?"
              />
              <Label className="">Auto Renewal?</Label>
            </div>
          )}
        />

      </div>
    </div>
  );
};

export default AutoRenewalForm;
