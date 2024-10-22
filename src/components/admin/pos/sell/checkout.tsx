
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roundToTwoDecimals } from "@/utils/helper";
import { ErrorType, sellForm } from "@/app/types";
import { toast } from "@/components/ui/use-toast";
import { useFormContext } from "react-hook-form";
import { useCreateTransactionMutation, useGetTransactionByIdQuery } from "@/services/transactionApi";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ReceiptExport } from "../sales_history/components/receipt-component";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { resetBackPageCount } from "@/features/counter/counterSlice";
import { useGetAllEnabledPaymentMethodsQuery } from "@/services/paymentMethodsApi";
import { useParams } from "react-router-dom";

interface paymentItem {
    payment_method_id: number;
    payment_method: string;
    amount: number;
}
export default function Checkout({ setShowCheckout, watcher, productPayload, customer, initialValues, setProductPayload, setCustomer }: any) {
    const { id } = useParams()
    const [invoiceId, setInvoiceId] = useState<number | null>(null)
    const [printInvoice, setPrintInvoice] = useState<boolean>(false)
    const { data: enabledPayments } = useGetAllEnabledPaymentMethodsQuery({})
    const [payments, setPayments] = useState<paymentItem[]>([])
    const [selectedMethods, setSelectedMethods] = useState<{ [key: string]: boolean }>({});
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

    const {
        control,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        register,
        trigger,
        watch,
        reset,
    } = useFormContext<sellForm>();

    const {
        data: transactionData,
        refetch: transactionRefetch,
    } = useGetTransactionByIdQuery(
        { transaction_id: invoiceId as number, counter_id: watcher.counter_id },
        {
            skip: invoiceId == null && !printInvoice,
        }
    );

    const handlePrintInvoice = async () => {
        setPrintInvoice(true)
        if (transactionData) {
            // Assuming currentData.response.orders[0] has all the necessary data
            const invoiceData = transactionData;
            const htmlContent = await ReceiptExport(invoiceData); // Get the HTML content

            // Create an invisible iframe
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";

            // Append the iframe to the body
            document.body.appendChild(iframe);

            // Write the HTML content to the iframe's document
            const iframeDoc =
                iframe.contentWindow?.document || iframe.contentDocument;
            if (iframeDoc) {
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();

                // Wait until the iframe content is fully loaded
                iframe.onload = () => {
                    // Trigger print
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();

                    // Remove the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                };
            }
        }
        setPrintInvoice(false)
    };



    useEffect(() => {
        // Initialize selectedMethods and amounts based on the available payment methods.
        if (enabledPayments) {
            const initialSelectedMethods: { [key: string]: boolean } = {};
            const initialAmounts: { [key: string]: string } = {};

            enabledPayments.forEach((method: any) => {
                initialSelectedMethods[method.code] = false;
                initialAmounts[method.code] = '';
            });

            setSelectedMethods(initialSelectedMethods);
            setAmounts(initialAmounts);
        }
    }, [enabledPayments]);

    const addPaymentMethod = (method_code: string, amount: string, id: number) => {
        const numAmount = parseFloat(amount)
        if (isNaN(numAmount)) return

        setPayments((prevPayments) => {
            const payload = [
                ...prevPayments,
                {
                    payment_method_id: id,
                    payment_method: method_code,
                    amount: numAmount,
                },
            ]
            setValue("payments", payload)
            return payload;
        })
    }


    const [createTransaction] = useCreateTransactionMutation()
    const placeOrder = async () => {
        if (watcher.payments.length == 0) {
            toast({
                variant: "destructive",
                title: "Please add at least one payment method and amount",
            })
            return;
        }

        if (watcher.payments.some((item: paymentItem) => item.amount == undefined)) {
            toast({
                variant: "destructive",
                title: "Please enter the amount",
            })
            return;
        }

        try {
            const payload = watcher
            payload.status = "Paid"
            const resp = await createTransaction(payload).unwrap();
            if (resp) {
                toast({
                    variant: "success",
                    title: "Transaction successful",
                })
                setInvoiceId(resp.id)
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

        setSelectedMethods((prev) => {
            const resetMethods = { ...prev };
            Object.keys(resetMethods).forEach(key => resetMethods[key] = false);
            return resetMethods;
        });
        setAmounts((prev) => {
            const resetAmounts = { ...prev };
            Object.keys(resetAmounts).forEach(key => resetAmounts[key] = '');
            return resetAmounts;
        });
    }


    const handleReset = () => {
        reset(initialValues as sellForm)
        setCustomer(null)
        setProductPayload([])
        setShowCheckout(false)
    }

    return (

        <div className=" ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                    <div className="bg-white  p-6 rounded-lg">
                        <div className="mb-4">
                            <p className="text-xl font-bold mb-4">Customer Information</p>
                            <p>Name: {watcher.member_name}</p>
                            <p className="text-sm text-gray-400">Email: {watcher.member_email}</p>
                            <p className="text-sm text-gray-400">Address: {watcher.member_address}</p>
                            <p></p>
                        </div>
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex flex-col justify-between items-start">
                                {productPayload.map((product: any) => (
                                    <>
                                        <div className=" flex  justify-between items-center gap-2  p-2 w-full">
                                            <div className="flex-1 ">
                                                <h3 className="text-lg font-medium capitalize">{product.description}</h3>
                                                <p className="text-gray-500 ">Quantity: {product.quantity}</p>
                                            </div>

                                            <div className="text-lg font-bold">Rs. {product.price}</div>

                                        </div >
                                    </>
                                ))}



                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <div>Subtotal</div>
                                <div className="font-bold">{roundToTwoDecimals(watcher.subtotal)}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Discount</div>
                                <div className="font-bold">{watcher.discount_amt > 0 ? "-" : ""} {roundToTwoDecimals(watcher.discount_amt)}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Tax</div>
                                <div className="font-bold">{roundToTwoDecimals(watcher.tax_amt)}</div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <div className="text-xl font-bold">Total</div>
                                <div className="text-xl font-bold">{id&&"- "}{roundToTwoDecimals(watcher.total)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold ">Payment</h2>
                        <div className="mt-5 h-full flex flex-col   justify-between gap-6">
                            <div className="space-y-4">
                                {enabledPayments?.map((method: any) => (
                                    <div
                                        key={method.id}
                                        className="bg-[#ebe9e9] flex items-center space-x-3 p-4 border rounded"
                                    >
                                        <Checkbox
                                            id={method.code}
                                            checked={selectedMethods[method.code]}
                                            onCheckedChange={(checked) =>
                                                setSelectedMethods((prev) => ({ ...prev, [method.code]: checked === true }))
                                            }
                                        />
                                        <Label htmlFor={method.code} className="w-1/2">
                                            {method.name}
                                        </Label>
                                        {selectedMethods[method.code] && (
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                value={amounts[method.code]}
                                                onChange={(e) =>
                                                    setAmounts((prev) => ({ ...prev, [method.code]: e.target.value }))
                                                }
                                                onBlur={() => addPaymentMethod(method.code, amounts[method.code], method.id)}
                                                className="w-1/2"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>


                            <div>
                                <FloatingLabelInput
                                    id="description"
                                    label="Notes"
                                    type="textarea"
                                    rows={7}
                                    className="custom-scrollbar col-span-2 peer-placeholder-shown:top-[10%]"
                                    {...register("notes", {
                                        maxLength: {
                                            value: 200,
                                            message: "Notes should not exceed 200 characters"
                                        }
                                    })}
                                    error={errors.notes?.message}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        {invoiceId == null ? (
                            <LoadingButton
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                onClick={placeOrder}>

                                {!isSubmitting && (
                                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                                )}
                                Complete Checkout
                            </LoadingButton>
                        ) : (
                            <div className="flex justify-end gap-3">
                                <Button variant={"ghost"} onClick={handleReset}>
                                    Back
                                </Button>

                                <Button onClick={handlePrintInvoice}>
                                    Print Invoice
                                </Button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
