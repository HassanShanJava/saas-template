import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { Search } from "lucide-react";
import { useState } from "react";

const productCategories = [
  {
    type: "memberships",
    label: "Memberships",
  },
  {
    type: "events",
    label: "Events",
  },
  {
    type: "products",
    label: "Products",
  },
]

const Sell = () => {
  const counter_number = JSON.parse(localStorage.getItem("counter_number") as string);

  const [selectedProductCategory, setProductCategory] = useState<string>('')



  return (
    <div className="w-full p-5 ">
      <Card className="p-3 max-w-[1100px] mx-auto">
        <p className="w-full">{counter_number && (<p className="p-2 font-bold">Selected counter: {counter_number}</p>)}</p>
        <div className="grid grid-cols-2 justify-start items-center gap-3">
          <div className="min-h-36  ">


            <FloatingLabelInput
              id="search"
              placeholder="Search by products name"
              // onChange={(event) => setInputValue(event.target.value)}
              className="w-full pl-8 text-gray-400 rounded-sm"
              icon={<Search className="size-4 text-gray-400 absolute  z-10 left-2" />}
            />



            <div className="mt-4 flex gap-2">
              {productCategories?.map((category, i: number) => (
                <div key={i} onClick={() => setProductCategory(category.type)} className="cursor-pointer bg-gray-200 rounded-sm w-44 h-28 flex justify-center     items-center">
                  <p className="text-nowrap capitalize ">{category.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-36"  >
            <FloatingLabelInput
              id="search"
              placeholder="Search by products name"
              // onChange={(event) => setInputValue(event.target.value)}
              className="w-full pl-8 text-gray-400 rounded-sm"
              icon={<Search className="size-4 text-gray-400 absolute  z-10 left-2" />}
            />




          </div>


        </div>
      </Card>
    </div>
  );
};

export default Sell;
