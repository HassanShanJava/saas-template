import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRef } from "react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
interface WorkOutPlanForm {
  isOpen: boolean;
  setOpen: any;
}

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";

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
import { ImageIcon } from "lucide-react";
import { FiUpload } from "react-icons/fi";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { ErrorType } from "@/app/types";
import { AutosizeTextarea } from "@/components/ui/autosizetextarea/autosizetextarea";
import { membersSchema } from "@/schema/formSchema";
const WorkoutPlanForm = ({ isOpen, setOpen }: WorkOutPlanForm) => {
  const FormSchema = z.object({
    name: z
      .string({
        required_error: "Required",
      })
      .min(3, {
        message: "Required",
      }),
    description: z.string({}).optional(),
    members_id: z.array(membersSchema).nonempty({
      message: "Required",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
    mode: "all",
  });
  const [workoutPlan, setworkoutPlan] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("only once", data);
    try {
    } catch (error: unknown) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  }

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
                <p className="font-semibold">Workout Plans</p>
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
        <Form {...form}>
          <div className="">
            <p className="text-black text-2xl font-bold">
              {" "}
              Plan information and Details
            </p>
            <div className="grid grid-cols-3 gap-4 p-4">
              {/* <!-- Column 1: Name and Description --> */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="name"
                            label="Name*"
                          />
                          {watcher.name ? <></> : <FormMessage />}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AutosizeTextarea
                            placeholder="description"
                            id="description"
                            {...field}
                            maxHeight={600}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="member_ids"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <MultiSelector
                          onValuesChange={(values) => field.onChange(values)}
                          values={field.value}
                        >
                          <MultiSelectorTrigger className="border-[1px] border-gray-300">
                            <MultiSelectorInput
                              className="font-medium"
                              placeholder={
                                field.value.length == 0 ? `Assign Members*` : ""
                              }
                            />
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {transformedData &&
                                transformedData.map((user: any) => (
                                  <MultiSelectorItem
                                    key={user.id}
                                    value={user}
                                    // disabled={field.value?.length >= 5}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span>{user.name}</span>
                                    </div>
                                  </MultiSelectorItem>
                                ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* <!-- Column 2: Visibility and Repetition --> */}
              <div className="bg-gray-200 border border-gray-300 p-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Repetition
                  </label>
                  <input
                    type="number"
                    id="repetition"
                    placeholder="Enter repetition count"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              {/* <!-- Column 3: Image Upload --> */}

              {/* <div className="p-4">
                <div className="mb-4">
                  <div className="justify-center items-center flex flex-col">
                    <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="ghost"
                        className="mt-2 gap-2 border-dashed border-2 text-xs"
                      >
                        <FiUpload className="text-primary w-5 h-5" /> Image
                      </Button>
                    </label>
                  </div>
                </div>
              </div> */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="justify-center items-center flex flex-col">
                    <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      variant="ghost"
                      className="mt-2 gap-2 border-dashed border-2 text-xs hover:bg-green-100"
                      onClick={handleButtonClick}
                    >
                      <FiUpload className="text-primary w-5 h-5" /> Upload
                      Picture
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default WorkoutPlanForm;
