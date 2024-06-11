import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  subscription: z.enum(["", "full-month", "half-month", "trial"]), // Empty string added for placeholder
});

const MyOnlyForm: React.FC = () => {
  const { register, handleSubmit } = useForm<{
    subscription: string;
  }>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: { subscription: string }) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full">
      <div >
        <select
          {...register("subscription")}
          className="block w-full h-10 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select an option</option> {/* Placeholder text */}
          <option value="full-month">Full Month</option>
          <option value="half-month">Half Month</option>
          <option value="trial">Trial</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 6.707a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 11a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <button
        type="submit"
        className="inline-block w-full px-4 py-2 mt-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default MyOnlyForm;
