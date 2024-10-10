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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { FileInput } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roundToTwoDecimals } from "@/utils/helper";

interface payload {
  discount: number;
  quantity: number;
  price: number;
  name: string;
  type: string;
  id: number;
}



const Sell = () => {
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_id
  );
  const counter_number = (localStorage.getItem("counter_number") as string) == "" ? null : Number((localStorage.getItem("counter_number") as string));

  const [productPayload, setProductPayload] = useState<payload[]>([])
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const { data: memberhsipList } = useGetMembershipsQuery({ org_id: orgId as number, query: "" })
  const memberhsipListData = useMemo(() => {
    return Array.isArray(memberhsipList?.data) ? memberhsipList?.data : [];
  }, [memberhsipList]);
  console.log({ productPayload })
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



  const addProduct = (product: any, type: string) => {
    console.log({ product });

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


  const calculateDiscount = (existingDiscount: number, newDiscount: number): number => {
    return existingDiscount + newDiscount;
  };

  const { data: memberList } = useGetMembersListQuery(orgId as number)
  console.log({ memberList })




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

  return (
    <>
      <div className="w-full p-5 ">

        {!showCheckout && <Card className=" h-[90vh] px-3 py-4 max-w-[1100px] mx-auto">
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
                          <div onClick={() => addProduct(product, category?.type)} className="size-28 text-sm cursor-pointer flex flex-col gap-2 bg-primary/30 justify-center items-center p-2 rounded-sm ">
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

                {productPayload.map(product => (
                  <>
                    <div className=" flex justify-between items-center gap-2  p-2 ">
                      <div>
                        <p className="capitalize">{product.name}</p>
                        <p>Qty. {product.quantity}</p>
                      </div>
                      <div>
                        <p>Rs. {product.price}</p>
                        <p>Rs. {product.discount}</p>
                      </div>
                    </div>
                    <Separator className=" h-[1px] font-thin rounded-full" />
                  </>
                ))}
              </div>

              <div className="space-y-2 px-2">
                <div className="w-full flex gap-2 items-center justify-between">
                  <p>Subtotal</p>
                  <p>Rs. {roundToTwoDecimals(subtotal)}</p> {/* Display Subtotal */}
                </div>
                <div className="w-full flex gap-2 items-center justify-between">
                  <p>Discount</p>
                  <p>Rs. {roundToTwoDecimals(totalDiscount)}</p> {/* Display Discount */}
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
        </Card>}
      </div>
      <div >
        {showCheckout && (
          <Checkout setShowCheckout={setShowCheckout} />
        )}


      </div>
    </>
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


function Checkout({ setShowCheckout }: any) {
  return (
    <div className="px-3 py-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white  p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <i
                    className="fa fa-image rounded-md"
                    style={{ aspectRatio: "80/80", objectFit: "cover" }}
                  />
                </div>
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-medium">Product Name</h3>
                  <p className="text-gray-500 ">Quantity: 2</p>
                </div>
                <div className="text-lg font-bold">$99.99</div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>Subtotal</div>
                <div className="font-bold">$99.99</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Shipping</div>
                <div className="font-bold">$9.99</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Tax</div>
                <div className="font-bold">$10.00</div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Total</div>
                <div className="text-xl font-bold">$119.98</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Billing &amp; Shipping</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="New York" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="NY" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" type="number" placeholder="10001" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" />
              </div>
            </div>
          </form>
        </div>
      </div>


      <div className="bg-gray-50  py-12 px-6 md:px-12 lg:px-24 mt-6">
        <h2 className="text-2xl font-bold ">Payment</h2>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <RadioGroup defaultValue="card">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-2">
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center space-x-2">
                  <span>PayPal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <form className="space-y-6">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" type="text" placeholder="4111 1111 1111 1111" />
              </div>

            </form>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={() => setShowCheckout(false)}>Place Order</Button>
        </div>
      </div>
    </div>
  )
}