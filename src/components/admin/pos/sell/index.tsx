import { RootState } from "@/app/store";
import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetAllMemberQuery } from "@/services/memberAPi";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { useGetMembershipsQuery } from "@/services/membershipsApi";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorType, sellForm, sellItem } from "@/app/types";
import { has24HoursPassed } from "@/constants/counter_register";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormProvider, useForm } from "react-hook-form";
import { useGetSalesTaxListQuery } from "@/services/salesTaxApi";
import { useGetIncomeCategorListQuery } from "@/services/incomeCategoryApi";
import { useGetOrgTaxTypeQuery } from "@/services/organizationApi";
import { useCreateTransactionMutation, useGetTransactionQuery } from "@/services/transactionApi";
import { v4 as uuidv4 } from "uuid";
import Checkout from "./checkout";
import DayExceeded from "./day-exceeded";
import { roundToTwoDecimals } from "@/utils/helper";
import { CustomerCombobox, RetriveSaleCombobox } from "./custom-combobox";
interface searchCriteriaType {
  search_key?: string;
}

const Sell = () => {
  const { time, isOpen, isContinue, continueDate, sessionId } = JSON.parse(localStorage.getItem("registerSession") as string) ?? { time: null, isOpen: false, isContinue: false, continueDate: null, sessionId: null };
  const { userInfo } = useSelector((state: RootState) => state.auth);
  console.log({ userInfo })
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const counter_number = (localStorage.getItem("counter_number") as string) == "" ? null : Number((localStorage.getItem("counter_number") as string));

  const initialValues: sellForm = {
    staff_id: userInfo?.user.id,
    counter_id: counter_number as number, //counter id
    staff_name: userInfo?.user.first_name,
    discount_amt: undefined,
    batch_id: sessionId, //register id
    member_id: null,
    member_name: null,
    member_email: null,
    member_address: null,
    member_gender: null,
    notes: "",
    receipt_number: "",
    tax_number: `${uuidv4()}`,
    total: null,
    subtotal: null,
    tax_amt: null,
    status: "Unpaid",
    transaction_type: "Sale",
    membership_plans: [],
    events: [],
    products: [],
    payments: [
      {
        payment_method_id: 1,
        payment_method: "Cash",
        amount: 1500,
      },
    ],
  }
  const { data: orgTaxType } = useGetOrgTaxTypeQuery(orgId)
  const [productPayload, setProductPayload] = useState<sellItem[]>([])
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [dayExceeded, setDayExceeded] = useState<boolean>(false)
  const navigate = useNavigate()
  const form = useForm<sellForm>({
    mode: "all",
    defaultValues: initialValues,
  });

  const {
    control,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();


  useEffect(() => {
    const now = new Date();
    const hasContinueDatePassed = continueDate
      ? new Date(continueDate).setHours(0, 0, 0, 0) !== now.setHours(0, 0, 0, 0)
      : false;

    if (!isOpen) {
      toast({
        variant: "success",
        title: "Please open register before selling.",
      })
      navigate(`/admin/pos/register`)
      return;
    }

    if (time && has24HoursPassed(Number(time))) {
    }

    if (isContinue && hasContinueDatePassed) {
      setDayExceeded(true)
    }



  }, [isOpen, time, isContinue, continueDate])

  // search product
  const [searchCriteria, setSearchCriteria] = useState<searchCriteriaType>({});
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  // get unpaid sales to retrive sale
  const {
    data: transactionData,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetTransactionQuery(
    { counter_id: counter_number as number, query: 'status=Unpaid&sort_order=desc' },
    {
      skip: counter_number == null,
    }
  );
  const transactiontableData = useMemo(() => {
    return Array.isArray(transactionData?.data) ? transactionData?.data : [];
  }, [transactionData]);


  // select customer
  const [customer, setCustomer] = useState<Record<string, any> | null>(null);


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

  const { data: incomeCatData } = useGetIncomeCategorListQuery(orgId);
  const { data: salesTaxData } = useGetSalesTaxListQuery(orgId);
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
    const discountPercentage = product.discount || 0;
    const discountAmount = Math.floor((product.net_price * discountPercentage) / 100 * 100) / 100;
    const finalPrice = Math.floor((product.net_price - discountAmount) * 100) / 100;

    const incomeCat = incomeCatData?.filter(
      (item) => item.id == product.income_category_id
    )[0];
    const saleTax = salesTaxData?.filter(
      (item) => item.id == incomeCat?.sale_tax_id
    )[0];
    const taxRate = saleTax.percentage || 0;
    let subTotal = 0, total = 0, taxAmount = 0;

    // Check tax_type and calculate accordingly
    if (orgTaxType?.tax_type === "inclusive") {

      taxAmount = Math.floor((finalPrice - (finalPrice / (1 + taxRate / 100))) * 100) / 100;
      subTotal = Math.floor((finalPrice - taxAmount) * 100) / 100;
      total = finalPrice;
    } else if (orgTaxType?.tax_type === "exclusive") {
      taxAmount = Math.floor(((finalPrice * taxRate) / 100) * 100) / 100;
      subTotal = finalPrice;
      total = Math.floor((finalPrice + taxAmount) * 100) / 100;
    }

    const newProductPayload = {
      item_id: product.id,
      item_type: type,
      description: product.name,
      quantity: 1,
      price: finalPrice,
      tax_rate: taxRate,
      discount: discountAmount,
      sub_total: subTotal,
      tax_type: orgTaxType?.tax_type as string,
      sale_tax: saleTax.name as string,
      total: total,
      tax_amount: taxAmount
    };

    setProductPayload((prevPayload) => {
      const existingProduct = prevPayload.find((prod) => prod.item_id === product.id);
      if (existingProduct) {
        return prevPayload.map((prod) =>
          prod.item_id === product.id
            ? {
              ...prod,
              quantity: prod.quantity + 1,
              price: Math.floor((prod.price + finalPrice) * 100) / 100,
              discount: Math.floor((prod.discount + discountAmount) * 100) / 100,
              sub_total: Math.floor((prod.sub_total + subTotal) * 100) / 100,
              total: Math.floor((prod.total + total) * 100) / 100,
              tax_amount: Math.floor((prod.tax_amount + taxAmount) * 100) / 100
            }
            : prod
        );
      }

      setValue("membership_plans", [...prevPayload, newProductPayload])
      return [...prevPayload, newProductPayload];
    });
  };


  const updateProductQuantity = (productId: number, action: 'increment' | 'decrement') => {
    setProductPayload((prevPayload) => {
      const newPayload = prevPayload
        .map((product) => {
          if (product.item_id === productId) {
            const discountPercentage = product.discount / product.price;
            const unitPrice = Math.floor((product.price / product.quantity) * 100) / 100;
            const unitDiscount = Math.floor((unitPrice * discountPercentage) * 100) / 100;
            let unitTaxAmount = 0, unitSubTotal = 0, unitTotal = 0;

            // Calculate tax, subtotal, and total based on tax_type
            if (orgTaxType?.tax_type === "inclusive") {
              // For inclusive tax, tax is part of the price
              unitTaxAmount = Math.floor((unitPrice - (unitPrice / (1 + product.tax_rate / 100))) * 100) / 100;
              unitSubTotal = Math.floor((unitPrice - unitTaxAmount) * 100) / 100;
              unitTotal = unitPrice;
            } else if (orgTaxType?.tax_type === "exclusive") {
              unitTaxAmount = Math.floor((unitPrice * (product.tax_rate / 100)) * 100) / 100;
              unitSubTotal = unitPrice;
              unitTotal = Math.floor((unitPrice + unitTaxAmount) * 100) / 100;
            }

            // Handle increment action
            if (action === 'increment') {
              const newQuantity = product.quantity + 1;
              return {
                ...product,
                quantity: newQuantity,
                price: Math.floor((product.price + unitPrice) * 100) / 100,
                discount: Math.floor((product.discount + unitDiscount) * 100) / 100,
                sub_total: Math.floor((product.sub_total + unitSubTotal) * 100) / 100,
                total: Math.floor((product.total + unitTotal) * 100) / 100,
                tax_amount: Math.floor((product.tax_amount + unitTaxAmount) * 100) / 100
              };
            }

            // Handle decrement action
            if (action === 'decrement') {
              const newQuantity = product.quantity - 1;
              if (newQuantity === 0) {
                return null;
              }

              return {
                ...product,
                quantity: newQuantity,
                price: Math.floor((product.price - unitPrice) * 100) / 100, // Update total price
                discount: Math.floor((product.discount - unitDiscount) * 100) / 100, // Update total discount
                sub_total: Math.floor((product.sub_total - unitSubTotal) * 100) / 100, // Update subtotal
                total: Math.floor((product.total - unitTotal) * 100) / 100, // Update total
                tax_amount: Math.floor((product.tax_amount - unitTaxAmount) * 100) / 100 // Update tax amount
              };
            }
          }
          return product;
        })
        .filter((product) => product !== null);
      // Remove products with quantity 0
      setValue("membership_plans", newPayload)
      return newPayload
    });
  };

  const { data: memberList } = useGetAllMemberQuery({ org_id: orgId, query: "sort_key=id&sort_order=desc" })

  const memberListData = useMemo(() => {
    return Array.isArray(memberList?.data) ? memberList?.data : [];
  }, [memberList]);

  const subtotal = productPayload.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const tax = productPayload.reduce(
    (acc, product) => acc + product.tax_amount,
    0
  );

  const totalDiscount = productPayload.reduce(
    (acc, product) => acc + product.discount * product.quantity,
    0
  );

  const total = subtotal - totalDiscount + tax;

  console.log({ totalDiscount, tax, subtotal, total })

  useEffect(() => {
    setValue("discount_amt", roundToTwoDecimals(totalDiscount))
    setValue("subtotal", roundToTwoDecimals(subtotal))
    setValue("tax_amt", roundToTwoDecimals(tax))
    setValue("total", roundToTwoDecimals(total))

    if (customer) {
      setValue("member_id", customer.id)
      setValue("member_name", customer.first_name + " " + customer.last_name)
      setValue("member_email", customer.email)
      setValue("member_address", customer.address_1 + ", " + customer.address_2)
      setValue("member_gender", customer.gender)
    }

  }, [totalDiscount, customer, tax, subtotal, total]);

  const handleCloseDayExceeded = () => {
    setDayExceeded(false)
    navigate(`/admin/pos/register`)
  }

  const handleContinueDayExceeded = () => {
    const registerData = JSON.parse(localStorage.getItem("registerSession") as string);
    registerData.isContinue = true;
    registerData.continueDate = new Date();
    console.log({ registerData })
    localStorage.setItem("registerSession", JSON.stringify(registerData))
    setDayExceeded(false)
  }


  const paymentCheckout = () => {
    if (productPayload.length == 0) {
      toast({
        variant: "destructive",
        title: "Please add products to the register",
      })
      return;
    }

    if (!customer) {
      toast({
        variant: "destructive",
        title: "Please select a customer",
      })
      return;
    }
    setShowCheckout(true);
  }
  const [createTransaction] = useCreateTransactionMutation();

  const parkSale = async () => {
    try {
      const resp = await createTransaction(watcher).unwrap();
      if (resp) {
        toast({
          variant: "success",
          title: "Sale parked successfully",
        })
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  }

  console.log({ watcher, productPayload, memberhsipListData, memberList, customer })
  return (
    <FormProvider {...form} >
      <div className="p-5">
        {!showCheckout && (
          <Card className=" h-fit px-3 py-4 max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1  slg:grid-cols-2 justify-start items-start gap-3">
              <div className="min-h-36  p-2">
                <FloatingLabelInput
                  id="search"
                  placeholder="Search"
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
                        <p className="col-span-2 text-sm text-center w-full p-2 mt-2">Coming soon</p>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="h-full flex flex-col justify-start space-y-2 rounded-sm bg-gray-100 p-2"  >
                <>
                  <div className="item-center flex gap-3">
                    <RetriveSaleCombobox
                      label={"Retrive Sale"}
                      list={transactiontableData}
                      setCustomer={setCustomer}
                      customer={customer}
                      customerList={memberListData}
                    />
                    <Button onClick={parkSale} className="w-full justify-center items-center gap-2">
                      <i className="fa-regular fa-clock"></i>
                      Park Sale
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-2">

                    <CustomerCombobox
                      label={"Search customer"}
                      list={memberListData}
                      setCustomer={setCustomer}
                      customer={customer}
                    />

                    <Button className=" text-white justify-center items-center gap-2">
                      <i className="fa-regular fa-plus"></i>
                      <span className="text-nowrap">Add Member</span>
                    </Button>

                  </div>
                  <div className="bg-white/90">

                    {productPayload.map(product => (
                      <>
                        <div className=" flex  justify-between items-center gap-2  p-2 ">
                          <div>
                            <p className="capitalize">{product.description}</p>
                            {product.discount > 0 && <p className="line-through text-sm text-gray-500">
                              Rs. {roundToTwoDecimals(product.price + product.discount)}
                            </p>}
                            <p className="text-sm">Rs. {product.price} ({product.tax_rate}% {orgTaxType?.tax_type == "inclusive" ? "INC" : "EXL"})</p>
                          </div>

                          <div className="inline-flex items-center ">
                            <div
                              onClick={() => updateProductQuantity(product.item_id, "decrement")}
                              className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                              <i className="fa fa-minus"></i>
                            </div>
                            <div
                              className=" border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-0 select-none">
                              {product.quantity}
                            </div>
                            <div
                              onClick={() => updateProductQuantity(product.item_id, "increment")}
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
                      <p>Rs. {watcher.subtotal}</p>
                    </div>
                    <div className="w-full flex gap-2 items-center justify-between">
                      <p>Discount</p>
                      <FloatingLabelInput
                        type="number"
                        id="discount_amt"
                        defaultValue={watcher.discount_amt}
                        placeholder="Enter discount amount"
                        className="text-right w-fit  text-gray-400 rounded-sm"
                        {...register("discount_amt", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="w-full flex gap-2 items-center justify-between">
                      <p>Tax</p>
                      <p>Rs. {watcher.tax_amt}</p>
                    </div>
                    <div className="w-full flex gap-2 items-center justify-between font-bold">
                      <p>Total</p>
                      <p>Rs. {watcher.total}</p>
                    </div>
                    <Button className="w-full bg-primary text-black rounded-sm" onClick={paymentCheckout}>
                      Pay
                    </Button>
                  </div>

                </div>


              </div>

            </div>
          </Card>
        )}

        {showCheckout && (
          <Checkout setShowCheckout={setShowCheckout} productPayload={productPayload} customer={customer} watcher={watcher} />
        )}

        <DayExceeded isOpen={dayExceeded} onClose={handleCloseDayExceeded} onContinue={handleContinueDayExceeded} closeModal={() => setDayExceeded(false)} />
      </div>

    </FormProvider>

  );
};

export default Sell;
