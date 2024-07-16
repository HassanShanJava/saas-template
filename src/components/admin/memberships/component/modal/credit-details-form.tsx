import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { StepperFormValues } from "@/types/hook-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetCreditsQuery } from "@/services/creditsApi";

const CreditDetailsForm = () => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: creditsData } = useGetCreditsQuery(orgId);

  const {
    control,
    formState: { errors },
    register,
    setValue,
    getValues,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();

  //   const netPrice = watch('net_price');
  //   const discountPercentage = watch('discount_percentage');
  //   const incomeCategory = watch('income_category');

  //   useEffect(() => {
  //     if (incomeCategory && salesTaxData) {
  //       const salesData = salesTaxData.find(item => item.id.toString() === incomeCategory);
  //       if (salesData) {
  //         const taxRate = salesData.percentage;
  //         const discountedPrice = netPrice * (1 - (discountPercentage / 100));
  //         const taxAmount = (taxRate / 100) * discountedPrice;
  //         const totalAmount = discountedPrice + taxAmount;

  //         if (watch('tax_rate') !== taxRate) {
  //           setValue('tax_rate', taxRate, { shouldValidate: true });
  //         }
  //         if (watch('tax_amount') !== taxAmount) {
  //           setValue('tax_amount', taxAmount, { shouldValidate: true });
  //         }
  //         if (watch('total_amount') !== totalAmount) {
  //           setValue('total_amount', totalAmount, { shouldValidate: true });
  //         }
  //       }
  //     }
  //   }, [incomeCategory, netPrice, discountPercentage, salesTaxData, setValue, watch]);

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-xl">Credit details</h1>
    </div>
  );
};

export default CreditDetailsForm;
