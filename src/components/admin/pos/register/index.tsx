import { Card, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import OpenRegister from "./registerforms/OpenRegister";
import CloseRegister from "./registerforms/CloseRegister";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetlastRegisterSessionQuery } from "@/services/registerApi";
import { useGetRegisterData } from "@/constants/counter_register";
const Register = () => {
  const { code, counter_number } = useSelector(
    (state: RootState) => state.counter
  );

  const {
    data: sessiondata,
    isDayExceed,
    isLoading,
    isRegisterOpen,
  } = useGetRegisterData(counter_number as number);

  return (
    <div className="w-full p-5">
      <Card className="p-4 h-fit flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          {/* <CardHeader className="border-b w-full flex justify-between items-start flex-row">
            <h2 className="text-xl font-semibold">Register</h2>
          </CardHeader> */}
        </div>
        <div className="flex-1 overflow-y-auto">
          {isRegisterOpen ? <CloseRegister /> : <OpenRegister />}
        </div>
      </Card>
    </div>
  );
};

export default Register;
