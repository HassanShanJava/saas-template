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
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import {
  displayDateTime,
  displayValue,
  formatToPKR,
  saveToLocalStorage,
} from "@/utils/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import DocumentTitle from "@/components/ui/common/document-title";
interface OpenRegisterFormInputs {
  opening_balance: number;
}

const OpenRegister: React.FC = () => {
  const { code, counter_number } = useSelector(
    (state: RootState) => state.counter
  );

  const pos_register = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string)
          .pos_register ?? "no_access"
      );
    } catch {
      return "no_access";
    }
  })();

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
          refetch();

          toast({
            variant: "success",
            title: "Store opened successfully",
          });
          saveToLocalStorage("registerSession", sessionData);
          navigate("/admin/pos/sell/");
        }
      }
    } catch (error: unknown) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail || (typedError.data as { message?: string }).message}`,
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
  
  DocumentTitle("Open Register");

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-x-3 p-1 w-full"
    >
      <div className="flex flex-col-reverse slg:flex-row justify-center items-start w-full">
        {" "}
        {/* Last Closure Details */}
        <div className="w-full slg:w-[50%] flex flex-col items-center rounded-lg mb-6 lg:mb-0">
          {" "}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Last Closure Details
          </h2>
          {isLoading ? (
            <div className="p-3 rounded-md w-full h-full flex flex-col items-center justify-center">
              <div>
                <div className=" flex gap-2">
                  <Skeleton className="h-4 w-[100px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className=" flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[130px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className=" flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[150px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className=" flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[120px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className=" flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[140px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Value */}
                </div>
                <div className=" flex gap-2 mt-2">
                  <Skeleton className="h-4 w-[80px]" /> {/* Label */}
                  <Skeleton className="h-4 w-[200px]" /> {/* Value */}
                </div>
              </div>
            </div>
          ) : (
            <div className=" p-3 rounded-md w-full h-full flex flex-col items-center justify-center">
              <div className="gap-1.5 flex flex-col">
                <p className=" text-sm flex gap-2">
                  <span className="text-sm font-semibold">Session ID:</span>{" "}
                  {displayValue(counterData?.id?.toString())}
                </p>
                <p className=" text-sm flex gap-2">
                  <span className="text-sm font-semibold">Opening Time:</span>{" "}
                  {displayDateTime(counterData?.opening_time?.toString())}
                </p>
                <p className=" text-sm flex gap-2">
                  <span className="text-sm font-semibold">
                    Opening Balance:
                  </span>{" "}
                  {formatToPKR(counterData?.opening_balance)}
                </p>
                <p className="text-sm flex gap-2">
                  <span className="text-sm font-semibold">Closing Time:</span>{" "}
                  {displayDateTime(counterData?.closing_time?.toString())}
                </p>
                <p className="text-sm flex gap-2">
                  <span className="text-sm font-semibold">
                    Closing Balance:
                  </span>{" "}
                  {formatToPKR(counterData?.closing_balance)}
                </p>
                <p className="text-sm flex gap-2">
                  <span className="text-sm font-semibold">Notes:</span>{" "}
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
        {pos_register !== "read" && (
          <div className="w-full slg:w-[50%]  flex flex-col items-center rounded-lg shadow-md ">
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
                  min: {
                    value: 0,
                    message: "Opening balance must be positive",
                  },
                })}
                error={errors.opening_balance?.message}
              />

              <div className="flex justify-center items-center">
                <LoadingButton
                  type="submit"
                  className="bg-primary text-sm mt-6 w-40   text-white transition flex items-center gap-1  lg:mb-0 h-8 px-2 duration-300"
                  loading={openRegisterLoading}
                  disabled={openRegisterLoading}
                >
                  {openRegisterLoading ? `Opening...` : `Open Register`}
                </LoadingButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default OpenRegister;
