import { SellForm } from "@/app/types";
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
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useFormContext } from "react-hook-form";


interface ParkReceiptProps {
    isOpen: boolean,
    onClose: any,
    parkSale: any,
}

export default function ParkReceipt({
    isOpen,
    onClose,
    parkSale
}: ParkReceiptProps) {
    const {
        control,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        register,
        trigger,
        watch,
        reset,
    } = useFormContext<SellForm>();


    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        <FloatingLabelInput
                            id="description"
                            label="Notes"
                            type="textarea"
                            rows={4}
                            className="custom-scrollbar col-span-2 peer-placeholder-shown:top-[10%]"
                            {...register("notes", {
                                maxLength: {
                                    value: 200,
                                    message: "Notes should not exceed 200 characters"
                                }
                            })}
                            error={errors.notes?.message}
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className=" bg-primary text-black border-transparent hover:bg-primary" onClick={parkSale}>Park Receipt</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}