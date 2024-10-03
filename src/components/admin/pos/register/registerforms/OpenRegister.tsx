import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";
import {
  useGetlastRegisterSessionQuery,
  useOpenRegisterMutation,
} from "@/services/registerApi";
import { ErrorType, registerSessionStorage } from "@/app/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// registerSessionStorage;
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { useSession } from "@/hooks/use-Session";
import { time } from "console";
import {
  displayDateTime,
  displayValue,
  saveToLocalStorage,
} from "@/utils/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
interface OpenRegisterFormInputs {
  opening_balance: number;
}

const OpenRegister: React.FC = () => {
  const { code, counter_number } = useSelector(
    (state: RootState) => state.counter
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpenRegisterFormInputs>();

  const {
    data: counterData,
    isLoading,
    refetch,
    error,
  } = useGetlastRegisterSessionQuery(counter_number as number);

  const [
    openregister,
    { isLoading: openRegisterLoading, isError: openRegisterError },
  ] = useOpenRegisterMutation();

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const onSubmit: SubmitHandler<OpenRegisterFormInputs> = async (data) => {
    try {
      const payload = {
        ...data,
        counter_id: counter_number as number,
      };
      if (counter_number) {
        const resp = await openregister(payload).unwrap();
        const sessionData = {
          time: Date.now().toString(),
          isOpen: true,
          isContinue: false,
          sessionId: resp.id ?? 1,
          opening_balance: resp.opening_balance as number,
          opening_time: resp.opening_time as string,
        };
        if (resp) {
          toast({
            variant: "success",
            title: "Store opened successfully",
          });
          saveToLocalStorage("registerSession", sessionData);
          navigate("/admin/pos/sell");
        }
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-x-3 p-1 w-full"
    >
      <div className="flex flex-row  justify-center items-start w-full">
        {/* Last Closure Details */}
        <div className="w-[50%] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Last Closure Details
          </h2>
          {isLoading ? (
            <div className="p-6 rounded-md w-full h-full flex flex-col items-center justify-center">
              <div>
                <div className="text-lg flex gap-2">
                  <Skeleton className="h-4 w-[100px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className="text-lg flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[130px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className="text-lg flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[150px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className="text-lg flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[120px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className="text-lg flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[140px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className="text-lg flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[80px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[200px]" /> {/* Value */}
                </div>
              </div>
            </div>
          ) : (
            <div className=" p-6 rounded-md w-full h-full flex flex-col items-center justify-center">
              <div>
                <p className="text-lg flex gap-2">
                  <strong>Session ID:</strong>{" "}
                  {displayValue(counterData?.id?.toString())}
                </p>
                <p className="text-lg flex gap-2">
                  <strong>Opening Time:</strong>{" "}
                  {displayDateTime(counterData?.opening_time?.toString())}
                </p>
                <p className="text-lg flex gap-2">
                  <strong>Opening Balance:</strong>{" "}
                  {displayValue(counterData?.opening_balance?.toString())}
                </p>
                <p className="text-lg flex gap-2">
                  <strong>Closing Time:</strong>{" "}
                  {displayDateTime(counterData?.closing_time?.toString())}
                </p>
                <p className="text-lg flex gap-2">
                  <strong>Closing Balance:</strong>{" "}
                  {displayValue(counterData?.closing_balance?.toString())}
                </p>
                <p className="text-lg flex gap-2">
                  <strong>Notes:</strong>{" "}
                  {counterData?.notes && counterData.notes.length > 30 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="capitalize">
                            {counterData.notes.slice(0, 30) + "..."}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {displayValue(counterData.notes.toString())}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="capitalize">
                      {displayValue(counterData?.notes?.toString())}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
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
              {...register("opening_balance", {
                required: "Please provide opening balance",
                min: { value: 0, message: "Opening balance must be positive" },
              })}
              error={errors.opening_balance?.message}
            />

            <div className="flex justify-center items-center">
              <LoadingButton
                type="submit"
                className="mt-6 w-[40%]  text-white transition duration-300"
                loading={openRegisterLoading}
                disabled={openRegisterLoading}
              >
                {openRegisterLoading ? `Opening...` : `Open Register`}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OpenRegister;
