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
import {
  Controller,
  FieldErrors,
  FormProvider,
  useForm,
} from "react-hook-form";
import { CreateFoodTypes, ErrorType } from "@/app/types";
import uploadimg from "@/assets/upload.svg";

import {
  basicInfo,
  nutrientsInfo,
  initialValue,
  weights,
} from "@/constants/food";

import {
  useCreateFoodsMutation,
  useUpdateFoodsMutation,
} from "@/services/foodsApi";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { UploadCognitoImage, deleteCognitoImage } from "@/utils/lib/s3Service";
const { VITE_VIEW_S3_URL } = import.meta.env;
interface FoodForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
  setData?: any;
  data: CreateFoodTypes | undefined;
}

const FoodForm = ({
  isOpen,
  setOpen,
  action,
  data,
  setAction,
  refetch,
  setData,
}: FoodForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();
  const [showMore, setShowMore] = useState(false);
  const [files, setFiles] = useState<File[] | null>([]);
  const handleShowMore = () => setShowMore((prev) => !prev);

  const dropzone = {
    accept: {
      "image/": [".jpg", ".jpeg", ".png"],
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
      reset(data as CreateFoodTypes);
    } else if (action == "add" && data == undefined) {
      console.log({ initialValue }, "add");
      reset(initialValue, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [action, data, reset]);

  const handleClose = () => {
    setFiles([]);
    clearErrors();
    reset();
    setData(undefined);
    setShowMore(false);
    setOpen(false);
  };

  const [createFood] = useCreateFoodsMutation();
  const [updateFood] = useUpdateFoodsMutation();

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const onSubmit = async (input: CreateFoodTypes) => {
    const payload = { org_id: orgId, ...input };
    if (files && files?.length > 0) {
      if (watcher.img_url !== "" && watcher.img_url) {
        await deleteCognitoImage(watcher.img_url as string);
      }
      console.log(files[0], "food_image");
      const getUrl = await UploadCognitoImage(files[0]);
      payload.img_url = getUrl.location;
    }

    try {
      if (action === "add") {
        await createFood(payload).unwrap();
        toast({
          variant: "success",
          title: "Food created successfully",
        });
        refetch();
      } else if (action === "edit") {
        await updateFood({ ...payload, id: data?.id as number }).unwrap();
        toast({
          variant: "success",
          title: "Food updated Successfully",
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
          description: `${typedError.data?.detail}`,
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
  // console.log({ files,watcher,errors });
  console.log({ data, watcher }, "edit");
  return (
    <Sheet open={isOpen}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1050px] py-0 custom-scrollbar h-screen sm:w-[90%] sm:max-w-2xl"
      >
        <FormProvider {...form}>
          <form
            key={action}
            noValidate
            className="pb-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <SheetHeader className="sticky top-0 z-40 pt-4 bg-white">
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
                        {action == "add" ? "Create " : "Edit "} Food
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
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>
            <h1 className="font-semibold text-xl py-3">Basic Information</h1>
            <div className="grid grid-cols-3 gap-3  ">
              <div className="col-span-2 grid grid-cols-2 gap-3">
                {basicInfo.map((item) => {
                  if (item.type === "text") {
                    return (
                      <div key={item.name} className="relative">
                        <FloatingLabelInput
                          id={item.name}
                          className="capitalize"
                          label={item.label + (item.required ? "*" : "")}
                          {...register(item.name as keyof CreateFoodTypes, {
                            required: item.required && "Required",
                            maxLength: {
                              value: 50,
                              message: `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} should not exceed 50 characters`,
                            },
                            setValueAs: (value) => value.toLowerCase(),
                          })}
                          error={
                            errors[item.name as keyof CreateFoodTypes]?.message
                          }
                        />
                      </div>
                    );
                  }

                  if (item.type === "select") {
                    return (
                      <div key={item.name} className="relative">
                        <Controller
                          name={item.name as keyof CreateFoodTypes}
                          rules={{ required: item.required && "Required" }}
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
                                <SelectTrigger
                                  floatingLabel={`${item.label}${item.required ? "*" : ""}`}
                                  name={item.name}
                                >
                                  <SelectValue
                                    placeholder={"Select " + item.label}
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {item.options?.map(
                                    (st: any, index: number) => (
                                      <SelectItem
                                        key={index}
                                        value={String(st.label)}
                                      >
                                        {st.label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        />
                        {errors[item.name as keyof CreateFoodTypes]
                          ?.message && (
                            <span className="text-red-500 text-xs mt-[5px]">
                              {
                                errors[item.name as keyof CreateFoodTypes]
                                  ?.message
                              }
                            </span>
                          )}
                      </div>
                    );
                  }
                })}
              </div>

              <Controller
                name={"img_url"}
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
                          <div className="h-24 ">
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
                                  className="object-contain max-h-24"
                                />
                              </FileUploaderItem>
                            </FileUploaderContent>
                          </div>
                        ))}

                      <FileInput className="flex flex-col gap-2  ">
                        {files?.length == 0 && watcher?.img_url == null ? (
                          <div className="flex items-center justify-center h-24 w-full border bg-background rounded-md bg-gray-100">
                            <i className="text-gray-400 fa-regular fa-image text-2xl"></i>
                          </div>
                        ) : (
                          files?.length == 0 &&
                          watcher?.img_url && (
                            <div className="flex items-center justify-center h-24 w-full border bg-background rounded-md bg-gray-100">
                              {/* <i className="text-gray-400 fa-regular fa-image text-2xl"></i> */}
                              <img
                                src={
                                  watcher?.img_url !== "" && watcher?.img_url
                                    ? (watcher?.img_url.includes(VITE_VIEW_S3_URL) ? watcher?.img_url : `${VITE_VIEW_S3_URL}/${watcher?.img_url}`)
                                    : ""
                                }
                                loading="lazy"
                                className="object-contain max-h-24 "
                              />
                            </div>
                          )
                        )}

                        <div className="flex items-center  justify-start gap-1 w-full border-dashed border-2 border-gray-200 rounded-md px-2 py-1 h-11">
                          <img src={uploadimg} className="size-10" />
                          <span className="text-sm">
                            {watcher.img_url ? "Change Image" : "Upload Image"}
                          </span>
                        </div>
                      </FileInput>
                    </FileUploader>

                    {errors.img_url?.message && files?.length == 0 && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {errors.img_url?.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <h1 className="font-semibold text-xl py-4">Units</h1>
              <div className="grid grid-cols-4 gap-3">
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
                          <SelectTrigger floatingLabel={"Unit*"}>
                            <SelectValue placeholder={"Select unit"} />
                          </SelectTrigger>
                          <SelectContent>
                            {weights.map((unit, i) => (
                              <SelectItem value={unit.label} key={i}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  {errors?.weight_unit?.message && (
                    <span className="text-red-500 mt-[5px] text-xs">
                      {errors?.weight_unit?.message}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <FloatingLabelInput
                    id={"weight"}
                    label={"Weight*"}
                    type="number"
                    min={0}
                    step={0.01}
                    error={errors?.weight?.message}
                    {...register("weight", {
                      required: "Required",
                      valueAsNumber: true,
                      max: {
                        value: 1000,
                        message: `Value must be less than or equal to 1000`,
                      },
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center my-4">
              <h1 className="font-semibold text-xl py-4">
                Nutrition Information
              </h1>
              <Button
                variant={"outline"}
                className="border-primary"
                type="button"
                onClick={handleShowMore}
              >
                {showMore ? "Hide" : "Show"} micro nutrients
              </Button>
            </div>
            <div className="py-2 px-1 grid grid-cols-4 gap-3 ">
              {filteredNutrients.map((item) => {
                if (item.type === "number") {
                  return (
                    <div key={item.name} className="relative">
                      <FloatingLabelInput
                        type="number"
                        min={0}
                        step={0.01}
                        id={item.name}
                        label={item.label + (item.required ? "*" : "")}
                        error={
                          errors[item.name as keyof CreateFoodTypes]?.message
                        }
                        {...register(item.name as keyof CreateFoodTypes, {
                          required: item.required && "Required",
                          valueAsNumber: true,
                          max: {
                            value: 1000,
                            message: `Value must be less than or equal to 1000`,
                          },
                        })}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default FoodForm;
