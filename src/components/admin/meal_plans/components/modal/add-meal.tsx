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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { planFor } from "@/constants/meal_plans";
import { Button } from "@/components/ui/button";
const { VITE_VIEW_S3_URL } = import.meta.env;

interface FoodForm {
  isOpen: boolean;
  setOpen: any;
  foodList: CreateFoodTypes[] | [];
  categories: Record<string, string>[];
  setInputValue?:any;
  setSearchCretiria?:any;
}

const FoodForm = ({ isOpen, setOpen, foodList, categories }: FoodForm) => {
  const [selectedFood, setSelectedFood] = useState<Record<string, any>>({});
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtered food list based on search input and selected category
  const filteredFoodList = useMemo(() => {
    return foodList.filter((food) => {
      const matchesCategory =
        selectedCategory === "all" || food.category === selectedCategory;
      const matchesSearch = food.name
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foodList, searchInput, selectedCategory]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        setOpen(false);
        setSelectedFood({});
      }}
    >
      <SheetContent className="custom-scrollbar p-0">
        <SheetHeader className="pt-4 bg-white p-4">
          <SheetTitle>Add food or drinks</SheetTitle>
          <Separator className=" h-[1px] rounded-full my-2" />
        </SheetHeader>
        <SheetDescription className="px-4 pb-4">
          {Object.entries(selectedFood).length == 0 && (
            <div>
              <div className="flex justify-between items-center gap-2">
                <Input
                  id="food_search"
                  placeholder="Search for food"
                  className="bg-gray-100 rounded-xl px-3 h-7 py-1 placeholder:text-xs text-xs "
                  onChange={(event) => setSearchInput(event.target.value)}
                  value={searchInput}
                />
                <Select
                  onValueChange={(value) => setSelectedCategory(value)}
                  defaultValue={"all"}
                >
                  <SelectTrigger
                    name={"category"}
                    className="h-7 w-fit rounded-xl px-3 text-xs bg-gray-100"
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem key={0} value={"all"}>
                      All
                    </SelectItem>
                    {categories?.map((st: any, index: number) => (
                      <SelectItem key={index} value={st.label}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 py-2">
                {filteredFoodList.length > 0 ? (
                  filteredFoodList.map((food) => (
                    <div
                      key={food.id}
                      className="flex justify-between items-center"
                    >
                      <div key={food.id} className="flex items-center gap-2">
                        <img
                          src={VITE_VIEW_S3_URL + "/" + food.img_url}
                          className="size-9 rounded-sm object-contain"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {food.name}
                          </p>
                          <p
                            className={`text-gray-500 text-xs space-x-1 items-center ${!food.is_validated && "hidden"}`}
                          >
                            <span>Validated</span>
                            <i className="fa fa-circle-check text-primary"></i>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFood(food)}
                        className=" flex items-center justify-center size-5 bg-gray-100 rounded-[50%] "
                      >
                        <i className="text-[10px] text-center fa fa-chevron-right  text-gray-800"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-xs my-4">
                    No food found
                  </p>
                )}
              </div>
            </div>
          )}

          {Object.entries(selectedFood).length > 0 && (
            <div className="flex flex-col gap-3">
              {/* image */}
              <div className="flex items-center gap-2">
                <img
                  src={VITE_VIEW_S3_URL + "/" + selectedFood.img_url}
                  className="size-9 rounded-sm object-contain"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedFood.name}
                  </p>
                  <p
                    className={`text-gray-500 text-xs space-x-1 items-center ${!selectedFood.is_validated && "hidden"}`}
                  >
                    <span>Validated</span>
                    <i className="fa fa-circle-check text-primary"></i>
                  </p>
                </div>
              </div>

              {/* planFor */}
              <Select
                onValueChange={(value) => setSelectedCategory(value)}
                defaultValue={undefined}
              >
                <SelectTrigger name={"plan_for"}>
                  <SelectValue placeholder="Select plan for" />
                </SelectTrigger>

                <SelectContent>
                  {planFor?.map((st: any, index: number) => (
                    <SelectItem key={index} value={st.label}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* quantity */}
              <Input placeholder="Quantity" type="number" id="quantity " />

              <Button className="text-black space-x-2">
                <i className="fa fa-plus"></i>
                <span>Add</span>
              </Button>
            </div>
          )}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default FoodForm;
