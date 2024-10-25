import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { RootState } from "@/app/store";
import { Card } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetAllMemberQuery } from "@/services/memberAPi";
import { Check, ChevronDownIcon, ChevronsUpDown, Search } from "lucide-react";
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
import { roundToTwoDecimals } from "@/utils/helper";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorType, MemberTableDatatypes, sellForm, sellItem } from "@/app/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormProvider, useForm } from "react-hook-form";
import { useGetSalesTaxListQuery } from "@/services/salesTaxApi";
import { useGetIncomeCategorListQuery } from "@/services/incomeCategoryApi";
import { useGetOrgTaxTypeQuery } from "@/services/organizationApi";
import { useCreateTransactionMutation, useGetTransactionByIdQuery, useGetTransactionQuery, usePatchTransactionMutation } from "@/services/transactionApi";
import MemberForm from "../../members/memberForm/form";
import Checkout from "./checkout";
import ParkReceipt from "./park-receipt";
import { useGetStaffListQuery } from "@/services/staffsApi";
import { useGetlastRegisterSessionQuery } from "@/services/registerApi";
const { VITE_REGISTER_MAX_HOUR } = import.meta.env;

interface searchCriteriaType {
  search_key?: string;
}
const has24HoursPassed = (date: Date) => {
  const now = new Date();
  const differenceInMs = now.getTime() - date.getTime();
  const differenceInHours = differenceInMs / (1000 * 60 * 60);
  return differenceInHours >= VITE_REGISTER_MAX_HOUR;
}

