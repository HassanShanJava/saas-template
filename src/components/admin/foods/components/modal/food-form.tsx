import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
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
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { Description } from "@radix-ui/react-dialog";
import { CreateFoodTypes, ErrorType } from "@/app/types";

import uploadimg from "@/assets/upload.svg";
import { useCreateFoodsMutation, useUpdateFoodsMutation } from "@/services/foodsApi";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
interface FoodForm {
  isOpen: boolean;
  setOpen: any;
  action: string;
  refetch: any;
  data: CreateFoodTypes | undefined;
}

const basicInfo = [
  {
    type: "text",
    name: "name",
    label: "Name*",
    required: true,
  },
  {
    type: "text",
    name: "brand",
    label: "Brand",
    required: false,
  },
  {
    type: "select",
    label: "Category",
    name: "category",
    required: true,
    options: [
      { value: "baked_products", label: "Baked products" },
      { value: "beverages", label: "Beverages" },
      { value: "cheese_eggs", label: "Cheese Milk and Eggs Products" },
      { value: "cooked_meals", label: "Cooked meals" },
      { value: "fish_products", label: "Fish Products" },
      { value: "fruits_vegs", label: "Fruits and vegetables" },
      { value: "herbs_spices", label: "Herbs and Spices" },
      { value: "meat_products", label: "Meat Products" },
      { value: "nuts_seeds_snacks", label: "Nuts, seeds and snack" },
      { value: "pasta_cereals", label: "Pasta and breakfast Cereals" },
      { value: "restaurant_meals", label: "Restaurant meals" },
      { value: "soups_sauces", label: "Soups, sauces, fats and oil" },
      { value: "sweets_candy", label: "Sweets and candy" },
      { value: "other", label: "Other" },
    ],
  },
  {
    type: "text",
    label: "Description",
    name: "description",
    required: false,
  },
  {
    type: "text",
    label: "Other Name",
    name: "other_name",
    required: false,
  },
  {
    type: "select",
    name: "visible_for",
    label: "Visible For",
    required: false,
    options: [
      { value: "only_me", label: "Only me" },
      { value: "members", label: "Members in my gym" },
      { value: "coaches_and_staff", label: "Coaches and Staff in my gym" },
      { value: "everyone", label: "Everyone in my gym" },
    ],
  },
];


const nutrientsInfo = [
  {
    name: "total_nutrition",
    type: "number",
    label: "Total Nutrition (g)",
    required: true,
  },
  {
    name: "kcal",
    type: "number",
    label: "Kcal",
    required: true,
  },
  {
    name: "protein",
    type: "number",
    label: "Protein (g)",
    required: true,
  },
  {
    name: "fat",
    type: "number",
    label: "Total Fat (g)",
    required: true,
  },
  {
    name: "carbohydrates",
    type: "number",
    label: "Carbohydrates (g)",
    required: true,
  },
  {
    name: "carbs_sugar",
    type: "number",
    label: "Of which sugars (g)",
    required: false,
  },
  {
    name: "carbs_saturated",
    type: "number",
    label: "Of which saturated (g)",
    required: false,
  },
  {
    name: "kilojoules",
    type: "number",
    label: "Kilojoules (Kj)",
    required: false,
  },
  {
    name: "fiber",
    type: "number",
    label: "Fiber (g)",
    required: false,
  },
  {
    name: "calcium",
    type: "number",
    label: "Calcium (mg)",
    required: false,
  },
  {
    name: "iron",
    type: "number",
    label: "Iron (mg)",
    required: false,
  },
  {
    name: "magnesium",
    type: "number",
    label: "Magnesium (mg)",
    required: false,
  },
  {
    name: "phosphorus",
    type: "number",
    label: "Phosphorus (mg)",
    required: false,
  },
  {
    name: "potassium",
    type: "number",
    label: "Potassium (mg)",
    required: false,
  },
  {
    name: "sodium",
    type: "number",
    label: "Sodium (mg)",
    required: false,
  },
  {
    name: "zinc",
    type: "number",
    label: "Zinc (mg)",
    required: false,
  },
  {
    name: "copper",
    type: "number",
    label: "Copper (mg)",
    required: false,
  },
  {
    name: "selenium",
    type: "number",
    label: "Selenium (mg)",
    required: false,
  },
  {
    name: "vitamin_c",
    type: "number",
    label: "Vitamin C (mg)",
    required: false,
  },
  {
    name: "vitamin_b1",
    type: "number",
    label: "Vitamin B1 (mg)",
    required: false,
  },
  {
    name: "vitamin_b2",
    type: "number",
    label: "Vitamin B2 (mg)",
    required: false,
  },
  {
    name: "vitamin_b6",
    type: "number",
    label: "Vitamin B6 (mg)",
    required: false,
  },
  {
    name: "folic_acid",
    type: "number",
    label: "Folic Acid (mcg)",
    required: false,
  },
  {
    name: "vitamin_b12",
    type: "number",
    label: "Vitamin B12 (mcg)",
    required: false,
  },
  {
    name: "vitamin_a",
    type: "number",
    label: "Vitamin A (mcg)",
    required: false,
  },
  {
    name: "vitamin_e",
    type: "number",
    label: "Vitamin E (mg)",
    required: false,
  },
  {
    name: "vitamin_d",
    type: "number",
    label: "Vitamin D (mcg)",
    required: false,
  },
  {
    name: "fat_unsaturated",
    type: "number",
    label: "Fatty acid total unsaturated (g)",
    required: false,
  },
  {
    name: "cholesterol",
    type: "number",
    label: "Cholesterol (mg)",
    required: false,
  },
  {
    name: "alcohol",
    type: "number",
    label: "Alcohol (g)",
    required: false,
  },
  {
    name: "alchohol_mono",
    type: "number",
    label: "Of which mono unsaturated (g)",
    required: false,
  },
  {
    name: "alchohol_poly",
    type: "number",
    label: "Of which poly unsaturated (g)",
    required: false,
  },
  {
    name: "trans_fat",
    type: "number",
    label: "Trans fat (g)",
    required: false,
  },
  {
    name: "weight",
    type: "number",
    label: "Weight",
    required: false,
  },
  {
    name: "weight_unit",
    type: "text",
    label: "Weight Unit",
    required: false,
  },
];


