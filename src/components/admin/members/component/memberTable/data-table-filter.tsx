import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface membersfiltertypes {
  isOpen: boolean;
  setOpen: any;
}

const MemberFilters = ({ isOpen, setOpen }: membersfiltertypes) => {
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Separator className=" h-[1px] rounded-full my-2" />
          <div>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MemberFilters;