const Sell = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  // register session info
  const { sessionId } = JSON.parse(localStorage.getItem("registerSession") as string) ?? { sessionId: null };
  // register continue today?
  const isContinue = JSON.parse(localStorage.getItem("isContinue") as string) || null
  console.log({ isContinue }, "isContinue")
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const counter_number = (localStorage.getItem("counter_number") as string) == "" ? null : Number((localStorage.getItem("counter_number") as string));

  const { data: lastSession, refetch: lastSessionRefetch, isFetching } = useGetlastRegisterSessionQuery(counter_number as number, { refetchOnMountOrArgChange: true })
  console.log({ lastSession }, "lastSession")


  // initial value before sale is parked or sold
  const initialValues: sellForm = {
    staff_id: userInfo?.user.id,
    counter_id: counter_number as number, //counter id
    staff_name: userInfo?.user.first_name,
    batch_id: sessionId, //register id
    discount_amt: undefined,
    member_id: null,
    member_name: null,
    member_email: null,
    member_address: null,
    member_gender: null,
    notes: "",
    receipt_number: "INV"+Math.floor(Math.random() * 99), //will implement with prefix module comes
    tax_number: Math.floor(Math.random() * 99), //from srb
    total: null,
    subtotal: null,
    tax_amt: null,
    status: "Unpaid",
    transaction_type: "Sale",
    membership_plans: [],
    events: [],
    products: [],
    payments: [],
    created_by: userInfo?.user.id as number
  }
  const form = useForm<sellForm>({
    mode: "all",
    defaultValues: initialValues,
  });
  const {
    watch,
    register,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();

  const [productPayload, setProductPayload] = useState<sellItem[]>([])
  const [showCheckout, setShowCheckout] = useState<boolean>(false)
  const [dayExceeded, setDayExceeded] = useState<boolean>(false)

  // search product
  const [searchCriteria, setSearchCriteria] = useState<searchCriteriaType>({});
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  // select customer
  const [customer, setCustomer] = useState<Record<string, any> | null>(null);
  const [openParkSale, setParkSale] = useState(false)
  const [openStaffDropdown, setStaffDropdown] = useState(false)
  const [action, setAction] = useState<"add" | "edit">("add")
  const [openMemberForm, setOpenMemberForm] = useState<boolean>(false)
  const [editMember, setEditMember] = useState<MemberTableDatatypes | null>(
    null
  );

  // listing apis
  const { data: staffList } = useGetStaffListQuery(orgId)
  const { data: orgTaxType } = useGetOrgTaxTypeQuery(orgId)
  const { data: incomeCatData } = useGetIncomeCategorListQuery(orgId);
  const { data: salesTaxData } = useGetSalesTaxListQuery(orgId);
  const { data: memberhsipList } = useGetMembershipsQuery({ org_id: orgId, query: query })
  const { data: memberList, refetch: memberRefetch } = useGetAllMemberQuery({ org_id: orgId, query: "sort_key=id&sort_order=desc" })
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = usePatchTransactionMutation()
  const [transactionId, setTransactionId] = useState<number | undefined>(undefined)
  const { data: retriveSaleData } = useGetTransactionByIdQuery(
    { transaction_id: transactionId as number, counter_id: watcher.counter_id },
    {
      skip: transactionId == undefined
    })

  // get unpaid sales to retrive sale
  const {
    data: transactionData,
    refetch: transactionRefetch,
  } = useGetTransactionQuery(
    { counter_id: counter_number as number, query: 'status=Unpaid&sort_order=desc' },
    {
      skip: counter_number == null,
    }
  );

  const transactiontableData = useMemo(() => {
    return Array.isArray(transactionData?.data) ? transactionData?.data : [];
  }, [transactionData]);

  const memberListData = useMemo(() => {
    return Array.isArray(memberList?.data) ? memberList?.data : [];
  }, [memberList]);

  const memberhsipListData = useMemo(() => {
    return Array.isArray(memberhsipList?.data) ? memberhsipList?.data : [];
  }, [memberhsipList]);

  // if navigating back to sell page, the checkout scren must reset
  useEffect(() => {
    if (!id) {
      reset(initialValues as sellForm)
      setCustomer(null)
      setProductPayload([])
      setShowCheckout(false)
    }
  }, [id])

  // for past 24 hour validation
  useEffect(() => {
    lastSessionRefetch()
    if (!isFetching && lastSession?.closing_time !== null) {
      toast({
        variant: "success",
        title: "No active register session found.",
      })
      navigate(`/admin/pos/register`)
      return;
    } else {
      const opening_time = new Date(lastSession?.opening_time as string)
      // 
      if (has24HoursPassed(opening_time) && !isContinue) {
        setDayExceeded(true)
      } else {
        setDayExceeded(false)
      }
    }

  }, [lastSession, lastSessionRefetch])

  // for search products
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

  // for filters to add in query params
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
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


  function handleOpenForm() {
    setAction("add");
    setEditMember(null);
    setOpenMemberForm(true);
  }

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
      tax_name: saleTax.name as string,
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

  const total = subtotal + tax;

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
      setValue("member_address", customer.address_1)
      setValue("member_gender", customer.gender)
    }

  }, [totalDiscount, customer, tax, subtotal, total]);

  const handleCloseDayExceeded = () => {
    setDayExceeded(false)
    navigate(`/admin/pos/register`)
  }

  const handleContinueDayExceeded = () => {
    localStorage.setItem("isContinue", "true")
    setDayExceeded(false)
  }

  const validateCheckout = () => {
    if (productPayload.length == 0) {
      toast({
        variant: "destructive",
        title: "Please add products to the register",
      })
      return false;
    }

    if (!customer) {
      toast({
        variant: "destructive",
        title: "Please select a customer",
      })
      return false;
    }

    return true
  }

  const paymentCheckout = () => {
    const validation = validateCheckout()
    validation && setShowCheckout(true);
  }


  const parkSale = async () => {

    try {
      if (!watcher.id && watcher.status === "Unpaid") {

        const resp = await createTransaction(watcher).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Sale parked successfully",
          })
          setProductPayload([])
          setCustomer(null)
          transactionRefetch()
        }
      } else if (watcher.id && watcher.status === "Unpaid") {
        const resp = await updateTransaction({ id: watcher.id, status: "Paid" }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Sale parked updated successfully",
          })
          setProductPayload([])
          setCustomer(null)
          transactionRefetch()
        }
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



  useEffect(() => {
    if (Number(id)) {
      setTransactionId(Number(id))
    }
  }, [id])

  useEffect(() => {
    if (retriveSaleData) {
      const payload = {
        ...retriveSaleData,
        staff_id: userInfo?.user.id,
        counter_id: counter_number as number, //counter id
        staff_name: userInfo?.user.first_name,
        batch_id: sessionId, //register id
      }

      if (Number(id) && payload.status === "Paid") {
        delete payload.id;
        payload.transaction_type = "Refund";
        payload.main_transaction_id = Number(id)
      }
      setCustomer(memberListData?.find(member => member.id == payload.member_id) as MemberTableDatatypes)
      setProductPayload(retriveSaleData.items as sellItem[])
      reset(payload)
    }
  }, [retriveSaleData])

  console.log({ watcher, productPayload, transactionId })

  return (
    <div>
      <FormProvider {...form} >
        <div className="p-5">

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
                            {category.products.map((product: Record<string, any>, i) => (
                              <button
                                key={i}
                                disabled={watcher.id ? true : false}
                                onClick={() => addProduct(product, category?.type)}
                                className={`relative group ${!watcher.id && "hover:bg-primary/20 hover:text-black/60 cursor-pointer"} size-28 text-sm  flex flex-col gap-2 bg-primary/30 justify-center items-center p-2 rounded-sm `}>
                                <span className="capitalize">{product.name}</span>
                                <span>Rs. {product.net_price}</span>

                                {!watcher.id && <span className="absolute invisible group-hover:visible  bottom-0   text-black/80 text-sm z-20 p-1">Add</span>}
                              </button>
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
                    <div className="item-center flex gap-3">
                      <RetriveSaleCombobox
                        label={"Retrive Sale"}
                        list={transactiontableData}
                        setCustomer={setCustomer}
                        customer={customer}
                        customerList={memberListData}
                        setTransactionId={setTransactionId}
                      />
                      <Button onClick={() => {
                        const validation = validateCheckout()
                        validation && setParkSale(true)
                      }} className="w-full justify-center items-center gap-2">
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
                      <Button onClick={handleOpenForm} className=" text-white justify-center items-center gap-2">
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
                              {product.discount > 0 && <p className="line-through text-sm text-gray-500 text-left">
                                Rs. {roundToTwoDecimals(product.price + product.discount)}
                              </p>}
                              <p className="text-sm">Rs. {product.price}</p>
                            </div>

                            <div className="inline-flex items-center ">
                              <button
                                disabled={Number(watcher.id) ? true : false}
                                onClick={() => updateProductQuantity(product.item_id, "decrement")}
                                className="disabled:cursor-not-allowed disabled:hover:bg-transparent bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                                <i className="fa fa-minus"></i>
                              </button>
                              <div
                                className=" border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-0 select-none">
                                {product.quantity}
                              </div>
                              <button
                                disabled={Number(watcher.id) ? true : false}
                                onClick={() => updateProductQuantity(product.item_id, "increment")}
                                className="disabled:cursor-not-allowed disabled:hover:bg-transparent bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                                <i className="fa fa-plus"></i>
                              </button>
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
                        <p>Rs. {watcher.subtotal}</p> {/* Display Subtotal */}
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
                        <p>Rs. {watcher.tax_amt}</p> {/* Display Tax */}
                      </div>
                      <div className="w-full flex gap-2 items-center justify-between font-bold">
                        <p>Total</p>
                        <p>Rs. {id && watcher.status == "Paid" && "-"} {watcher.total}</p> {/* Display Total */}
                      </div>
                      <Separator className="my-2" />
                      <div className="w-full flex gap-2 items-center justify-between font-bold">
                        <p>Sold By</p>
                        <div>
                          <Popover open={openStaffDropdown} onOpenChange={setStaffDropdown} >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="font-normal capitalize w-full hover:bg-transparent border-[1px] shadow-sm bg-white "
                                aria-expanded={openStaffDropdown}
                              >
                                <span className="w-full text-left font-normal">

                                  {watcher.created_by
                                    ? staffList?.find(
                                      (staff) =>
                                        staff.value == watcher.created_by
                                    )?.label
                                    : "Select Staff"}
                                </span>
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>

                            </PopoverTrigger>
                            <PopoverContent className="p-0 relative " side="bottom">
                              <Command className="w-full ">
                                <CommandList>
                                  <CommandInput placeholder="Select Staff" className="font-normal" />
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup className="">
                                    {staffList &&
                                      staffList.map((staff: any) => (
                                        <CommandItem
                                          value={staff.value}
                                          key={staff.value}
                                          className="font-normal"
                                          onSelect={() => {
                                            setValue(
                                              "created_by",
                                              Number(staff.value), // Set country_id to country.id as number
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                              staff.value == watcher.created_by
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {staff.label}
                                          {/* Display the country name */}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>


                      <Button className="w-full bg-primary text-black rounded-sm" onClick={paymentCheckout}>
                        Checkout
                      </Button>
                    </div>

                  </div>


                </div>

              </div>
            </Card>
          )}


          {showCheckout && (
            <Checkout
              initialValues={initialValues}
              setShowCheckout={setShowCheckout}
              productPayload={productPayload}
              setCustomer={setCustomer}
              setProductPayload={setProductPayload}
              customer={customer}
              watcher={watcher}
            />
          )}


          <DayExceeded isOpen={dayExceeded} onClose={handleCloseDayExceeded} onContinue={handleContinueDayExceeded} closeModal={() => setDayExceeded(false)} />
        </div>

        <ParkReceipt isOpen={openParkSale} onClose={() => setParkSale(false)} parkSale={parkSale} />
      </FormProvider>

      <MemberForm
        open={openMemberForm}
        setOpen={setOpenMemberForm}
        memberData={editMember}
        setMemberData={setEditMember}
        action={action}
        setAction={setAction}
        refetch={memberRefetch}
        breadcrumb="POS"
      />
    </div>

  );
};

export default Sell;

interface DayExceededProps {
  isOpen: boolean,
  onClose: any,
  onContinue: any,
  closeModal: any,
}

export function DayExceeded({
  isOpen,
  onClose,
  onContinue,
  closeModal
}: DayExceededProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register is Open more than 24 Hours</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Do you want to continue with this register session or close to create a new session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <AlertDialogCancel className="bg-primary text-black border-transparent hover:" onClick={onContinue}>Continue</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface customerComboboxTypes {
  list: any[];
  customerList?: MemberTableDatatypes[];
  setCustomer: any;
  setTransactionId?: any;
  customer: any;
  label?: string
}

export function CustomerCombobox({ list, setCustomer, customer, label }: customerComboboxTypes) {
  const modifiedList = list?.map((item: any) => ({ value: item.id, label: item.first_name + " " + item.last_name }))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  useEffect(() => {
    if (customer) {
      setValue(`${customer.id}`)
    } else {
      setValue('')
    }
  }, [customer])
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
            : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[330px] p-0">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList className="w-[328px] custom-scrollbar">
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

export function RetriveSaleCombobox({ list, setCustomer, customer, label, customerList, setTransactionId }: customerComboboxTypes) {
  const modifiedList = list?.map((item: any) => ({ transactionId: item.id, value: item.member_id, label: item.member_name }))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" capitalize w-full justify-center items-center gap-2  bg-white rounded-sm border-[1px]"
        >
          <i className="fa fa-share"></i>
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[240px] p-0" side="bottom">
        <Command>
          {/* <CommandInput placeholder={"Search customer"} /> */}
          <CommandList className="">
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup className="">
              {modifiedList?.map((modCustomer) => (
                <CommandItem
                  key={modCustomer.value + ""}
                  value={modCustomer.value + ""}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    const customer = customerList?.find((item: any) => item.id == currentValue)
                    setCustomer(customer)
                    setTransactionId(modCustomer.transactionId)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === modCustomer.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {modCustomer.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
