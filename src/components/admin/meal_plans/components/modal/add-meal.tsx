import { CreateFoodTypes } from "@/app/types";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const { VITE_VIEW_S3_URL } = import.meta.env;

interface FoodForm {
  isOpen: boolean;
  setOpen: any;
  foodList: CreateFoodTypes[] | [];
  setInputValue: any;
  categories: Record<string, string>[]
}

const FoodForm = ({ isOpen, setOpen, foodList, setInputValue, categories }: FoodForm) => {
  return (
    <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>

      <SheetContent className="custom-scrollbar">
        <SheetHeader>
          <SheetTitle>Add food or drinks</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <Separator className=" h-[1px] rounded-full my-2" />
        <div>
          <Input id='food_search'
            placeholder="Search for food"
            onChange={(event) => setInputValue(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 ">
          {foodList.map(food => (
            <div key={food.id} className="flex items-center gap-2">
              <img src={VITE_VIEW_S3_URL + "/" + food.img_url} className="size-9 rounded-sm object-contain" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{food.name}</p>
                <p className={`text-gray-500 text-xs space-x-1 items-center ${!food.is_validated && "hidden"}`}>
                  <span>Validated</span>
                  <i className="fa fa-circle-check text-primary"></i>
                </p>
              </div>
            </div>
          ))}

        </div>


      </SheetContent>
    </Sheet>
  )
}





export default FoodForm