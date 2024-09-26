import { Card, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import OpenRegister from "./registerforms/OpenRegister";
import CloseRegister from "./registerforms/CloseRegister";
import { useState } from "react";
const Register = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full p-5">
      <Card className="p-4 h-[500px] flex flex-col ">
        <div className="flex items-center justify-between mb-4">
          <CardHeader className="border-b w-full flex justify-between items-start flex-row">
            <h2 className="text-xl font-semibold">Register</h2>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </CardHeader>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isOpen ? <OpenRegister /> : <CloseRegister />}
        </div>
      </Card>
    </div>
  );
};

export default Register;
