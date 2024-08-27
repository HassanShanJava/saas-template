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
import { useState, useMemo, useEffect } from "react";
import { planFor } from "@/constants/meal_plans";
import { Button } from "@/components/ui/button";
const { VITE_VIEW_S3_URL } = import.meta.env;

interface FoodForm {
  isOpen: boolean;
  setOpen: any;
  foodList: CreateFoodTypes[] | [];
  categories: Record<string, string>[];
  setInputValue?: any;
  handleAddFood?: any;
  setSearchCretiria?: any;
  action?: "add" | "edit";
  setFoodAction?: any;
  data?: any;
}

const FoodForm = ({
  isOpen,
  setOpen,
  foodList,
  categories,
  handleAddFood,
  action,
  data,
  setFoodAction
}: FoodForm) => {
  const [selectedFood, setSelectedFood] = useState<Record<string, any>>({});
  const [searchInput, setSearchInput] = useState<string>("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectPlan, setSelectPlan] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (action == "edit") {
      setSelectPlan(data.mealType);
      setQuantity(data.amount);
      setSelectedFood(foodList.filter((food) => food.id == data.food_id)[0]);
    }
  }, [action]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setQuantity(+value);
  };

  console.log(
    { action, data, selectedFood },
    foodList.filter((food) => food.id == data.food_id)[0]
  );

  const handleAddMeal = () => {
    if (quantity !== null) {
      const mealType = {
        label: selectPlan,
        name: selectedFood.name,
        amount: quantity,
        calories: ((+quantity as number) * selectedFood.kcal).toFixed(2),
        carbs: ((+quantity as number) * selectedFood.carbohydrates).toFixed(2),
        protein: ((+quantity as number) * selectedFood.fat).toFixed(2),
        fat: ((+quantity as number) * selectedFood.protein).toFixed(2),
        food_id: selectedFood.id,
      };

      handleAddFood(mealType, action);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory("all");
    setSelectPlan(undefined);
    setFoodAction("add");
    setQuantity(null);
    setSelectedFood({});
    setOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
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
                      onClick={() => setSelectedFood(food)}
                      className="flex justify-between items-center border border-transparent rounded-sm hover:border-primary px-2 py-1 hover:cursor-pointer"
                    >
                      <div key={food.id} className="flex items-center gap-2">
                        <img
                          src={VITE_VIEW_S3_URL + "/" + food.img_url}
                          className="size-9 rounded-sm object-contain"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 capitalize">
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
                      <button className=" flex items-center justify-center size-5 bg-gray-100 rounded-[50%] ">
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
                onValueChange={(value) => setSelectPlan(value)}
                defaultValue={selectPlan}
              >
                <SelectTrigger name={"plan_for"}>
                  <SelectValue placeholder="Select plan for" />
                </SelectTrigger>

                <SelectContent>
                  {planFor?.map((st: any, index: number) => (
                    <SelectItem key={index} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* quantity */}
              <Input
                placeholder="Quantity"
                defaultValue={quantity as number}
                type="number"
                id="quantity"
                onChange={handleChange}
              />

              <Button className="text-black space-x-2" onClick={handleAddMeal}>
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
