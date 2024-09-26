import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";

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
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="flex justify-center flex-col items-center gap-4">
        <span className="font-bold capitalize">Open Register</span>
        <div>
          <p>Please open register with opening balance</p>
        </div>
        <div>
          <label
            htmlFor="openingBalance"
            className="block text-sm font-medium text-gray-700"
          >
            Opening Balance
          </label>
          <input
            type="number"
            id="openingBalance"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            {...register("openingBalance", {
              required: "Opening balance is required",
              min: 0,
            })}
          />
          {errors.openingBalance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.openingBalance.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            {...register("notes")}
          />
        </div>
        <div className="flex justify-center items-center">
          <Button type="submit" className="text-black w-56">
            Open Register
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OpenRegister;
