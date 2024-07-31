import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FoodForm from "./food-form";
import { useState } from "react";

interface MealPlanForm {
  isOpen: boolean;
  setOpen: any;
}

const MealPlanForm = ({ isOpen, setOpen }: MealPlanForm) => {
  const [openFood, setOpenFood] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
      <SheetContent className="!max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Meal</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
          <div className="grid grid-cols-4 items-center gap-4"></div>

          <button onClick={()=>setOpenFood(true)}>Open Food</button>
        </div>

        <FoodForm isOpen={openFood} setOpen={setOpenFood} />
      </SheetContent>
    </Sheet>
  );
};

export default MealPlanForm;
