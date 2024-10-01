import { RootState } from "@/app/store";
import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


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
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_id
  );
  const counter_number = JSON.parse(localStorage.getItem("counter_number") as string);

  const [selectedProductCategory, setProductCategory] = useState<string>('')

  const { data: memberList } = useGetMembersListQuery(orgId as number)
  console.log({ memberList })
  return (
    <div className="w-full p-5 ">
      <Card className="p-3 max-w-[1100px] mx-auto">
        <p className="w-full">{counter_number && (<p className="p-2 font-bold">Selected counter: {counter_number}</p>)}</p>
        <div className="grid grid-cols-2 justify-start items-center gap-3">
          <div className="min-h-36  p-2">


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

          <div className="h-full flex flex-col justify-between  rounded-sm bg-gray-100 p-2"  >
            <CustomerCombobox list={memberList} />



            <div className="space-y-2 px-2">
              <div className="w-full flex gap-2 items-center justify-between">
                <p>Subtotal</p>
                <p>PKR 0.0</p>
              </div>
              <div className="w-full flex gap-2 items-center justify-between">
                <p>Tax  </p>
                <p>PKR 0.0</p>
              </div>
              <Button className="w-full bg-primary text-black rounded-sm ">
                Pay
              </Button>

            </div>


          </div>


        </div>
      </Card>
    </div>
  );
};

export default Sell;





export function CustomerCombobox({ list }: { list: { value: number, label: string }[] | undefined }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  console.log({ value })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="capitalize w-full justify-between bg-white rounded-sm"
        >
          {value
            ? list?.find((customer: any) => customer.value == value)?.label
            : "Select customer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[500px] p-0">
        <Command>
          <CommandInput placeholder="Search customer..." />
          <CommandList className="w-[500px]">
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup className="">
              {list?.map((customer: any) => (
                <CommandItem
                  key={customer.value + ""}
                  value={customer.value + ""}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === customer.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customer.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}