import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { visibleFor, mealTypes } from "@/constants/meal_plans";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import AddMeal from "./add-meal";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";

import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
interface MealPlanForm {
  isOpen: boolean;
  setOpen: any;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch?: any;
  setData?: any;
  data?: MealPlanDataType | undefined;
}

import { DropzoneOptions } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import uploadimg from "@/assets/upload.svg";
import { ErrorType } from "@/app/types";
import { CreateFoodTypes } from "@/app/types/foods";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetMembersListQuery } from "@/services/memberAPi";
import { useGetFoodsQuery } from "@/services/foodsApi";
import { useDebounce } from "@/hooks/use-debounce";
import { categories } from "@/constants/food";
import {
  useCreateMealPlansMutation,
  useUpdateMealPlansMutation,
} from "@/services/mealPlansApi";
import { deleteCognitoImage, UploadCognitoImage } from "@/utils/lib/s3Service";
import { MealPlanDataType } from "@/app/types/meal_plan";
const { VITE_VIEW_S3_URL } = import.meta.env;

const chartData = [
  { food_component: "protein", percentage: 0, fill: "#8BB738" },
  { food_component: "fats", percentage: 0, fill: "#E8A239" },
  { food_component: "carbs", percentage: 0, fill: "#DD4664" },
];

const calculatePercentages = (meals: {
  [key: string]: { protein: number; fat: number; carbs: number }[];
}) => {
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  Object.values(meals).forEach((mealArray) => {
    mealArray.forEach((meal) => {
      totalProtein += +meal.protein;
      totalFat += +meal.fat;
      totalCarbs += +meal.carbs;
    });
  });

  const total = totalProtein + totalFat + totalCarbs;

  return {
    protein: total ? Math.floor((totalProtein / total) * 100 * 10) / 10 : 0,
    fat: total ? Math.floor((totalFat / total) * 100 * 10) / 10 : 0,
    carbs: total ? Math.floor((totalCarbs / total) * 100 * 10) / 10 : 0,
  };
};

const initialValue = {
  name: "",
  protein: null,
  fats: null,
  carbs: null,
  visible_for: "",
  profile_img: null,
  description: "",
  member_id: [],
  meals: [],
};

interface searchCretiriaType {
  sort_order: string;
  sort_key?: string;
  search_key?: string;
  category?: string;
}

const initialMeal = {
  // changed according to enums
  breakfast: [],
  morning_snack: [],
  lunch: [],
  afternoon_snack: [],
  dinner: [],
  evening_snack: [],
};

const initialFoodValue = {
  sort_order: "desc",
  sort_key: "id",
};

