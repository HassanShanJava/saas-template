import { Card } from "@/components/ui/card";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

const Sell = () => {
  const [counterSelected, setCounter] = useState<number | undefined>(undefined)
  return (
    <div className="w-full p-5">
      <Card className="p-3">
        <p>Select counter</p>
        <div className="grid grid-cols-3 gap-3">

          {[1, 2, 3, 4, 5, 6].map((item: any, i: number) => (
            <div key={i} onClick={()=>setCounter(item)} className="cursor-pointer w-full h-32 flex justify-center items-center rouned-md bg-outletcolor">
              <p className="text-center text-lg ">Counter {item}</p>
            </div>
          ))}
        </div>
        {counterSelected && (<p className="p-2 font-bold">Selected counter: {counterSelected}</p>)}
      </Card>
    </div>
  );
};  

export default Sell;
