
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roundToTwoDecimals } from "@/utils/helper";
import { ErrorType, sellForm } from "@/app/types";
import { toast } from "@/components/ui/use-toast";
import { useFormContext } from "react-hook-form";
import { useCreateTransactionMutation } from "@/services/transactionApi";

export default function Checkout({ setShowCheckout, watcher, productPayload, customer }: any) {
    const {
        control,
        formState: { errors },
        setValue,
        getValues,
        register,
        trigger,
        watch,
    } = useFormContext<sellForm>();
    const [createTransaction] = useCreateTransactionMutation()
    const placeOrder = async () => {
        // setShowCheckout(false)
        setValue('status', "Paid")
        try {
            const resp = await createTransaction(watcher).unwrap();
            if (resp) {
                toast({
                    variant: "success",
                    title: "Transaction successful",
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
                                <div className="text-xl font-bold">{roundToTwoDecimals(watcher.total)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>

                        <h2 className="text-2xl font-bold ">Payment</h2>

                        <div className="mt-5 h-full flex flex-col   justify-between gap-6">
                            <div>
                                <RadioGroup defaultValue="cash" className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 p-2 w-full cursor-pointer border border-primary rounded-sm">
                                        <RadioGroupItem value="cash" id="cash" />
                                        <Label htmlFor="cash" className="flex items-center p-2 w-full cursor-pointer">
                                            <span>Cash</span>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4 p-2 w-full cursor-pointer border border-primary rounded-sm">
                                        <RadioGroupItem value="credit_debit" id="credit_debit" />
                                        <Label htmlFor="credit_debit" className="flex items-center p-2 w-full cursor-pointer">
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
                        <Button size="lg" onClick={placeOrder}>Place Order</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
