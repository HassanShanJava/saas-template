import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";

interface OpenRegisterFormInputs {
  openingBalance: number;
  notes?: string;
}

const OpenRegister: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpenRegisterFormInputs>();

  const onSubmit: SubmitHandler<OpenRegisterFormInputs> = (data) => {
    // Simulate API call to open register
    setTimeout(() => {
      console.log("Opening balance:", data.openingBalance);
      toast({
        variant: "success",
        description: "Register opened successfully",
      });
      // Here you would typically make an API call to your backend
    }, 1000);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="w-full flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Open Register
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please open register with opening balance
        </p>
        <div className="flex flex-col gap-4 w-[60%] ">
          <FloatingLabelInput
            id="openingBalance"
            type="number"
            label="Opening Balance*"
            step="0"
            {...register("openingBalance", {
              required: "Please provide opening balance",
              min: { value: 0, message: "Opening balance must be positive" },
            })}
            error={errors.openingBalance?.message}
          />
          <FloatingLabelInput
            id="notes"
            type="textarea"
            label="Notes (optional)"
            {...register("notes")}
          />
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full  text-white transition duration-300"
            >
              Open Register
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OpenRegister;
