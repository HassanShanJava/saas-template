import { counterDataType } from "@/app/types";
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
import { useEffect, useState } from "react";

interface AssignCounterForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  refetch?: any;
  setData?: any;
  data: counterDataType | undefined;
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

  useEffect(() => {
    if (data) {
      setCashiers(data.assigned_cashier)
    }
  }, [data, setData])


  const unassignCashier = (id: number) => {
    const newCashierList = cashiers.filter((user) => user.id != id)
    setCashiers(newCashierList)
  }

  return (
    <div>
      <Sheet
        open={isOpen}
        onOpenChange={setOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Assigned Cashiers for {data?.name}
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
                      <Label htmlFor="remove_cashier" className="capitalize">{item.name}</Label>
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