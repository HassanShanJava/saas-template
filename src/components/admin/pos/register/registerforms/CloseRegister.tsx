import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import {
  useCloseRegisterMutation,
  useGetlastRegisterSessionQuery,
} from "@/services/registerApi";
import { displayDateTime, displayValue } from "@/utils/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorType } from "@/app/types";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { AlertDiscrepancy } from "./../components/close-register";
interface CloseRegisterFormInputs {
  closing_balance: number;
  notes?: string;
}

const CloseRegister: React.FC = () => {
  const { code, counter_number } = useSelector(
    (state: RootState) => state.counter
  );
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [discrepancy, setDiscrepancy] = useState<number | null>(null);
  const [data, setData] = useState<CloseRegisterFormInputs | null>();
  const {
    data: counterData,
    isLoading,
    refetch,
    error,
  } = useGetlastRegisterSessionQuery(counter_number as number, {
    refetchOnMountOrArgChange: true, // Refetch on mount or argument change
    refetchOnFocus: true, // Refetch when the tab gains focus
    refetchOnReconnect: true, // Refetch when the browser reconnects
  });

  const [
    closeRegister,
    { isLoading: closeRegisterLoading, isError: closeRegisterError },
  ] = useCloseRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CloseRegisterFormInputs>();

  const expectedCLosingBalance = 120000;

  const onSubmit: SubmitHandler<CloseRegisterFormInputs> = (data) => {
    setData(data);
    const calculatedDiscrepancy =
      (counterData?.total_amount as number) - data.closing_balance;
    setDiscrepancy(calculatedDiscrepancy);
    setAlertOpen(true); // Open the alert regardless of the discrepancy value
  };

  const handleConfirm = async () => {
    if (data !== null) {
      try {
        const payload = {
          id: counterData?.id as number,
          closing_balance: data?.closing_balance,
          notes: data?.notes?.toLowerCase(),
        };
        const resp = await closeRegister(payload).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Store closed successfully",
          });
          localStorage.removeItem("registerSession");
        }
      } catch (error: unknown) {
        console.error("Error", { error });
        if (error && typeof error === "object" && "data" in error) {
          const typedError = error as ErrorType;
          toast({
            variant: "destructive",
            title: "Error in form Submission",
            description: `${typedError.data?.detail}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error in form Submission",
            description: `Something Went Wrong.`,
          });
        }
      } finally {
        setAlertOpen(false); // Close the alert after the action is done
      }
    }
  };
  // const onSubmit: SubmitHandler<CloseRegisterFormInputs> = async (data) => {
  //   try {
  //     const payload = {
  //       id: counterData?.id as number,
  //       closing_balance: data.closing_balance,
  //       notes: data.notes,
  //     };
  //     const resp = await closeRegister(payload).unwrap();
  //     if (resp) {
  //       toast({
  //         variant: "success",
  //         title: "Store closed successfully",
  //       });
  //       const discrepancy = data.closing_balance - expectedCLosingBalance;
  //       if (discrepancy !== 0) {
  //         setDiscrepancyWarning(
  //           `Warning: There's a discrepancy of ${discrepancy} in the closing balance.`
  //         );
  //       } else {
  //         setDiscrepancyWarning(null);
  //       }
  //       localStorage.removeItem("registerSession");
  //     }
  //   } catch (error: unknown) {
  //     console.error("Error", { error });
  //     if (error && typeof error === "object" && "data" in error) {
  //       const typedError = error as ErrorType;
  //       toast({
  //         variant: "destructive",
  //         title: "Error in form Submission",
  //         description: `${typedError.data?.detail}`,
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Error in form Submission",
  //         description: `Something Went Wrong.`,
  //       });
  //     }
  //   }
  // };

  console.log("data", counterData?.total_amount?.toString());
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-x-3 p-1 w-full ">
        <div className="flex flex-row  justify-center items-start w-full">
          {/* Last Closure Details */}

          <div className="w-[50%] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Current Session Details
            </h2>
            {isLoading ? (
              <div className="p-6 rounded-md w-full h-full flex flex-col items-center justify-center">
                <div>
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-[100px]" /> {/* Label */}
                    <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-[130px]" /> {/* Label */}
                    <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-[150px]" /> {/* Label */}
                    <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-[150px]" /> {/* Label */}
                    <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                  </div>
                </div>
              </div>
            ) : (
              <div className=" p-6 rounded-md w-full h-full flex flex-col items-center justify-center">
                <div>
                  <p className="text-sm flex gap-2">
                    <span className="text-sm">Session ID:</span>{" "}
                    {displayValue(counterData?.id?.toString())}
                  </p>
                  <p className="text-sm flex gap-2">
                    <span className="text-sm">Opening Time:</span>{" "}
                    {displayDateTime(counterData?.opening_time?.toString())}
                  </p>
                  <p className="text-sm flex gap-2">
                    <span className="text-sm">Total Cash Recieved:</span>{" "}
                    {displayValue(counterData?.total_amount?.toString())}
                  </p>
                  <p className="text-sm flex gap-2">
                    <span className="text-sm">Total Refund Amount:</span>{" "}
                    {displayValue(counterData?.refund_amount?.toString())}
                  </p>
                </div>
              </div>
            )}
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
                {...register("closing_balance", {
                  required: "Please provide closing balance.",
                  min: {
                    value: 0,
                    message: "Closing balance must be 0 or greater.",
                  },
                  max: {
                    value: Number.MAX_SAFE_INTEGER,
                    message:
                      "Closing balance exceeds the maximum allowed value.",
                  },
                })}
                error={errors.closing_balance?.message}
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
              <div className="flex justify-center items-center">
                <LoadingButton
                  type="submit"
                  className="mt-6 w-40  text-white transition duration-300"
                  loading={closeRegisterLoading}
                  disabled={closeRegisterLoading}
                >
                  {closeRegisterLoading ? `Closing...` : `Close Register`}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </form>
      <AlertDiscrepancy
        isOpen={isAlertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirm}
        discrepancy={discrepancy}
      />
    </>
  );
};

export default CloseRegister;