const initialValue = {
  // basic
  name: "",
  brand: "",
  category: undefined,
  description: "",
  other_name: "",
  visible_for: undefined,
  // nutritions
  total_nutrition: undefined,
  kcal: undefined,
  protein: undefined,
  fat: undefined,
  carbohydrates: undefined,
  carbs_sugar: undefined,
  carbs_saturated: undefined,
  kilojoules: undefined,
  fiber: undefined,
  calcium: undefined,
  iron: undefined,
  magnesium: undefined,
  phosphorus: undefined,
  potassium: undefined,
  sodium: undefined,
  zinc: undefined,
  copper: undefined,
  selenium: undefined,
  vitamin_a: undefined,
  vitamin_b1: undefined,
  vitamin_b2: undefined,
  vitamin_b6: undefined,
  vitamin_b12: undefined,
  vitamin_c: undefined,
  vitamin_d: undefined,
  vitamin_e: undefined,
  folic_acid: undefined,
  fat_unsaturated: undefined,
  cholesterol: undefined,
  alcohol: undefined,
  alchohol_mono: undefined,
  alchohol_poly: undefined,
  trans_fat: undefined,
  weight: undefined,
  weight_unit: undefined,
}



const FoodForm = ({ isOpen, setOpen, action, data, refetch }: FoodForm) => {
  // console.log({action, data})
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();
  const [showMore, setShowMore] = useState(false);
  const [files, setFiles] = useState<File[] | null>([]);
  const [formData, setFormData] =useState(initialValue);


  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const filteredNutrients = showMore
    ? nutrientsInfo
    : nutrientsInfo.filter((item) => item.required);


  const form = useForm<CreateFoodTypes>({
    mode: "all",
    defaultValues: formData
  });

  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    setError,
    getValues,
    register,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const watcher = watch()
  console.log({action,watcher,data})

  useEffect(() => {
    if (action == 'add') {
      reset(initialValue)
      // setFormData(initialValue)
    } else {
      // setFormData(data)
      reset(data)
    }
  }, [action])

  const handleClose = () => {
    clearErrors()
    reset(initialValue)
    setFormData(initialValue)
    setShowMore(false)
    setOpen(false);
  };


  const [createFood] = useCreateFoodsMutation()
  const [updateFood] = useUpdateFoodsMutation()

  const onSubmit = async (data: CreateFoodTypes) => {
    const payload = {
      org_id: orgId,
      ...data
    }

    try {
      
      if (action == 'add') {
        const resp = await createFood(payload).unwrap()
        if (resp) {
          refetch();
          toast({
            variant: "success",
            title: "Created Successfully",
          });
          reset(initialValue, {
            keepIsSubmitted: false,
            keepSubmitCount: false,
          });
          setFormData(initialValue)
          handleClose();
        }

      } else if (action == "edit") {
        const resp = await updateFood({ ...payload, id: data?.id as number }).unwrap()
        if (resp) {
          refetch();
          toast({
            variant: "success",
            title: "Updated Successfully",
          });
        }
        reset(initialValue, {
          keepIsSubmitted: false,
          keepSubmitCount: false,
        });
        setFormData(initialValue)
        handleClose();
      }

      
    } catch (error: unknown) {
      console.error("Error", { error });
      
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }

      form.reset(initialValue);
      handleClose();
    }
  }
  
  console.log({ errors })
  return (
    <Sheet open={isOpen}>
      <SheetContent hideCloseButton className="!max-w-[1050px] py-0 custom-scrollbar h-screen">
        <SheetHeader className="sticky top-0 z-40 py-4 bg-white">
          <SheetTitle>
            <div className="flex justify-between gap-5 items-start  bg-white">
              <div>
                <p className="font-semibold">Food / Nutrition</p>
                <div className="text-sm">
                  <span className="text-gray-400 pr-1 font-semibold">
                    Dashboard
                  </span>{" "}
                  <span className="text-gray-400 font-semibold">/</span>
                  <span className="pl-1 text-primary font-semibold ">
                    Add food
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
                  className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                  onClick={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                  Save
                </LoadingButton>
              </div>
            </div>
          </SheetTitle>
          <Separator className=" h-[1px] rounded-full my-2" />

        </SheetHeader>

        <div className="pb-0">
          <h1 className="font-semibold text-xl py-3">Basic Information</h1>
          <div className="grid grid-cols-3 gap-3 p-1 ">
            {basicInfo.map((item) => {
              if (item.type === "text") {
                return (
                  <div key={item.name} className="relative">
                    <FloatingLabelInput
                      id={item.name}
                      label={item.label}
                      {...register(item.name as keyof CreateFoodTypes, { required: item.required && "Required" })}
                    />
                    {errors[item.name as keyof CreateFoodTypes]?.message && (
                      <p className="text-red-500 text-sm">{errors[item.name as keyof CreateFoodTypes]?.message}</p>
                    )}
                  </div>
                );
              }

              if (item.type === "select") {
                return (
                  <div key={item.name} className="relative">
                    <Controller
                      name={item.name as keyof CreateFoodTypes}
                      rules={{ required: "Required" }}
                      control={control}
                      render={({
                        field: { onChange, value, onBlur },
                        fieldState: { invalid, error },
                      }) => (
                        <div>
                          <Select
                            onValueChange={(value) => {
                              onChange(value);
                            }}
                            defaultValue={value as string | undefined}
                          >
                            <SelectTrigger floatingLabel={item.label} name={item.name}>
                              <SelectValue
                                placeholder={"Select " + item.label}
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {item.options?.map((st: any, index: number) => (
                                <SelectItem key={index} value={String(st.value)}>
                                  {st.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors[item.name as keyof CreateFoodTypes]?.message && (
                      <p className="text-red-500 text-sm">{errors[item.name as keyof CreateFoodTypes]?.message}</p>
                    )}
                  </div>
                );
              }
            })}
          </div>

          <div className="flex justify-between items-center my-4">
            <h1 className="font-semibold text-xl py-4">
              Nutrition Information
            </h1>

            <Button
              variant={"outline"}
              className="border-primary"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Hide" : "Show"} micro nutrients
            </Button>
          </div>
          <div className="py-2 px-1 grid grid-cols-3 gap-3 ">
            {filteredNutrients.map((item) => {
              if (item.type === "number") {
                return (
                  <div key={item.name} className="relative">
                    <FloatingLabelInput
                      type="number"
                      min={0}
                      step={0.01}
                      id={item.name}
                      label={item.label}
                      {...register(item.name as keyof CreateFoodTypes, { required: item.required && "Required" })}
                    />
                    {errors[item.name as keyof CreateFoodTypes]?.message && (
                      <p className="text-red-500 text-sm">{errors[item.name as keyof CreateFoodTypes]?.message}</p>
                    )}
                  </div>
                );
              }
            })}
          </div>

          <div>
            <h1 className="font-semibold text-xl py-4">Units</h1>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">

                <Controller
                  name="weight_unit"
                  rules={{ required: "Required" }}
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { invalid, error },
                  }) => (
                    <div>
                      <Select
                        onValueChange={(value) => {
                          onChange(value);
                        }}
                        defaultValue={value}
                      >
                        <SelectTrigger floatingLabel={"Weight Unit*"}>
                          <SelectValue placeholder={"Select weight unit"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"g"}>Gram</SelectItem>
                          <SelectItem value={"ml"}>ML</SelectItem>
                          <SelectItem value={"g_ml"}>Gram/ML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors?.weight_unit?.message && (
                  <p className="text-red-500 text-sm">{errors?.weight_unit?.message}</p>
                )}
              </div>

              <div className="relative">
                <FloatingLabelInput
                  id={'weight'}
                  label={"Weight"}
                  type='number'

                  min={0}
                  step={0.01}
                  {...register("weight", { required: "Required" })}
                />
                {errors?.weight?.message && (
                  <p className="text-red-500 text-sm">{errors?.weight_unit?.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

};

export default FoodForm;
