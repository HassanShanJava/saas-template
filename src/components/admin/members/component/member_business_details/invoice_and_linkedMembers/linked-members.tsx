import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Transaction } from "@/app/types/pos/transactions";

interface LinkedMembersProps {
  isOpen: boolean;
  setOpen: any;
  selectTransaction: Transaction | undefined;
}

const LinkedMembers = ({
  isOpen,
  setOpen,
  selectTransaction
}: LinkedMembersProps) => {
  console.log({selectTransaction})

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent hideCloseButton className="w-full !max-w-[540px] flex flex-col custom-scrollbar p-0 bg-[#F8F9FA]">
        <SheetHeader className="  p-4 bg-white flex flex-row gap-1 items-center justify-between  sticky top-0 border border-b-1 ">
          <div className="flex gap-2">

            <Button onClick={handleClose} className="border-transparent hover:bg-transparent p-0 pr-2 m-0 bg-transparent">
              <X className="text-black" />
            </Button>
            <div>
              <SheetTitle className="py-0 text-nowrap">Linked Members and Seats</SheetTitle>
              <p className="m-0 py-0 text-sm">Total seat: 12</p>
            </div>
          </div>
          <div className="flex gap-2">

            {/* <Button variant={"ghost"}  className="w-[100px] border border-primary">
            Import
          </Button> */}
            <Button className="w-[100px]">
              Add
            </Button>
          </div>
        </SheetHeader>
        <SheetDescription className="px-4 pb-4 ">

        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default LinkedMembers;
