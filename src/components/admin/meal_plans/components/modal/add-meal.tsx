import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

interface FoodForm{
    isOpen:boolean;
    setOpen:any
}

const FoodForm = ({isOpen, setOpen}:FoodForm) => {
  return (
    <Sheet open={isOpen} onOpenChange={()=>setOpen(false)}>

      <SheetContent >
        <SheetHeader>
          <SheetTitle>Add food or drinks</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <Separator className=" h-[1px] rounded-full my-2" />

        
        
      </SheetContent>
    </Sheet>
  )
}





export default FoodForm