const MealPlanForm = ({
  isOpen,
  setOpen,
  action,
  setAction,
  refetch,
  data,
  setData,
}: MealPlanForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();
  const [openFood, setOpenFood] = useState(false);
  const [pieChartData, setPieChart] = useState(chartData);
  const [files, setFiles] = useState<File[] | null>([]);
  const { data: membersData } = useGetMembersListQuery({ id: Number(orgId), query: "" });
  const [foodList, setFoodList] = useState<CreateFoodTypes[] | []>([]);
  const [searchCretiria, setSearchCretiria] =
    useState<searchCretiriaType>(initialFoodValue);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  // const [filterData, setFilter] = useState<Record<string, any>>({});
  const [addMeal, setMeal] = useState<Record<string, any>>({});
  const [foodAction, setFoodAction] = useState<"add" | "edit">("add");
  const [foodActionData, setFoodActionData] = useState<Record<string, any>>({});
  const [label, setLabel] = useState<string | undefined>(undefined);

  // search input
  useEffect(() => {
    setSearchCretiria((prev) => {
      const newCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
  }, [debouncedInputValue, setSearchCretiria]);

  // select category
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCretiria)) {
      if (value !== undefined && value !== null && value !== "all") {
        params.append(key, value);
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCretiria]);

  const { data: foodData } = useGetFoodsQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  useEffect(() => {
    if (foodData?.data) {
      setFoodList(foodData?.data);
    }
  }, [foodData]);

  const [createMealplan] = useCreateMealPlansMutation();
  const [updateMealplan] = useUpdateMealPlansMutation();

  // Optimized state update
  const updatePieChartData = (data: {
    protein: number;
    fats: number;
    carbs: number;
  }) => {
    setPieChart((prevData) =>
      prevData.map((item) => ({
        ...item,
        percentage:
          data[item.food_component as keyof typeof data] ?? item.percentage,
      }))
    );
  };

  const dropzone = {
    accept: {
      "image/": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    protein: {
      label: "Protein",
      color: "hsl(var(--chart-1))",
    },
    fats: {
      label: "Fats",
      color: "hsl(var(--chart-2))",
    },
    carbs: {
      label: "Carbs",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const form = useForm<MealPlanDataType>({
    mode: "all",
    defaultValues: initialValue,
  });

  const {
    control,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();

  useEffect(() => {
    const createMealsState = () => {
      // Initialize the state structure
      const mealsState: Record<string, any[]> = {
        breakfast: [],
        morning_snack: [],
        lunch: [],
        afternoon_snack: [],
        dinner: [],
        evening_snack: [],
      };

      if (data?.meals) {
        data.meals.forEach((meal) => {
          // Find food details from foodList using food_id
          const foodDetails = foodList.find((food) => food.id === meal.food_id);

          if (foodDetails) {
            // Create the meal object with details
            const mealWithDetails = {
              name: foodDetails.name,
              quantity: meal.quantity,
              calories: foodDetails.kcal,
              carbs: foodDetails.carbohydrates,
              protein: foodDetails.protein,
              fat: foodDetails.fat,
              food_id: meal.food_id,
            };

            // Add the meal to the corresponding meal time category
            mealsState[meal?.meal_time].push(mealWithDetails);
          }
        });
      }

      return mealsState;
    };

    if (action == "edit" && data) {
      const mealsState = createMealsState();
      setMeals(mealsState);
      reset(data as MealPlanDataType);
      updatePieChartData({
        protein: data.protein as number,
        fats: data.fats as number,
        carbs: data.carbs as number,
      });
    } else if (action == "add" && data == undefined) {
      console.log({ initialValue }, "add");
      reset(initialValue, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [action, data, reset]);

  const onSubmit = async (input: MealPlanDataType) => {
    const payload = { org_id: orgId, ...input };
    if (payload.meals?.length == 0) {
      toast({
        variant: "destructive",
        title: "Please add atleast one food in plan",
      });
      return;
    }
    if (files && files?.length > 0) {
      if (watcher.profile_img !== "" && watcher.profile_img) {
        await deleteCognitoImage(watcher.profile_img as string);
      }
      console.log(files[0], "food_image");
      const getUrl = await UploadCognitoImage(files[0]);
      payload.profile_img = getUrl.location;
    }

    try {
      if (action === "add") {
        await createMealplan(payload).unwrap();
        toast({
          variant: "success",
          title: "Meal plan created successfully",
        });
        refetch();
      } else if (action === "edit") {
        await updateMealplan({
          ...payload,
          id: data?.meal_plan_id as number,
        }).unwrap();
        toast({
          variant: "success",
          title: "Meal plan updated Successfully",
        });
        refetch();
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail || (typedError.data as { message?: string }).message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
    handleClose();
  };

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all mandatory fields",
    });
  };

  const handleClose = () => {
    clearErrors();
    setAction("add");
    setFoodAction("add");
    setFoodActionData({});
    setSearchCretiria(initialFoodValue);
    setInputValue("");
    setPieChart(chartData);
    setMeals(initialMeal);
    setOpen(false);
    setFiles([]);
    reset(initialValue);
  };

  const [meals, setMeals] = useState<Record<string, any[]>>(initialMeal);

  const handleAddFood = (
    mealType: {
      label: string;
      name: string;
      quantity: number;
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
      food_id?: number;
    },
    foodAction: "add" | "edit"
  ) => {
    const { label, food_id, quantity, calories, carbs, protein, fat } =
      mealType;

    setMeals((prevMeals) => {
      const mealList = prevMeals[label as string];
      const existingFoodIndex = mealList.findIndex(
        (food) => food.food_id === food_id
      );

      const updatedFoods = [...mealList];

      if (existingFoodIndex !== -1) {
        // Update the existing food item based on the action
        const existingFood = updatedFoods[existingFoodIndex];

        updatedFoods[existingFoodIndex] = {
          ...existingFood,
          quantity:
            foodAction === "add" ? existingFood.quantity + quantity : quantity,
          calories:
            foodAction === "add"
              ? Math.floor(((+existingFood.calories + +calories) * 100) / 100)
              : Math.floor((+calories * 100) / 100),
          carbs:
            foodAction === "add"
              ? Math.floor(((+existingFood.carbs + +carbs) * 100) / 100)
              : Math.floor((+carbs * 100) / 100),
          protein:
            foodAction === "add"
              ? Math.floor(((+existingFood.protein + +protein) * 100) / 100)
              : Math.floor((+protein * 100) / 100),
          fat:
            foodAction === "add"
              ? Math.floor(((+existingFood.fat + +fat) * 100) / 100)
              : Math.floor((+fat * 100) / 100),
        };
      } else {
        // Add new food item
        updatedFoods.push({
          name: mealType.name,
          quantity: mealType.quantity,
          calories: Math.floor((+calories * 100) / 100),
          carbs: Math.floor((+carbs * 100) / 100),
          protein: Math.floor((+protein * 100) / 100),
          fat: Math.floor((+fat * 100) / 100),
          food_id,
        });
      }

      const updatedMeals = {
        ...prevMeals,
        [label]: updatedFoods,
      };

      // Recalculate the percentages after the update
      const percentages = calculatePercentages(updatedMeals);

      // Update the pie chart data
      updatePieChartData({
        protein: percentages.protein as number,
        fats: percentages.fat as number,
        carbs: percentages.carbs as number,
      });

      // Update the watcher meals state as an array
      const currentMeals = getValues("meals") as {
        food_id: number;
        quantity: number;
        meal_time: string;
      }[];

      // Filter out the existing item with the same food_id for the current meal time
      const filteredMeals = currentMeals.filter(
        (meal) => !(meal.food_id === food_id && meal.meal_time === label)
      );

      // Add or update the new meal entry
      setValue("meals", [
        ...filteredMeals,
        {
          food_id: food_id as number,
          quantity: quantity,
          meal_time: label,
        },
      ]);

      // Update individual macronutrient values
      setValue("fats", percentages.fat);
      setValue("protein", percentages.protein);
      setValue("carbs", percentages.carbs);

      return updatedMeals;
    });
  };

  const handleEditFood = (data: any, mealType?: string) => {
    console.log("edit");
    setFoodAction("edit");
    if (foodData?.data) {
      const payload = {
        ...data,
        mealType,
      };
      setFoodActionData(payload);
    }
    setOpenFood(true);
  };

  const handleDeleteFood = (id: number, mealType?: string) => {
    const newMeals = watcher.meals;

    setMeals((prevMeals) => {
      // Update the meals state by removing the food item from the specified meal type
      const updatedMeals = {
        ...prevMeals,
        [mealType as string]: prevMeals[mealType as string].filter(
          (meal) => meal.food_id !== id
        ),
      };

      // Recalculate percentages after removing the food item
      const percentages = calculatePercentages(updatedMeals);

      // Update the pie chart data
      updatePieChartData({
        protein: percentages.protein as number,
        fats: percentages.fat as number,
        carbs: percentages.carbs as number,
      });

      return updatedMeals;
    });

    // Update the form's meals state as an array by removing the food item
    setValue(
      "meals",
      newMeals?.filter(
        (meal) => !(meal.food_id === id && meal.meal_time === mealType)
      )
    );
  };
  const renderTableRow = (mealType: string) => {
    if (meals[mealType].length === 0) {
      return (
        <tr>
          <td className="p-3 w-96">Please add food</td>
          <td className="p-3"></td>
          <td className="p-3"></td>
          <td className="p-3"></td>
          <td className="p-3"></td>
          <td className="p-3 w-10"></td>
        </tr>
      );
    }

    return meals[mealType].map((meal, index) => (
      <tr key={index}>
        <td className="p-3 w-96 capitalize">{meal.name}</td>
        <td className="p-3">{meal.quantity}</td>
        <td className="p-3">{meal.calories} kcal</td>
        <td className="p-3">{meal.carbs} g</td>
        <td className="p-3">{meal.protein} g</td>
        <td className="p-3">{meal.fat} g</td>
        <td className="p-3 flex items-center gap-2 justify-end ">
          <i
            className="fa fa-trash-can cursor-pointer"
            onClick={() => handleDeleteFood(meal.food_id, mealType)}
          ></i>
          <i
            className="fa fa-pencil cursor-pointer"
            onClick={() => handleEditFood(meal, mealType)}
          ></i>
        </td>
      </tr>
    ));
  };

  const handleOpen = (label: string) => {
    setLabel(label);
    setOpenFood(true);
  };

  console.log({ watcher, errors, meals }, action);
  return (
    <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
      <SheetContent
        className="!max-w-[1200px] py-0 custom-scrollbar h-screen sm:w-[90%] sm:max-w-2xl"
        hideCloseButton
      >
        <FormProvider {...form}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <SheetHeader className="sticky top-0 z-40 pt-4 bg-white">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-start ">
                  <div>
                    <p className="font-semibold">Meal Plan</p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                        {data ? "Edit" : "Create"} Meal Plan
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-[20px]">
                    <Button
                      type="button"
                      className="w-[100px] text-center flex items-center gap-2 border-primary"
                      variant={"outline"}
                      onClick={handleClose}
                    >
                      <i className="fa fa-xmark "></i>
                      Cancel
                    </Button>

                    <LoadingButton
                      type="submit"
                      className="w-[120px] bg-primary text-black text-center flex items-center gap-2"
                      onClick={handleSubmit(onSubmit, onError)}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      {data ? "Update" : "Save"}
                    </LoadingButton>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Separator className=" h-[1px] rounded-full my-2" />
            <div className="pb-4">
              <p className="font-semibold pb-4 pt-2">General Information</p>
              <div className="grid grid-cols-3 items-start gap-4 ">
                <div className="flex flex-col gap-2">
                  <FloatingLabelInput
                    id="male_name"
                    label="Name"
                    text="*"
                    className="capitalize"
                    {...register("name", {
                      required: "  Required",
                      setValueAs: (value) => value.toLowerCase(),
                      maxLength: {
                        value: 50,
                        message: "Name should not exceed 50 characters",
                      },
                    })}
                    error={errors.name?.message}
                  />

                  <Controller
                    name={"profile_img"}
                    // rules={{ required: files?.length == 0 && "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div className="">
                        <FileUploader
                          value={files}
                          onValueChange={setFiles}
                          dropzoneOptions={dropzone}
                        >
                          {files &&
                            files?.map((file, i) => (
                              <div className="h-[180px] ">
                                <FileUploaderContent className="flex items-center  justify-center  flex-row gap-2 bg-gray-100 ">
                                  <FileUploaderItem
                                    key={i}
                                    index={i}
                                    className="h-full  p-0 rounded-md overflow-hidden relative "
                                    aria-roledescription={`file ${i + 1} containing ${file.name}`}
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="object-contain max-h-[180px]"
                                    />
                                  </FileUploaderItem>
                                </FileUploaderContent>
                              </div>
                            ))}

                          <FileInput className="flex flex-col gap-2  ">
                            {files?.length == 0 && !watcher?.profile_img ? (
                              <div className="flex items-center justify-center h-[180px] w-full border bg-background rounded-md bg-gray-100">
                                <i className="text-gray-400 fa-regular fa-image text-2xl"></i>
                              </div>
                            ) : (
                              files?.length == 0 &&
                              watcher?.profile_img && (
                                <div className="flex items-center justify-center h-[180px] w-full border bg-background rounded-md bg-gray-100">
                                  {/* <i className="text-gray-400 fa-regular fa-image text-2xl"></i> */}
                                  <img
                                    src={
                                      watcher?.profile_img !== "" &&
                                      watcher?.profile_img
                                        ? watcher.profile_img?.includes(
                                            VITE_VIEW_S3_URL
                                          )
                                          ? watcher.profile_img
                                          : `${VITE_VIEW_S3_URL}/${watcher.profile_img}`
                                        : ""
                                    }
                                    loading="lazy"
                                    className="object-contain max-h-[180px] "
                                  />
                                </div>
                              )
                            )}

                            <div className="flex items-center  justify-start gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
                              <img src={uploadimg} className="size-10" />
                              <span className="text-sm">
                                {watcher.profile_img
                                  ? "Change Image"
                                  : "Upload Image"}
                              </span>
                            </div>
                          </FileInput>
                        </FileUploader>

                        {errors.profile_img?.message && files?.length == 0 && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.profile_img?.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Controller
                    name={"visible_for"}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div>
                        <Select
                          value={value}
                          onValueChange={(value) => onChange(value)}
                        >
                          <SelectTrigger floatingLabel="Visible for" text="*">
                            <SelectValue placeholder="Select visiblity for" />
                          </SelectTrigger>
                          <SelectContent>
                            {visibleFor.map((visiblity, index) => (
                              <SelectItem key={index} value={visiblity.label}>
                                {visiblity.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {errors.visible_for?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.visible_for?.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  <FloatingLabelInput
                    id="description"
                    label="Description"
                    type="textarea"
                    className=" custom-scrollbar "
                    rows={11}
                    {...register("description", {
                      maxLength: {
                        value: 350,
                        message: "Description should not exceed 350 characters",
                      },
                    })}
                    error={errors.description?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Controller
                    name={"member_id" as keyof MealPlanDataType}
                    // rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div>
                        <MultiSelect
                          floatingLabel={"Assign to"}
                          options={
                            membersData as {
                              value: number;
                              label: string;
                            }[]
                          }
                          defaultValue={watch("member_id") || []} // Ensure defaultValue is always an array
                          onValueChange={(selectedValues) => {
                            onChange(selectedValues); // Pass selected values to state handler
                          }}
                          placeholder={"Select members"}
                          variant="inverted"
                          maxCount={1}
                          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 placeholder:font-normal "
                        />

                        {errors.member_id?.message && (
                          <span className="text-red-500 text-xs mt-[5px]">
                            {errors.member_id?.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* pie chart */}
                  <Card className="flex flex-col bg-gray-50 ">
                    <CardHeader className="items-center px-0 py-3 text-center">
                      <CardTitle className="font-semibold">
                        Calorie & Micro Nutrient Breakdown{" "}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0 px-1 ">
                      <ChartContainer
                        config={chartConfig}
                        className={`mx-auto aspect-square !max-h-[172px]  !p-0 `}
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={pieChartData}
                            dataKey="percentage"
                            nameKey="food_component"
                          />
                        </PieChart>
                      </ChartContainer>

                      <div className="flex  items-center justify-center space-x-1">
                        {pieChartData.map((item) => (
                          <div className="flex items-center gap-1 font-semibold pb-2 w-fit">
                            <span
                              style={{ backgroundColor: item.fill }}
                              className={" rounded-[50%] size-1.5"}
                            ></span>
                            <span className="capitalize text-xs">
                              {item.food_component +
                                " (" +
                                item.percentage +
                                "%)"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="py-6 ">
              <p className="font-semibold">Nutrients/Food Information</p>
            </div>

            <div className="h-full ">
              {mealTypes.map((meal) => (
                <table
                  key={meal.key}
                  className="w-full text-left mb-4 table-fixed table"
                >
                  {/* controls column widths */}
                  <col width={40} />
                  <col width={20} />
                  <col width={20} />
                  <col width={20} />
                  <col width={20} />
                  <col width={20} />
                  <col width={8} />
                  <thead>
                    <tr className="bg-gray-50  capitalize">
                      <th className="p-3 font-semibold">{meal.label}</th>
                      <th className="p-3 font-semibold">Quantity</th>
                      <th className="p-3 font-semibold">Calories</th>
                      <th className="p-3 font-semibold">Carbs</th>
                      <th className="p-3 font-semibold">Protein</th>
                      <th className="p-3 font-semibold">Fat</th>
                      <th className="p-3 font-semibold flex justify-end ">
                        <i
                          className="text-primary fa fa-plus  cursor-pointer"
                          onClick={() => handleOpen(meal.key)}
                        ></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRow(meal.key)}</tbody>
                </table>
              ))}
            </div>

            <AddMeal
              isOpen={openFood}
              setOpen={setOpenFood}
              foodList={foodList}
              categories={categories}
              setFoodAction={setFoodAction}
              handleAddFood={handleAddFood}
              action={foodAction}
              data={foodActionData}
              label={label}
              setLabel={setLabel}
            />
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MealPlanForm;
