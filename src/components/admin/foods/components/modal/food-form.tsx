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
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { Description } from "@radix-ui/react-dialog";
import { CreateFoodTypes } from "@/app/types";

interface FoodForm {
  isOpen: boolean;
  setOpen: any;
  action: string
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
      { value: "cheese_milk_and_eggs_product", label: "Cheese milk and eggs product" },
      { value: "cooked_meals", label: "Cooked meals" },
      { value: "fruits_and_vegetables", label: "Fruits and vegetables" },
      { value: "herbs_and_spices", label: "Herbs and Spices" },
      { value: "meatproducts", label: "Meatproducts" },
      { value: "nuts_seeds_and_snack", label: "Nuts, seeds and snack" },
      { value: "pasta_and_breakfast_cereals", label: "Pasta and breakfast Cereals" },
      { value: "soups_sauces_fats_and_oil", label: "Soups, sauces, fats and oil" },
      { value: "sweets_and_candy", label: "Sweets and candy" },
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
      { value: "only_myself", label: "Only myself" },
      { value: "coaches_of_my_gym", label: "Coaches of my gym" },
      { value: "members_of_my_gym", label: "Members of my gym" },
      { value: "everyone_of_my_gym", label: "Everyone in my gym" },
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


const defaultValue = {
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



const FoodForm = ({ isOpen, setOpen, action }: FoodForm) => {
  const [showMore, setShowMore] = useState(false);
  const [files, setFiles] = useState<File[] | null>([]);

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
    defaultValues: defaultValue,
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


  const handleClose = () => {
    clearErrors()
    setOpen(false);
  };


  const onSubmit = async (payload: CreateFoodTypes) => {
    console.log({ payload })
  }
  // return (
  //   <Sheet open={isOpen}>
  //     <SheetContent hideCloseButton className="!max-w-[1050px]">
  //       <SheetHeader>
  //         <SheetTitle>
  //           <div className="flex justify-between gap-5 items-start ">
  //             <div>
  //               <p className="font-semibold">Food / Nutrition</p>
  //               <div className="text-sm">
  //                 <span className="text-gray-400 pr-1 font-semibold">
  //                   Dashboard
  //                 </span>{" "}
  //                 <span className="text-gray-400 font-semibold">/</span>
  //                 <span className="pl-1 text-primary font-semibold ">
  //                   Add food
  //                 </span>
  //               </div>
  //             </div>

  //             <div className="flex justify-center space-x-[20px]">
  //               <Button
  //                 type="button"
  //                 className="w-[100px] text-center flex items-center gap-2 border-primary"
  //                 variant={"outline"}
  //                 onClick={handleClose}
  //               >
  //                 <i className="fa fa-xmark "></i>
  //                 Cancel
  //               </Button>

  //               <LoadingButton
  //                 type="submit"
  //                 className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
  //                 onClick={handleSubmit(onSubmit)}
  //                 loading={isSubmitting}
  //                 disabled={isSubmitting}
  //               >
  //                 {/* {!isSubmitting && ( */}
  //                 <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
  //                 {/* )} */}
  //                 Save
  //               </LoadingButton>
  //             </div>
  //           </div>
  //         </SheetTitle>
  //       </SheetHeader>
  //       <Separator className=" h-[1px] rounded-full my-2" />

  //       <div>
  //         <h1 className="font-semibold text-xl py-3">Basic Information</h1>
  //         <div className="grid grid-cols-3 gap-3 p-1 ">
  //           {basicInfo.map((item) => {
  //             if (item.type == "text") {
  //               return (
  //                 <FloatingLabelInput
  //                   id={item.name}
  //                   name={item.name}
  //                   label={item.label}
  //                 />
  //               );
  //             }

  //             if (item.type == "select") {
  //               return (
  //                 <Select name={item.name}>
  //                   <SelectTrigger
  //                     floatingLabel={item.label + (item.required ? "*" : "")}
  //                   >
  //                     <SelectValue
  //                       placeholder={"Select " + item.label.toLowerCase()}
  //                     />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     {item.options?.map((st: any, index: number) => (
  //                       <SelectItem key={index} value={String(st.value)}>
  //                         {st.label}
  //                       </SelectItem>
  //                     ))}
  //                   </SelectContent>
  //                 </Select>
  //               );
  //             }

  //           })}
  //           {/* <FileUploader
  //             value={files}
  //             onValueChange={setFiles}
  //             dropzoneOptions={dropzone}
  //           >
  //             <FileInput className="flex flex-col gap-2">
  //               <div className="flex items-center justify-center h-[5rem] w-full border bg-background rounded-md bg-gray-100">
  //                 <i className="text-gray-400 fa-regular fa-image size-5"></i>
  //               </div>

  //               <div className="flex items-center justify-start gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
  //                 <img src="/src/assets/upload.svg" className="size-10" />
  //                 <span className="text-sm">Upload Image</span>
  //               </div>
  //             </FileInput>
  //             <FileUploaderContent className="flex items-center flex-row gap-2">
  //               {files?.map((file, i) => (
  //                 <FileUploaderItem
  //                   key={i}
  //                   index={i}
  //                   className="size-20 p-0 rounded-md overflow-hidden"
  //                   aria-roledescription={`file ${i + 1} containing ${file.name}`}
  //                 >
  //                   <img
  //                     src={URL.createObjectURL(file)}
  //                     alt={file.name}
  //                     height={80}
  //                     width={80}
  //                     className="size-20 p-0"
  //                   />
  //                 </FileUploaderItem>
  //               ))}
  //             </FileUploaderContent>
  //           </FileUploader> */}
  //         </div>

  //         <div className="flex justify-between items-center my-4">
  //           <h1 className="font-semibold text-xl py-4">
  //             Nutrition Information
  //           </h1>

  //           <Button
  //             variant={"outline"}
  //             className="border-primary"
  //             onClick={() => setShowMore(!showMore)}
  //           >
  //             {showMore ? "Hide" : "Show"} micro nutrients
  //           </Button>
  //         </div>
  //         <div className="py-2 px-1    grid grid-cols-3 gap-3 h-full max-h-[400px] custom-scrollbar ">
  //           {filteredNutrients.map((item) => {
  //             if (item.type == "number") {
  //               return (
  //                 <FloatingLabelInput
  //                   type="number"
  //                   onInput={(e) => {
  //                     const target = e.target as HTMLInputElement;
  //                     target.value = target.value.replace(/[^0-9.]/g, '');
  //                   }}
  //                   min={0}
  //                   step={0.01}
  //                   id={item.name}
  //                   name={item.name}
  //                   label={item.label}
  //                 />
  //               );
  //             }
  //           })}
  //         </div>

  //         <div>
  //           <h1 className="font-semibold text-xl py-4">Units</h1>
  //           <div className="grid grid-cols-3 gap-3">
  //             <Select name={"weight"}>
  //               <SelectTrigger floatingLabel={"Weight*"}>
  //                 <SelectValue placeholder={"Select weight"} />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value={"gram"}>Gram</SelectItem>
  //                 <SelectItem value={"ml"}>ML</SelectItem>
  //                 <SelectItem value={"gram-ml"}>Gram/ML</SelectItem>
  //               </SelectContent>
  //             </Select>

  //             <FloatingLabelInput
  //               id={'units'}
  //               name={"units"}
  //               label={"Provide Units"}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </SheetContent>
  //   </Sheet>
  // );

  console.log({ errors })
  return (
    <Sheet open={isOpen}>
      <SheetContent hideCloseButton className="!max-w-[1050px]">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between gap-5 items-start ">
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
        </SheetHeader>
        <Separator className=" h-[1px] rounded-full my-2" />

        <div>
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
                            defaultValue={value+""}
                          >
                            <SelectTrigger name={item.name}>
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
          <div className="py-2 px-1 grid grid-cols-3 gap-3 h-full max-h-[400px] custom-scrollbar">
            {filteredNutrients.map((item) => {
              if (item.type === "number") {
                return (
                  <div key={item.name} className="relative">
                    <FloatingLabelInput
                      type="number"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9.]/g, '');
                      }}
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
                  name="weight"
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
                        <SelectTrigger floatingLabel={"Weight*"}>
                          <SelectValue placeholder={"Select weight"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"gram"}>Gram</SelectItem>
                          <SelectItem value={"ml"}>ML</SelectItem>
                          <SelectItem value={"gram-ml"}>Gram/ML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors?.weight?.message && (
                  <p className="text-red-500 text-sm">{errors?.weight?.message}</p>
                )}
              </div>

              <div className="relative">
                <FloatingLabelInput
                  id={'weight_unit'}
                  label={"Provide Units"}
                  type='number'
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9.]/g, '');
                  }}
                  min={0}
                  step={0.01}
                  {...register("weight_unit", { required: "Required" })}
                />
                {errors?.weight_unit?.message && (
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
