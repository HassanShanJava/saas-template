// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
// import { toast } from "@/components/ui/use-toast";

// interface CloseRegisterFormInputs {
//   closingBalance: number;
// }

// interface LastClosureDetails {
//   sessionId: string;
//   openingTime: string;
//   closingTime: string;
//   closingBalance: number;
// }

// const CloseRegister: React.FC = () => {
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [discrepancyWarning, setDiscrepancyWarning] = useState<string | null>(
//     null
//   );
//   const [lastClosureDetails, setLastClosureDetails] =
//     useState<LastClosureDetails | null>(null);

//   const expectedClosingBalance = 1000; // This should be fetched from your backend

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm<CloseRegisterFormInputs>();

//   const closingBalance = watch("closingBalance");

//   const onSubmit: SubmitHandler<CloseRegisterFormInputs> = (data) => {
//     const discrepancy = data.closingBalance - expectedClosingBalance;
//     if (discrepancy !== 0) {
//       setDiscrepancyWarning(
//         `Warning: There's a discrepancy of ${discrepancy} in the closing balance.`
//       );
//     } else {
//       setDiscrepancyWarning(null);
//     }

//     // Simulate API call to close register
//     setTimeout(() => {
//       setShowSuccess(true);
//       toast({
//         variant: "success",
//         description: "Register closed successfully",
//       });
//       setLastClosureDetails({
//         sessionId: "SESSION123",
//         openingTime: new Date().toLocaleString(),
//         closingTime: new Date().toLocaleString(),
//         closingBalance: data.closingBalance,
//       });
//     }, 1000);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 w-full max-w-md mx-auto bg-white p-8"
//     >
//       <div className="flex flex-row justify-center ">
//         <div className="mt-6 p-4 bg-gray-100 rounded-md">
//           <h3 className="font-semibold mb-2">Last Closure Details:</h3>
//           <p>Session ID: {lastClosureDetails?.sessionId}</p>
//           <p>Opening Time: {lastClosureDetails?.openingTime}</p>
//           <p>Closing Time: {lastClosureDetails?.closingTime}</p>
//           <p>Closing Balance: {lastClosureDetails?.closingBalance}</p>
//         </div>
//       </div>
//       <div className=" rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Close Register
//         </h2>

//         <FloatingLabelInput
//           id="closingBalance"
//           type="number"
//           label="Closing Balance*"
//           {...register("closingBalance", {
//             required: "Please provide closing balance.",
//             min: { value: 0, message: "Closing balance must be 0 or greater." },
//             max: {
//               value: Number.MAX_SAFE_INTEGER,
//               message: "Closing balance exceeds the maximum allowed value.",
//             },
//           })}
//           error={errors.closingBalance?.message}
//         />

//         {discrepancyWarning && (
//           <p className="text-yellow-600 text-sm">{discrepancyWarning}</p>
//         )}

//         <Button
//           type="submit"
//           className="w-full  text-whitetransition duration-300"
//         >
//           Close Register
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default CloseRegister;

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { toast } from "@/components/ui/use-toast";

interface CloseRegisterFormInputs {
  closingBalance: number;
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-4xl mx-auto bg-white p-8"
    >
      <div className="flex flex-col md:flex-row justify-between gap-x-4">
        {/* <div className="w-full md:w-1/2 mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Last Closure Details:</h3>
          <p>Session ID: {lastClosureDetails?.sessionId}</p>
          <p>Opening Time: {lastClosureDetails?.openingTime}</p>
          <p>Closing Time: {lastClosureDetails?.closingTime}</p>
          <p>Closing Balance: {lastClosureDetails?.closingBalance}</p>
        </div> */}

        <div className="w-[50%] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800">
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
        <div className="w-full md:w-1/2 rounded-lg shadow-md space-y-6 p-3">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Close Register
          </h2>

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
          />

          {discrepancyWarning && (
            <p className="text-yellow-600 text-sm">{discrepancyWarning}</p>
          )}
          <div className="w-full flex  justify-center items-center ">
            <Button
              type="submit"
              className="w-[40%] text-white transition duration-300"
            >
              Close Register
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CloseRegister;
