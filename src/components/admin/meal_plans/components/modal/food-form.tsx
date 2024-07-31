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
          <SheetTitle>Food</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          </div>
        </div>
        
      </SheetContent>
    </Sheet>
  )
}





export default FoodForm