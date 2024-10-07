import { RootState } from "@/app/store";
import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
import { useGetMembershipsQuery } from "@/services/membershipsApi";




const Sell = () => {
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_id
  );
  const counter_number = JSON.parse(localStorage.getItem("counter_number") as string);

  const [productList, setProductList] = useState<Record<string, any>[]>([])
  const { data: memberhsipList } = useGetMembershipsQuery({ org_id: orgId as number, query: "" })
  const memberhsipListData = useMemo(() => {
    return Array.isArray(memberhsipList?.data) ? memberhsipList?.data : [];
  }, [memberhsipList]);

  const productCategories = [
    {
      type: "memberships",
      label: "Memberships",
      products: memberhsipListData,
    },
    {
      type: "events",
      label: "Events",
      products: [],
    },
    {
      type: "products",
      label: "Products",
      products: [],
    },
  ]

  const { data: memberList } = useGetMembersListQuery(orgId as number)
  console.log({ memberList })
  return (
    <div className="w-full p-5 ">
      <Card className="px-3 py-4 max-w-[1100px] mx-auto">
        <p className="w-full">{counter_number && (<p className="p-2 font-bold">Selected counter: {counter_number}</p>)}</p>
        <div className="grid grid-cols-2 justify-start items-start gap-3">
          <div className="min-h-36  p-2">
            <FloatingLabelInput
              id="search"
              placeholder="Search by products name"
              // onChange={(event) => setInputValue(event.target.value)}
              className="w-full pl-8 text-gray-400 rounded-sm"
              icon={<Search className="size-4 text-gray-400 absolute  z-10 left-2" />}
            />

            <Tabs defaultValue="memberships" className="w-full mt-4 ">
              <TabsList variant="underline">
                {productCategories.map((category) => (
                  <TabsTrigger key={category.type} value={category.type} variant="underline">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {productCategories.map((category) => (
                <TabsContent className="m-0  w-full " key={category.type} value={category.type}>
                  {category.products.length > 0 ? (
                    <div className="mt-2 w-full flex  gap-10 justify-center items-center">
                      {category.products.map((product: Record<string, any>) => (
                        <div onClick={() => setProductList(prev => ([...prev, product]))} className="size-28 text-sm cursor-pointer flex flex-col gap-2 bg-primary/30 justify-center items-center p-2 rounded-sm ">
                          <span className="capitalize">{product.name}</span>
                          <span>Rs. {product.net_price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="col-span-2 text-sm text-center w-full p-2 mt-2">No products found</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="h-full flex flex-col justify-between space-y-2 rounded-sm bg-gray-100 p-2"  >
            <CustomerCombobox list={memberList} />

            <div className="rounded-sm bg-white/90 mx-1">

              {productList.map(product => (
                <div className=" flex justify-between items-center gap-2  p-2 ">
                  <div>
                    <span className="capitalize">{product.name}</span>
                  </div>
                  <span>Rs. {product.net_price}</span>

                </div>
              ))}
            </div>

            <div className="space-y-2 px-2">
              <div className="w-full flex gap-2 items-center justify-between">
                <p>Subtotal</p>
                <p>Rs. 0.0</p>
              </div>
              <div className="w-full flex gap-2 items-center justify-between">
                <p>Tax  </p>
                <p>Rs. 0.0</p>
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
          className="capitalize w-full justify-between bg-white rounded-sm border-[1px]"
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