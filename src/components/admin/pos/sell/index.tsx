import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { RootState } from "@/app/store";
import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetAllMemberQuery, useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { FileInput } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roundToTwoDecimals } from "@/utils/helper";
import { useDebounce } from "@/hooks/use-debounce";
import { MemberTableDatatypes } from "@/app/types";
import { has24HoursPassed, useGetRegisterData } from "@/constants/counter_register";
import { useNavigate } from "react-router-dom";

interface payload {
  discount: number;
  quantity: number;
  price: number;
  name: string;
  type: string;
  id: number;
}


interface searchCriteriaType {
  search_key?: string;
}





const Sell = () => {
  const { opening_time, isOpen } = JSON.parse(localStorage.getItem("registerSession") as string);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const counter_number = (localStorage.getItem("counter_number") as string) == "" ? null : Number((localStorage.getItem("counter_number") as string));

  const [productPayload, setProductPayload] = useState<payload[]>([])
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [dayExceeded, setDayExceeded] = useState<boolean>(false)
  const navigate = useNavigate()



  useEffect(() => {
    if (has24HoursPassed(opening_time)) {
      console.log({ opening_time }, has24HoursPassed(opening_time))
      setDayExceeded(true)
    }

    if (!isOpen) {
      navigate(`/admin/pos/register`)
    }
  }, [isOpen, opening_time])

  // search product
  const [searchCriteria, setSearchCriteria] = useState<searchCriteriaType>({});
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  // select customer
  const [customer, setCustomer] = useState<Record<string, any>>({});


  useEffect(() => {
    setSearchCriteria((prev) => {
      const newCriteria = { ...prev };
      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCriteria]);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val); // Append each array element as a separate query parameter
          });
        } else {
          params.append(key, value); // For non-array values
        }
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCriteria]);

  const { data: memberhsipList } = useGetMembershipsQuery({ org_id: orgId, query: query })


  const memberhsipListData = useMemo(() => {
    return Array.isArray(memberhsipList?.data) ? memberhsipList?.data : [];
  }, [memberhsipList]);


  // product lists by category
  const productCategories = [
    {
      type: "membership_plans",
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



  const addProduct = (product: any, type: string) => {

    // Calculate the discount amount
    const discountPercentage = product.discount || 0; // Percentage discount from the product
    const discountAmount = Math.floor((product.net_price * discountPercentage) / 100 * 100) / 100; // Calculate and round discount to 2 decimal places
    const finalPrice = Math.floor((product.net_price - discountAmount) * 100) / 100; // Final price after discount, rounded to 2 decimal places

    const newProductPayload = {
      id: product.id, // assuming `id` exists in your product data
      name: product.name, // replace with actual name if available
      type: type, // map the product's type
      quantity: 1, // default quantity
      price: finalPrice, // price after discount (rounded)
      discount: discountAmount, // how much discount is applied in terms of value (rounded)
    };

    setProductPayload((prevPayload) => {
      const existingProduct = prevPayload.find((prod) => prod.id === product.id);

      if (existingProduct) {
        // If product with the same id exists, update quantity, price, and discount
        return prevPayload.map((prod) =>
          prod.id === product.id
            ? {
              ...prod,
              quantity: prod.quantity + 1, // Increment quantity
              price: Math.floor((prod.price + finalPrice) * 100) / 100, // Add the price of the new addition after discount (rounded)
              discount: Math.floor((prod.discount + discountAmount) * 100) / 100, // Add the applied discount amount (rounded)
            }
            : prod
        );
      }

      // If product is new, add it to the payload
      return [...prevPayload, newProductPayload];
    });
  };

  const updateProduct = (product: any, qty: number) => {
    console.log({ product });
  };


  

  const { data: memberList2 } = useGetAllMemberQuery({ org_id: orgId, query: "" })
  const { data: memberList } = useGetMembersListQuery(orgId)

  const memberListData = useMemo(() => {
    return Array.isArray(memberList2?.data) ? memberList2?.data : [];
  }, [memberList2]);





  const subtotal = productPayload.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const totalDiscount = productPayload.reduce(
    (acc, product) => acc + product.discount * product.quantity,
    0
  );

  const taxRate = 0.10; // 10% tax rate (adjust as needed)
  const tax = subtotal * taxRate;
  const total = subtotal - totalDiscount + tax;

  console.log({ productPayload, memberhsipListData, memberList2, customer })

  const handleCloseDayExceeded = () => {
    setDayExceeded(false)
    navigate(`/admin/pos/register`)
  }

  return (
    <div className="w-full p-5 ">

      {!showCheckout && (
        <Card className=" h-fit px-3 py-4 max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1  slg:grid-cols-2 justify-start items-start gap-3">
            <div className="min-h-36  p-2">
              <FloatingLabelInput
                id="search"
                placeholder="Search by products name"
                onChange={(event) => setInputValue(event.target.value)}
                className="w-full pl-8 text-gray-400 rounded-sm"
                icon={<Search className="size-4 text-gray-400 absolute  z-10 left-2" />}
              />

              <Tabs defaultValue="membership_plans" className="w-full mt-4 ">
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
                      <div className="mt-4 w-full flex flex-wrap gap-4 justify-center items-center">
                        {category.products.map((product: Record<string, any>) => (
                          <div onClick={() => addProduct(product, category?.type)} className="relative group hover:bg-primary/20 hover:text-black/60 size-28 text-sm cursor-pointer flex flex-col gap-2 bg-primary/30 justify-center items-center p-2 rounded-sm ">
                            <span className="capitalize">{product.name}</span>
                            <span>Rs. {product.net_price}</span>

                            <span className="absolute invisible group-hover:visible  bottom-0   text-black/80 text-sm z-20 p-1">Add</span>
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

            <div className="h-full flex flex-col justify-start space-y-2 rounded-sm bg-gray-100 p-2"  >
              <>
                <CustomerCombobox list={memberListData} setCustomer={setCustomer} customer={customer} />
                <div className="bg-white/90">

                  {productPayload.map(product => (
                    <>
                      <div className=" flex  justify-between items-center gap-2  p-2 ">
                        <div>
                          <p className="capitalize">{product.name}</p>
                          {product.discount > 0 && <p className="line-through text-sm text-gray-500 text-right">
                            Rs. {product.price + product.discount}
                          </p>}
                          <p className="text-sm">Rs. {product.price}</p>
                        </div>

                        <div className="inline-flex items-center ">
                          <div
                            className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                            <i className="fa fa-minus"></i>
                          </div>
                          <div
                            className=" border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-0 select-none">
                            {product.quantity}
                          </div>
                          <div
                            className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                            <i className="fa fa-plus"></i>
                          </div>
                        </div>


                      </div >
                      <Separator className=" h-[1px] font-thin rounded-full" />
                    </>
                  ))}
                </div>
              </>

              <div className="rounded-sm bg-white/90 mx-1">

                <div className="space-y-2 px-2 bg-gray-100 pt-2 ">
                  <div className="w-full flex gap-2  items-center justify-between">
                    <p>Subtotal</p>
                    <p>Rs. {roundToTwoDecimals(subtotal)}</p> {/* Display Subtotal */}
                  </div>
                  <div className="w-full flex gap-2 items-center justify-between">
                    <p>Discount</p>
                    <p>Rs. {roundToTwoDecimals(totalDiscount)} </p> {/* Display Discount */}
                  </div>
                  <div className="w-full flex gap-2 items-center justify-between">
                    <p>Tax</p>
                    <p>Rs. {roundToTwoDecimals(tax)}</p> {/* Display Tax */}
                  </div>
                  <div className="w-full flex gap-2 items-center justify-between font-bold">
                    <p>Total</p>
                    <p>Rs. {roundToTwoDecimals(total)}</p> {/* Display Total */}
                  </div>
                  <Button className="w-full bg-primary text-black rounded-sm" onClick={() => setShowCheckout(true)}>
                    Pay
                  </Button>
                </div>

              </div>


            </div>

          </div>
        </Card>
      )}


      {showCheckout && (
        <Checkout setShowCheckout={setShowCheckout} />
      )}


      <DayExceeded isOpen={dayExceeded} onClose={handleCloseDayExceeded} onContinue={() => setDayExceeded(false)} />

    </div>

  );
};

export default Sell;



interface customerComboboxTypes {
  list: MemberTableDatatypes[];
  setCustomer: any;
  customer: any;
}

export function CustomerCombobox({ list, setCustomer, customer }: customerComboboxTypes) {
  const modifiedList = list?.map((item: any) => ({ value: item.id, label: item.first_name + " " + item.last_name }))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

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
            ? modifiedList?.find((customer: any) => customer.value == value)?.label
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
              {modifiedList?.map((customer: any) => (
                <CommandItem
                  key={customer.value + ""}
                  value={customer.value + ""}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    const customer = list?.find((item: any) => item.id == currentValue)
                    setCustomer(customer)
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


function Checkout({ setShowCheckout }: any) {
  return (
    <div className=" ">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white  p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">


                <div className="flex-1 ">
                  <h3 className="text-lg font-medium">Product Name</h3>
                  <p className="text-gray-500 ">Quantity: 2</p>
                </div>
                <div className="text-lg font-bold">99.99</div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>Subtotal</div>
                <div className="font-bold">99.99</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Discount</div>
                <div className="font-bold">9.99</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Tax</div>
                <div className="font-bold">10.00</div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Total</div>
                <div className="text-xl font-bold">119.98</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>

            <h2 className="text-2xl font-bold ">Payment</h2>

            <div className="mt-5 h-full flex flex-col  justify-between gap-6">
              <div>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-4 mt-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center space-x-2">
                      <span>Cash</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2">
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <FloatingLabelInput
                  id="description"
                  label="Notes"
                  type="textarea"
                  rows={7}
                  className="custom-scrollbar col-span-2 peer-placeholder-shown:top-[10%]"
                />
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={() => setShowCheckout(false)}>Place Order</Button>
          </div>
        </div>
      </div>
    </div>
  )
}



interface DayExceededProps {
  isOpen: boolean,
  onClose: any,
  onContinue: any,
}

export function DayExceeded({
  isOpen,
  onClose,
  onContinue,
}: DayExceededProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register is Open more than 24 Hours</AlertDialogTitle>
          <AlertDialogDescription className="bg-yellow-100 p-4 rounded text-yellow-800 text-sm">
            Do you want to continue with this register session or close to create a new session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <AlertDialogCancel onClick={onContinue}>Continue</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
