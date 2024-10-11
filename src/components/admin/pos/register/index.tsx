import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OpenRegister from "./registerforms/OpenRegister";
import CloseRegister from "./registerforms/CloseRegister";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetRegisterData } from "@/constants/counter_register";

const Register = () => {
  const { counter_number } = useSelector((state: RootState) => state.counter);

  const {
    data: sessiondata,
    isDayExceed,
    isLoading,
    isRegisterOpen,
  } = useGetRegisterData(counter_number as number);

  if (isLoading) {
    // While loading, show the loader first
    return (
      <div className="w-full p-5">
        <Card className="p-4 h-fit flex flex-col justify-center">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-full" /> {/* Title Skeleton */}
            <Skeleton className="h-10 w-full" /> {/* Form Skeleton */}
            <Skeleton className="h-8 w-full" /> {/* Button Skeleton */}
          </div>
        </Card>
      </div>
    );
  }

  // Once loading is complete, show the correct component
  return (
    <div className="w-full p-5">
      <Card className="p-4  h-fit flex flex-col justify-center">
        <div className="flex-1 overflow-y-auto">
          {isRegisterOpen ? <CloseRegister /> : <OpenRegister />}
        </div>
      </Card>
    </div>
  );
};

export default Register;
