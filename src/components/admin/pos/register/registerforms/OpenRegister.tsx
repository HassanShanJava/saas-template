import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface OpenRegisterFormInputs {
  openingBalance: number;
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
        description: "Store open successfully",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-x-3 p-1 w-full">
      <div className="flex flex-row  justify-center items-start w-full">
        {/* Last Closure Details */}

        <div className="w-[50%] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Last Closure Details
          </h2>
          <div className=" p-6 rounded-md w-full h-full flex flex-col items-center justify-center">
            <div>
              <p className="text-lg">
                <strong>Session ID:</strong> Session123
              </p>
              <p className="text-lg">
                <strong>Opening Time:</strong> 9/29/2024, 11:02:06 PM
              </p>
              <p className="text-lg">
                <strong>Closing Time:</strong> 9/29/2024, 11:02:06 PM
              </p>
              <p className="text-lg">
                <strong>Closing Balance:</strong> 12,0000 PKR
              </p>
            </div>
          </div>
        </div>

        {/* Open Register Form */}
        <div className="w-[50%] flex flex-col items-center rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Open Register
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please open register with opening balance
          </p>
          <div className="w-[80%] p-6 rounded-md  flex flex-col justify-between gap-3">
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

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="mt-6 w-[40%]  text-white transition duration-300"
              >
                Open Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OpenRegister;
