import { ErrorType } from "@/app/types";
import { CounterDataType } from "@/app/types/pos/counter";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCountersMutation } from "@/services/counterApi";
import { useEffect, useState } from "react";

interface AssignCounterForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  refetch?: any;
  setData?: any;
  data: CounterDataType | undefined;
}

const AssignCounter = ({
  isOpen,
  setOpen,
  refetch,
  data,
  setData,
}: AssignCounterForm) => {
  const { toast } = useToast();
  const [cashiers, setCashiers] = useState<any[]>([]);
  console.log({ data })
  useEffect(() => {
    if (data) {
      setCashiers(data.staff)
    }
  }, [data, setData])


  const [updateCounter] = useUpdateCountersMutation()
  const unassignCashier = async (id: number) => {
    const newCashierList = cashiers.filter((user) => user.id != id).map((user) =>user.id)
    const payload = { id: data?.id, name: data?.name, status: data?.status, staff_ids: newCashierList }

    try {
      const resp = await updateCounter(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Counter Updated Successfully",
        });
      }
      setOpen(false)
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail,
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
    <div>
      <Sheet
        open={isOpen}
        onOpenChange={setOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle >
              Assigned Cashiers for <span className="capitalize">{data?.name}</span>
            </SheetTitle>
            <SheetDescription>
              <Separator className=" h-[1px] font-thin rounded-full" />

              {/* <Form {...form}> */}
              <form
                // onSubmit={form.handleSubmit(onSubmit, onError)}
                className="flex flex-col py-4 gap-4"
                noValidate
              >
                <div className="flex flex-col justify-between items-center gap-2">
                  {cashiers.length > 0 ? cashiers?.map((item: any) => (
                    <div onClick={() => unassignCashier(item.id)} className="cursor-pointer flex items-center justify-between w-full p-2 border border-transparent hover:border-primary rounded-md">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="remove_cashier" className="capitalize">{item.name}</Label>
                        <span className="text-blue-400">{data?.staff_id==item.id&&"In Use"}</span>
                      </div>
                      <i className="fa fa-xmark"></i>
                    </div>
                  )) : (
                    <p>No Cashiers assigned</p>
                  )}
                </div>


              </form>
              {/* </Form> */}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};


export default AssignCounter