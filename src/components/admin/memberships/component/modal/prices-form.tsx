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
import { useGetIncomeCategoryQuery } from "@/services/incomeCategoryApi";
import { useGetSalesTaxQuery } from "@/services/salesTaxApi";
import { RootState } from "@/app/store";

const PriceDiscountTaxForm = () => {
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: incomeCategoryData } = useGetIncomeCategoryQuery(orgId);
  const { data: salesTaxData } = useGetSalesTaxQuery(orgId);

  const {
    control,
    formState: { errors },
    register,
    setValue,
    getValues,
    trigger,
    watch,
  } = useFormContext<StepperFormValues>();

  
  const netPrice = watch('net_price');
  const discountPercentage = watch('discount_percentage');
  const incomeCategory = watch('income_category');

  useEffect(() => {
    if (incomeCategory && salesTaxData) {
      const salesData = salesTaxData.find(item => item.id.toString() === incomeCategory);
      if (salesData) {
        const taxRate = salesData.percentage;
        const discountedPrice = netPrice * (1 - (discountPercentage / 100));
        const taxAmount = (taxRate / 100) * discountedPrice;
        const totalAmount = discountedPrice + taxAmount;

        if (watch('tax_rate') !== taxRate) {
          setValue('tax_rate', taxRate, { shouldValidate: true });
        }
        if (watch('tax_amount') !== taxAmount) {
          setValue('tax_amount', taxAmount, { shouldValidate: true });
        }
        if (watch('total_amount') !== totalAmount) {
          setValue('total_amount', totalAmount, { shouldValidate: true });
        }
      }
    }
  }, [incomeCategory, netPrice, discountPercentage, salesTaxData, setValue, watch]);

  return (
    <div className="text-black h-full">
      <h1 className="font-semibold text-[#2D374] text-2xl">
        Price, Discounts, and Tax Details
      </h1>
      <div className="grid grid-cols-3 gap-4 items-start mt-3">
        <FloatingLabelInput
          id="net_price"
          label="Net Price*"
          type='number'
          min={0}
          {...register("net_price", { required: "Net price is Required" })}
          error={errors.net_price?.message}
        />
        <FloatingLabelInput
          id="discount_percentage"
          label="Discount Percentage*"
          type='number'
          min={0}
          {...register("discount_percentage", {
            required: "Discount percentage is Required",
          })}
          error={errors.discount_percentage?.message}
        />
        <Controller
          name="income_category"
          rules={{ required: "Income category is Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => (
            <div>
              <Select
                onValueChange={(value) => {
                  onChange(value);
                }}
                value={value}
              >
                <SelectTrigger name="income_category" floatingLabel="Income Category*">
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                {invalid && (
                  <span className="text-destructive block !mt-[5px] text-[12px]">
                    {error?.message}
                  </span>
                )}
                <SelectContent>
                  {incomeCategoryData?.map((incomecategory) => (
                    <SelectItem value={incomecategory.sale_tax_id + ""} key={incomecategory.sale_tax_id}>
                      {incomecategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <FloatingLabelInput
          id="tax_rate"
          disabled={true}
          label="Tax/VAT Rate (%)*"
          {...register("tax_rate", {
            required: "Tax/VAT rate is Required",
          })}
          error={errors.tax_rate?.message}
        />
        <FloatingLabelInput
          id="tax_amount"
          disabled={true}
          label="Tax/VAT Amount*"
          type='number'
          min={0}
          {...register("tax_amount", {
            required: "Tax/VAT amount is Required",
          })}
          error={errors.tax_amount?.message}
        />
        <FloatingLabelInput
          id="total_amount"
          label="Total Amount*"
          disabled={true}
          type='number'
          min={0}
          {...register("total_amount", {
            required: "Total amount is Required",
          })}
          error={errors.total_amount?.message}
        />
        <Controller
          name="payment_cash"
          rules={{ required: "Payment cash is Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => (
            <div>
              <Select
                onValueChange={(value) => {
                  onChange(value);
                }}
                value={value}
              >
                <SelectTrigger name="payment_cash" floatingLabel="Payment Cash*">
                  <SelectValue placeholder="Select payment cash" />
                </SelectTrigger>
                {invalid && (
                  <span className="text-destructive block !mt-[5px] text-[12px]">
                    {error?.message}
                  </span>
                )}
                <SelectContent>
                  <SelectItem value={"cash"}>Cash</SelectItem>
                  <SelectItem value={"credit-debit"}>Credit/Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <FloatingLabelInput
          id="registration_fee"
          label="Registration Fee*"
          type='number'
          min={0}
          {...register("registration_fee", {
            required: "Registration fee is Required",
          })}
          error={errors.registration_fee?.message}
        />
        <Controller
          name="billing_cycle"
          rules={{ required: "Billing cycle is Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => (
            <div>
              <Select
                onValueChange={(value) => {
                  onChange(value);
                }}
                value={value}
              >
                <SelectTrigger name="billing_cycle" floatingLabel="Billing Cycle*">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                {invalid && (
                  <span className="text-destructive block !mt-[5px] text-[12px]">
                    {error?.message}
                  </span>
                )}
                <SelectContent>
                  <SelectItem value={"1"}>Monthly</SelectItem>
                  <SelectItem value={"3"}>Quarterly</SelectItem>
                  <SelectItem value={"6"}>Bi-Annually</SelectItem>
                  <SelectItem value={"12"}>Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PriceDiscountTaxForm;
