import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

import FoodForm from "./add-meal";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
interface MealPlanForm {
  isOpen: boolean;
  setOpen: any;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch?: any;
  setData?: any;
  data?: mealPlanDataType | undefined;
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
import { mealPlanDataType } from "@/app/types";
import { useToast } from "@/components/ui/use-toast";
const { VITE_VIEW_S3_URL } = import.meta.env;

const chartData = [
  { food_component: "protein", percentage: 10, fill: "#8BB738" },
  { food_component: "fats", percentage: 0, fill: "#E8A239" },
  { food_component: "carbs", percentage: 0, fill: "#DD4664" },
];

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
}

const MealPlanForm = ({
  isOpen,
  setOpen,
  action,
  setAction,
  refetch,
  data,
  setData,
}: MealPlanForm) => {
  const { toast } = useToast();
  const [openFood, setOpenFood] = useState(false);
  const [pieChartData, setPieChart] = useState(chartData);
  const [files, setFiles] = useState<File[] | null>([]);

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
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

  const form = useForm<mealPlanDataType>({
    mode: "all",
    defaultValues: initialValue,
  });

  const {
    control,
    watch,
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();

  useEffect(() => {
    if (action == "edit" && data) {
      console.log({ data }, "edit");
      reset(data as mealPlanDataType);
    } else if (action == "add" && data == undefined) {
      console.log({ initialValue }, "add");
      reset(initialValue, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [action, data, reset]);

  const onSubmit = async (data: mealPlanDataType) => {
    console.log({ data })
  }

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all mandatory fields",
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  console.log({ watcher, errors }, action)
  return (
    <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
      <SheetContent className="!max-w-[1200px]" hideCloseButton>
        <SheetHeader>
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
                    Add Meal Plan
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
                  onClick={handleSubmit(onSubmit, onError)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && (
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                  )}
                  Save
                </LoadingButton>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <Separator className=" h-[1px] rounded-full my-2" />
        <FormProvider {...form}>
          <div className="">
            <p className="font-semibold pb-4 pt-2">General Information</p>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="flex flex-col gap-2">
                <FloatingLabelInput id="male_name" label="Name*" />

                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropzone}
                >
                  {files &&
                        files?.map((file, i) => (
                          <div className="h-40 ">
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
                                  className="object-contain max-h-40"
                                />
                              </FileUploaderItem>
                            </FileUploaderContent>
                          </div>
                        ))}

                      <FileInput className="flex flex-col gap-2  ">
                        {files?.length == 0 && watcher?.profile_img == null ? (
                          <div className="flex items-center justify-center h-40 w-full border bg-background rounded-md bg-gray-100">
                            <i className="text-gray-400 fa-regular fa-image text-2xl"></i>
                          </div>
                        ) : (
                          files?.length == 0 &&
                          watcher?.profile_img && (
                            <div className="flex items-center justify-center h-40 w-full border bg-background rounded-md bg-gray-100">
                              {/* <i className="text-gray-400 fa-regular fa-image text-2xl"></i> */}
                              <img
                                src={
                                  watcher?.profile_img !== "" && watcher?.profile_img
                                    ? VITE_VIEW_S3_URL + "/" + watcher?.profile_img
                                    : ""
                                }
                                loading="lazy"
                                className="object-contain max-h-40 "
                              />
                            </div>
                          )
                        )}

                        <div className="flex items-center  justify-start gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
                          <img src={uploadimg} className="size-10" />
                          <span className="text-sm">
                            {watcher.img_url ? "Change Image" : "Upload Image"}
                          </span>
                        </div>
                      </FileInput>
                </FileUploader>

              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="visible_for"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Status</FormLabel> */}
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger floatingLabel="Visible for*">
                            <SelectValue placeholder="Select visiblity for" />
                          </SelectTrigger>
                          {/* <SelectContent>
                                {status.map((st, index) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent> */}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FloatingLabelInput
                  id="description"
                  label="Description"
                  type="textarea"
                  rows={10}
                  customPercentage={[14, 8, 10]}
                // {...register("description")}
                // error={errors.description?.message}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="asign_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger floatingLabel="Assign Member*">
                            <SelectValue placeholder="Select members" />
                          </SelectTrigger>
                          {/* <SelectContent>
                                {status.map((st, index) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent> */}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* pie chart */}
                <Card className="flex flex-col bg-gray-50">
                  <CardHeader className="items-center px-0 py-3 text-center">
                    <CardTitle className="font-semibold">
                      Calorie & Micro Nutrient Breakdown{" "}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[152px] !p-0"
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
                    <div className="flex gap-2 items-center justify-center">
                      {pieChartData.map((item) => (
                        <div className="flex items-center gap-1 font-semibold pb-2">
                          <span
                            style={{ backgroundColor: item.fill }}
                            className={" rounded-[50%] size-2"}
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
          <div className="h-full max-h-56 custom-scrollbar">
            <table className="w-full text-left">
              <tr className="bg-gray-100  font-semibold capitalize ">
                <th className="p-3">breakfast</th>
                <th className="p-3">amount</th>
                <th className="p-3">calories</th>
                <th className="p-3">carbs</th>
                <th className="p-3">protein</th>
                <th className="p-3">fat</th>
              </tr>
              <tr>
                <td className="p-3">Please add food</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 flex justify-end ">
                  <i
                    className="text-primary fa fa-plus  cursor-pointer"
                    onClick={() => setOpenFood(true)}
                  ></i>
                </td>
              </tr>
            </table>
            {/* 2nd */}
            <table className="w-full text-left">
              <tr className="bg-gray-100  font-semibold capitalize ">
                <th className="p-3">morning snacks</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
              <tr>
                <td className="p-3">Please add food</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 flex justify-end ">
                  <i
                    className="text-primary fa fa-plus  cursor-pointer"
                    onClick={() => setOpenFood(true)}
                  ></i>
                </td>
              </tr>
            </table>
            {/* 3rd */}
            <table className="w-full text-left">
              <tr className="bg-gray-100  font-semibold capitalize ">
                <th className="p-3">lunch</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
              <tr>
                <td className="p-3">Please add food</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 flex justify-end ">
                  <i
                    className="text-primary fa fa-plus cursor-pointer"
                    onClick={() => setOpenFood(true)}
                  ></i>
                </td>
              </tr>
            </table>
            {/* 4th */}
            <table className="w-full text-left">
              <tr className="bg-gray-100  font-semibold capitalize ">
                <th className="p-3">afternoon lunch</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
              <tr>
                <td className="p-3">Please add food</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 flex justify-end ">
                  <i
                    className="text-primary fa fa-plus cursor-pointer"
                    onClick={() => setOpenFood(true)}
                  ></i>
                </td>
              </tr>
            </table>
          </div>
        </FormProvider>

        <FoodForm isOpen={openFood} setOpen={setOpenFood} />
      </SheetContent>
    </Sheet>
  );
};

export default MealPlanForm;
