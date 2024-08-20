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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
interface MealPlanForm {
  isOpen: boolean;
  setOpen: any;
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
// import { zodResolver } from "@hookform/resolvers/zod";
import uploadimg from "@/assets/upload.svg";
const chartData = [
  { food_component: "protein", percentage: 10, fill: "#8BB738" },
  { food_component: "fats", percentage: 0, fill: "#E8A239" },
  { food_component: "carbs", percentage: 0, fill: "#DD4664" },
];

const MealPlanForm = ({ isOpen, setOpen }: MealPlanForm) => {
  const [openFood, setOpenFood] = useState(false);
  const [pieChartData, setPieChart] = useState(chartData);
  const [files, setFiles] = useState<File[] | null>([]);

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

  const form = useForm({
    // resolver: zodResolver(),
    // defaultValues: formData,
    mode: "all",
  });

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleClose = () => {
    setOpen(false);
  };
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
                  // onClick={handleSubmit(onSubmit)}
                  // loading={isSubmitting}
                  // disabled={isSubmitting}
                >
                  {/* {!isSubmitting && ( */}
                  <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                  {/* )} */}
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
                  <FileInput className="flex flex-col gap-2">
                    <div className="flex items-center justify-center h-[10rem] w-full border bg-background rounded-md bg-gray-100">
                      <i className="text-gray-400 fa-regular fa-image size-5"></i>
                    </div>

                    <div className="flex items-center justify-start gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1">
                      {/* <i className="text-gray-400 fa-regular fa-image size-5"></i> */}
                      <img src={uploadimg} className="size-10" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                  </FileInput>
                  <FileUploaderContent className="flex items-center flex-row gap-2">
                    {files?.map((file, i) => (
                      <FileUploaderItem
                        key={i}
                        index={i}
                        className="size-20 p-0 rounded-md overflow-hidden"
                        aria-roledescription={`file ${i + 1} containing ${file.name}`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          height={80}
                          width={80}
                          className="size-20 p-0"
                        />
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
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
