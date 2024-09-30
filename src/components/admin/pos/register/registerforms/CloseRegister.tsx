import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";

interface CloseRegisterFormInputs {
  closingBalance: number;
  notes?: string;
}

interface LastClosureDetails {
  sessionId: string;
  openingTime: string;
  closingTime: string;
  closingBalance: number;
}

const CloseRegister: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [discrepancyWarning, setDiscrepancyWarning] = useState<string | null>(
    null
  );
  const [lastClosureDetails, setLastClosureDetails] =
    useState<LastClosureDetails | null>(null);

  const expectedClosingBalance = 1000; // This should be fetched from your backend

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CloseRegisterFormInputs>();

  const closingBalance = watch("closingBalance");

  const onSubmit: SubmitHandler<CloseRegisterFormInputs> = (data) => {
    const discrepancy = data.closingBalance - expectedClosingBalance;
    if (discrepancy !== 0) {
      setDiscrepancyWarning(
        `Warning: There's a discrepancy of ${discrepancy} in the closing balance.`
      );
    } else {
      setDiscrepancyWarning(null);
    }

    // Simulate API call to close register
    setTimeout(() => {
      setShowSuccess(true);
      toast({
        variant: "success",
        description: "Register closed successfully",
      });
      setLastClosureDetails({
        sessionId: "SESSION123",
        openingTime: new Date().toLocaleString(),
        closingTime: new Date().toLocaleString(),
        closingBalance: data.closingBalance,
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-x-3 p-1 w-full ">
      <div className="flex flex-row  justify-center items-start w-full">
        {/* Last Closure Details */}

        <div className="w-[50%] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Current Session Details
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
            Close Register
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please provide a closing balance to close the register
          </p>
          <div className="w-[80%] p-6 rounded-md  flex flex-col justify-between gap-3">
            <FloatingLabelInput
              id="closingBalance"
              type="number"
              label="Closing Balance*"
              {...register("closingBalance", {
                required: "Please provide closing balance.",
                min: {
                  value: 0,
                  message: "Closing balance must be 0 or greater.",
                },
                max: {
                  value: Number.MAX_SAFE_INTEGER,
                  message: "Closing balance exceeds the maximum allowed value.",
                },
              })}
              error={errors.closingBalance?.message}
            />{" "}
            <FloatingLabelInput
              id="notes"
              type="textarea"
              label="Notes (optional)"
              {...register("notes", {
                maxLength: {
                  value: 350,
                  message: "Notes cannot exceed 350 characters",
                },
              })}
            />
            {discrepancyWarning && (
              <p className="text-yellow-600 text-sm">{discrepancyWarning}</p>
            )}
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="mt-6 w-[40%]  text-white transition duration-300"
              >
                Close Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CloseRegister;
