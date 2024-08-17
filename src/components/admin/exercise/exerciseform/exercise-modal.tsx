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
import { createExerciseInputTypes, ErrorType } from "@/app/types";
import uploadimg from "@/assets/upload.svg";
import {
  difficultyTypeoptions,
  ExerciseItem,
  exerciseTypeOptions,
  initialValue,
  visibilityOptions,
} from "@/constants/exercise";
import {
  useAddExerciseMutation,
  useUpdateExerciseMutation,
} from "@/services/exerciseApi";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetAllCategoryQuery,
  useGetAllEquipmentsQuery,
  useGetAllJointsQuery,
  useGetAllMetQuery,
  useGetAllMuscleQuery,
} from "@/services/exerciseApi";
import { SpaceEvenlyVerticallyIcon } from "@radix-ui/react-icons";
import { UploadCognitoImage, deleteCognitoImage } from "@/utils/lib/s3Service";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
const { VITE_VIEW_S3_URL } = import.meta.env;
interface ExerciseForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
  data: createExerciseInputTypes | undefined;
}

const ExerciseForm = ({
  isOpen,
  setOpen,
  action,
  data,
  setAction,
  refetch,
}: ExerciseForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const userid =
    useSelector((state: RootState) => state.auth.userInfo?.user.id) || 0;

  const { toast } = useToast();
  const [gif, setGif] = useState<File[]| null>(null);
  const [maleImage, setMaleImage] = useState<File[] | null>(null);
const [femaleImage, setFemaleImage] = useState<File[] | null>(null);


    const [existingGIf, setExistingGif] = useState<string | null>(null);
  const [existingMaleImage, setExistingMaleImage] = useState<string | null>(null);
  const [existingFemaleImage, setExistingFemaleImage] = useState<string | null>(null);

  const { data: CategoryData } = useGetAllCategoryQuery();
  const { data: EquipmentData } = useGetAllEquipmentsQuery();
  const { data: MuscleData } = useGetAllMuscleQuery();
  const { data: JointsData } = useGetAllJointsQuery();
  const { data: MetsData } = useGetAllMetQuery();

  const dropzone = {
    accept: {
      "image/": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const dropzoneGif = {
    accept: {
      "image/": [".gif"],
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const form = useForm<createExerciseInputTypes>({
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

  useEffect(() => {
    if (action == "edit") {
      console.log({ data }, "edit");
      reset(data);
    } else if (action == "add") {
      console.log({ initialValue }, "add");
      reset(initialValue, {
        keepIsSubmitted: false,
        keepSubmitCount: false,
        keepDefaultValues: true,
        keepDirtyValues: true,
      });
    }
  }, [action, reset]);

  const handleClose = () => {
    clearErrors();
    setAction("add");
    reset(initialValue, {
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDefaultValues: true,
      keepDirtyValues: true,
    });
    setMaleImage([]);
    setFemaleImage([]);
    setGif([]);
    setOpen(false);
  };

  const [createExercise] = useAddExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();

  const onSubmit = async (input: createExerciseInputTypes) => {
    // const payload = { org_id: orgId, ...input };
    // if (files && files?.length > 0) {
    //   console.log(files[0], "food_image");
    //   const getUrl = await UploadCognitoImage(files[0]);
    //   payload.img_url = getUrl.location;
    // } else {
    //   payload.img_url = null;
    // }
console.log(input);
    try {
      if (action === "add") {
        // await createExercise(payload).unwrap();
        // toast({
        //   variant: "success",
        //   title: "Created Successfully",
        // });
        // refetch();
        // handleClose();
      } else if (action === "edit") {
        // await updateExercise({ ...payload, id: data?.id as number }).unwrap();
        // toast({
        //   variant: "success",
        //   title: "Updated Successfully",
        // });
        // refetch();
        // handleClose();
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
      handleClose();
    }
  };

  const Exercise_info: ExerciseItem[] = [
    {
      type: "text",
      name: "exercise_name",
      label: "Exercise Name*",
      required: true,
    },
    {
      type: "select",
      name: "visible_for",
      label: "Visible For*",
      required: true,
      options: visibilityOptions,
    },
    {
      type: "select",
      name: "exercise_category",
      label: "Category*",
      required: true,
      options: CategoryData,
    },
    {
      type: "select",
      name: "difficulty",
      label: "Difficulty*",
      required: true,
      options: difficultyTypeoptions,
    },
    {
      type: "multiselect",
      name: "equipment",
      label: "Equipments*",
      required: true,
      options: EquipmentData,
    },
    {
      type: "multiselect",
      name: "primaryMuscles",
      label: "Primary Muscle*",
      required: true,
      options: MuscleData,
    },
    {
      type: "multiselect",
      name: "secondaryMuscles",
      required: false,
      label: "Secondary Muscle",
      options: MuscleData,
    },
    {
      type: "multiselect",
      name: "primaryJoints",
      label: "Primary Joints*",
      required: true,
      options: JointsData,
    },
    {
      type: "text",
      name: "youtube_link_male",
      label: "Youtube link-Male",
      required: false,
    },
    {
      type: "text",
      name: "youtube_link_female",
      label: "Youtube link-Female",
      required: false,
    },
  ];

  return (
    <Sheet open={isOpen}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1050px] py-0 custom-scrollbar h-screen"
      >
        <FormProvider {...form}>
          <form
            key={action}
            noValidate
            className="pb-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <SheetHeader className="sticky top-0 z-40 pt-4 bg-white">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-start  bg-white">
                  <div>
                    <p className="font-semibold">Exercise</p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                        Add Exercise
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
                      {action === "edit" ? "Save" : "Update"}
                    </LoadingButton>
                  </div>
                </div>
              </SheetTitle>
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>
            <h1 className="font-semibold text-xl py-3">Exercise Details</h1>
            <div className="grid grid-cols-3 gap-3 p-1 ">
              {Exercise_info.map((item) => {
                if (item.type === "text") {
                  return (
                    <div key={item.name} className="relative">
                      <FloatingLabelInput
                        id={item.name}
                        label={item.label}
                        {...register(
                          item.name as keyof createExerciseInputTypes,
                          {
                            required: item.required && "Required",
                            maxLength: 40,
                            setValueAs: (value) => value.toLowerCase(),
                          }
                        )}
                        error={
                          errors[item.name as keyof createExerciseInputTypes]
                            ?.message
                        }
                      />

                      {errors[item.name as keyof createExerciseInputTypes]
                        ?.type === "maxLength" && (
                        <span className="text-red-500 mt-[5px] text-xs">
                          Max length exceeded
                        </span>
                      )}
                    </div>
                  );
                }

                if (item.type === "multiselect") {
                  return (
                    <div key={item.name} className="relative">
                      <Controller
                        name={item.name as keyof createExerciseInputTypes}
                        control={control}
                        rules={{
                          ...(item.required ? { required: "Required" } : {}),
                        }}
                        render={({ field: { onChange, value } }) => (
                          <MultiSelect
                          floatingLabel={item.label}
                            options={
                              item.options as {
                                label: string;
                                value: string | number;
                              }[]
                            }
                            onValueChange={(selectedValues) => {
                              onChange(selectedValues); // Update form state on value change
                            }}
                            // Initialize the multi-select with default values
                            defaultValue={Array.isArray(value) ? value : []} // Ensure defaultValue is always an array
                            placeholder={"Select " + item.label}
                            variant="inverted"
                            maxCount={1}
                            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          />
                        )}
                      />
                      {errors[item.name as keyof createExerciseInputTypes]
                        ?.message && (
                        <span className="text-red-500 text-xs mt-[5px]">
                          {
                            errors[item.name as keyof createExerciseInputTypes]
                              ?.message
                          }
                        </span>
                      )}
                    </div>
                  );
                }

                if (item.type === "select") {
                  return (
                    <div key={item.name} className="relative">
                      <Controller
                        name={item.name as keyof createExerciseInputTypes}
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
                              <SelectTrigger
                                floatingLabel={item.label}
                                name={item.name}
                              >
                                <SelectValue
                                  placeholder={"Select " + item.label}
                                />
                              </SelectTrigger>

                              <SelectContent>
                                {item.options?.map((st: any, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      />
                      {errors[item.name as keyof createExerciseInputTypes]
                        ?.message && (
                        <span className="text-red-500 text-xs mt-[5px]">
                          {
                            errors[item.name as keyof createExerciseInputTypes]
                              ?.message
                          }
                        </span>
                      )}
                    </div>
                  );
                }
              })}
            </div>
            <h1 className="font-semibold text-xl py-3">Thumbnails</h1>
            <div className="flex gap-2 w-full">
              <div className="w-[33%]">
                  <h1 className="m-2 font-semibold"> Male Image</h1>
                  <FileUploader
                    value={maleImage}
                    onValueChange={setMaleImage}
                    dropzoneOptions={dropzone}
                  >
                    {maleImage && maleImage.length > 0 ? (
                      maleImage.map((file, i) => (
                        <div className="h-40" key={i}>
                          <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                            <FileUploaderItem
                              key={i}
                              index={i}
                              className="h-full p-0 rounded-md overflow-hidden relative"
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
                      ))
                    ) : existingMaleImage ? (
                      <div className="h-40">
                        <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                          <FileUploaderItem
                            className="h-full p-0 rounded-md overflow-hidden relative"
                            index={Number(existingFemaleImage)+1}
                          >
                            <img
                              src={existingMaleImage}
                              alt="Existing Male Image"
                              className="object-contain max-h-40"
                            />
                          </FileUploaderItem>
                        </FileUploaderContent>
                      </div>
                    ) : (
                      <FileInput className="flex flex-row gap-">
                        <div className="flex gap-2 items-center bg-white flex-col justify-center h-40 w-full bg-background rounded-md border-dashed border-2 border-primary">
                          <div>
                            <i className="text-primary fa-regular fa-image text-2xl"></i>
                          </div>
                          <div>
                            <h1 className="text-sm">
                              Drop your male image here or{" "}
                              <span className="underline text-blue-500">Browse</span>
                            </h1>
                          </div>
                          <div>
                            <span className="text-sm">
                              Support JPG , PNG, and JPEG
                            </span>
                          </div>
                        </div>
                      </FileInput>
                    )}
                  </FileUploader>
                </div>

          <div className="w-[33%]">
            <h1 className="m-2 font-semibold"> Female Image</h1>
            <FileUploader
              value={femaleImage}
              onValueChange={setFemaleImage}
              dropzoneOptions={dropzone}
            >
              {femaleImage && femaleImage.length > 0 ? (
                femaleImage.map((file, i) => (
                  <div className="h-40" key={i}>
                    <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                      <FileUploaderItem
                        key={i}
                        index={i}
                        className="h-full p-0 rounded-md overflow-hidden relative"
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
                ))
              ) : existingFemaleImage ? (
                <div className="h-40">
                  <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                    <FileUploaderItem
                      className="h-full p-0 rounded-md overflow-hidden relative"
                      index={Number(existingFemaleImage)+2}
                    >
                      <img
                        src={existingFemaleImage}
                        alt="Existing Female Image"
                        className="object-contain max-h-40"
                      />
                    </FileUploaderItem>
                  </FileUploaderContent>
                </div>
              ) : (
                <FileInput className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center bg-white flex-col justify-center h-40 w-full bg-background rounded-md border-dashed border-2 border-primary">
                    <div>
                      <i className="text-primary fa-regular fa-image text-2xl"></i>
                    </div>
                    <div>
                      <h1 className="text-sm">
                        Drop your female image here or{" "}
                        <span className="underline text-blue-500">Browse</span>
                      </h1>
                    </div>
                    <div>
                      <span className="text-sm">
                        Support JPG , PNG, and JPEG
                      </span>
                    </div>
                  </div>
                </FileInput>
              )}
            </FileUploader>
          </div>
               <div className="w-[33%]">
                  <h1 className="m-2 font-semibold"> Upload Gif</h1>
                  <FileUploader
                    value={gif}
                    onValueChange={setGif}
                    dropzoneOptions={dropzone}
                  >
                    {gif && gif.length > 0 ? (
                      gif.map((file, i) => (
                        <div className="h-40" key={i}>
                          <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                            <FileUploaderItem
                              key={i}
                              index={i}
                              className="h-full p-0 rounded-md overflow-hidden relative"
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
                      ))
                    ) : existingGIf ? (
                      <div className="h-40">
                        <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                          <FileUploaderItem
                            className="h-full p-0 rounded-md overflow-hidden relative"
                            index={Number(existingGIf)+1}
                          >
                            <img
                              src={existingGIf}
                              alt="Existing Male Image"
                              className="object-contain max-h-40"
                            />
                          </FileUploaderItem>
                        </FileUploaderContent>
                      </div>
                    ) : (
                      <FileInput className="flex flex-row gap-">
                        <div className="flex gap-2 items-center bg-white flex-col justify-center h-40 w-full bg-background rounded-md border-dashed border-2 border-primary">
                          <div>
                            <i className="text-primary fa-regular fa-image text-2xl"></i>
                          </div>
                          <div>
                            <h1 className="text-sm">
                              Drop your male image here or{" "}
                              <span className="underline text-blue-500">Browse</span>
                            </h1>
                          </div>
                          <div>
                            <span className="text-sm">
                              Support GIF Only.
                            </span>
                          </div>
                        </div>
                      </FileInput>
                    )}
                  </FileUploader>
                </div>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default ExerciseForm;
