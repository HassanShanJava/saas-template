import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
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
import React, { useEffect, useRef, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import {
  Controller,
  FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  baseExerciseApiResponse,
  createExerciseInputTypes,
  ErrorType,
  ExerciseTypeEnum,
} from "@/app/types";
import {
  combinePayload,
  difficultyTypeoptions,
  ExerciseItem,
  exerciseTypeOptions,
  initialValue,
  processAndUploadImages,
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
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Check, ChevronDownIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import DifficultySlider, { Difficulty } from "../component/difficultySlider";
const { VITE_VIEW_S3_URL } = import.meta.env;
interface ExerciseForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
  data: createExerciseInputTypes | undefined;
}

enum IntensityEnum {
  max_intensity = "Max Intensity",
  irm = "irm",
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
  const [valueofDifficulty, setValueofDifficulty] = useState<Difficulty>(
    Difficulty.Novice
  );
  const { toast } = useToast();
  const [existingGIf, setExistingGif] = useState<string | null>(null);
  const [existingMaleImage, setExistingMaleImage] = useState<string | null>(
    null
  );
  const [existingFemaleImage, setExistingFemaleImage] = useState<string | null>(
    null
  );
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
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  const [currentValue, setCurrentValue] = useState<number | undefined>(
    form.getValues("intensity_value")
  );

  const watcher = watch();
  useEffect(() => {
    if (action == "edit") {
      console.log({ data }, "edit");
      reset(data);
      const imagemale = data && data.thumbnail_male;
      setExistingFemaleImage(imagemale ?? null);
      const gifimage = data && data.gif_url;
      setExistingGif(gifimage as string);

      setExistingMaleImage(data?.thumbnail_male ?? null);
      setCurrentValue(data?.intensity_value);
      setValueofDifficulty(
        Difficulty[data?.difficulty as keyof typeof Difficulty]
      );
    } else if (action == "add") {
      console.log({ initialValue }, "add");

      reset(initialValue, {
        keepIsSubmitted: false, // Reset the form's submission state
        keepSubmitCount: false, // Reset the count of submissions
        keepDirtyValues: false, // Clear any dirty values (set to false to reset all fields)
        keepDefaultValues: true, // Keep default values as provided by initialValue
      });
    }
  }, [action, reset]);

  const handleClose = () => {
    clearErrors();
    setAction("add");
    reset(initialValue, {
      keepIsSubmitted: false, // Reset the form's submission state
      keepSubmitCount: false, // Reset the count of submissions
      keepDirtyValues: false, // Clear any dirty values (set to false to reset all fields)
      keepDefaultValues: true, // Keep default values as provided by initialValue
    });
    setValueofDifficulty(Difficulty.Novice);
    setCurrentValue(10);
    setExistingGif(null);
    setExistingFemaleImage(null);
    setExistingMaleImage(null);

    console.log("called");
    setOpen(false);
  };

  const [createExercise] = useAddExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();
  console.log({ watcher, errors });
  const onSubmit = async (input: createExerciseInputTypes) => {
    // console.log("input payload", { input });
    // console.log("FIle infor", input.gif[0]);
    // console.log("Male image", input.imagemale[0]);
    // console.log("Female image", input.imagefemale[0]);
    // Example usage
    const fileInputObject = {
      gif: input.gif,
      imagemale: input.imagemale,
      imagefemale: input.imagefemale,
    };

    const existingImages = {
      gif: existingGIf,
      thumbnail_male: existingMaleImage,
      image_url_male: existingMaleImage,
      thumbnail_female: existingFemaleImage,
      image_url_female: existingFemaleImage,
    };

    const result = await processAndUploadImages(
      fileInputObject,
      existingImages
    );

    // console.log("Resulting urls", result);
    const responsePayload = combinePayload(input, result);
    console.log("Dead final response", responsePayload);
    const payload = {
      ...responsePayload,
      org_id: orgId,
      exercise_name: responsePayload.exercise_name.toLowerCase(),
    };
    try {
      if (action === "add") {
        await createExercise(payload).unwrap();
        toast({
          variant: "success",
          title: "Exercise saved successfully",
        });
        refetch();
        handleClose();
      } else if (action === "edit") {
        await updateExercise({ ...payload, id: data?.id as number }).unwrap();
        toast({
          variant: "success",
          title: "Exercise updated successfully",
        });
        refetch();
        handleClose();
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail ?? "Internal Server Error"}`,
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

  const {
    fields: timeFields,
    append: appendTime,
    remove: removeTime,
  } = useFieldArray({
    control,
    name: "timePerSet",
  });

  const {
    fields: restFields,
    append: appendRest,
    remove: removeRest,
  } = useFieldArray({
    control,
    name: "restPerSet",
  });

  const {
    fields: restFieldsrep,
    append: appendRestrep,
    remove: removeRestrep,
  } = useFieldArray({
    control,
    name: "restPerSetrep",
  });
  const {
    fields: repetitionFields,
    append: appendRepetition,
    remove: removeRepetition,
  } = useFieldArray({
    control,
    name: "repetitionPerSet",
  });

  const mode = watch("exercise_type");

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const Exercise_info: ExerciseItem[] = [
    {
      type: "text",
      name: "exercise_name",
      label: "Exercise Name*",
      maxlength: 41,
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
      name: "category_id",
      label: "Exercise Category*",
      required: true,
      options: CategoryData,
    },
    {
      type: "multiselect",
      name: "equipment_ids",
      label: "Equipments*",
      required: true,
      options: EquipmentData,
    },
    {
      type: "multiselect",
      name: "primary_muscle_ids",
      label: "Primary Muscle*",
      required: true,
      options: MuscleData,
    },
    {
      type: "multiselect",
      name: "secondary_muscle_ids",
      required: false,
      label: "Secondary Muscle",
      options: MuscleData,
    },
    {
      type: "multiselect",
      name: "primary_joint_ids",
      label: "Primary Joints*",
      required: true,
      options: JointsData,
    },
    {
      type: "text",
      name: "video_url_male",
      label: "Video link-Male",
      required: false,
      pattern: "https?://.+",
    },
    {
      type: "text",
      name: "video_url_female",
      label: "Video link-Female",
      required: false,
      pattern: "https?://.+",
    },
    {
      type: "radio",
      name: "exercise_type",
      label: "Exercise Type",
      required: true,
      options: exerciseTypeOptions,
    },
    {
      type: "slider",
      name: "difficulty",
      label: "Difficulty*",
      required: true,
      options: difficultyTypeoptions,
    },
  ];

  function handleChange(data: Difficulty) {
    setValueofDifficulty(data);
    setValue("difficulty", Difficulty[data]);
  }

  function handleRemoveImage(
    setState: React.Dispatch<React.SetStateAction<string | null>>
  ) {
    return () => {
      setState(null);
    };
  }

  console.log({ watcher });
  return (
    <Sheet open={isOpen}>
      <SheetContent
        hideCloseButton
        className="lg:!max-w-[1100px] py-0 custom-scrollbar h-full w-[85%] sm:w-full sm:max-w-3xl"
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
                      disabled={isSubmitting}
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
                      {action === "edit" ? "Update" : "Save"}
                    </LoadingButton>
                  </div>
                </div>
              </SheetTitle>
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>

            <h1 className="font-semibold text-xl py-3">Exercise Details</h1>
            <div className="grid grid-cols-3 gap-4 p-1">
              {Exercise_info.map((item) => {
                if (item.type === "slider") {
                  return (
                    <DifficultySlider
                      id="difficulty"
                      value={valueofDifficulty} // Use the Difficulty enum directly
                      onChange={(value) => {
                        handleChange(value); // Ensure the field's onChange is called
                      }}
                    />
                  );
                }
                if (item.type === "text") {
                  return (
                    <div key={item.name} className="relative">
                      <FloatingLabelInput
                        id={item.name}
                        label={item.label}
                        maxLength={item.maxlength ?? 0}
                        {...register(
                          item.name as keyof createExerciseInputTypes,
                          {
                            required: item.required && "Required",
                            setValueAs: (value) => value.toLowerCase(),
                            maxLength: {
                              value: 40,
                              message: "Should be 40 characters or less",
                            },
                            pattern: item.pattern
                              ? {
                                  value: new RegExp(item.pattern),
                                  message: "Invalid format",
                                }
                              : undefined,
                          }
                        )}
                        error={
                          errors[item.name as keyof createExerciseInputTypes]
                            ?.message
                        }
                      />
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
                              onChange(selectedValues as (string | number)[]); // Update form state on value change
                              // Update form state on value change
                            }}
                            // Initialize the multi-select with default values
                            defaultValue={
                              Array.isArray(value)
                                ? (value as (string | number)[])
                                : []
                            } // Ensure defaultValue is always an array of the expected type
                            // Ensure defaultValue is always an array
                            placeholder={
                              "Select " + item.label.replace(/\*/g, "")
                            }
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
                          <>
                            <div>
                              <Select
                                onValueChange={(value) => {
                                  onChange(value);
                                }}
                                defaultValue={
                                  typeof value === "number"
                                    ? value.toString() // Convert numbers to strings
                                    : (value as string | undefined) // Ensure it's a string or undefined
                                }
                              >
                                <SelectTrigger
                                  floatingLabel={item.label}
                                  name={item.name}
                                >
                                  <SelectValue
                                    placeholder={
                                      "Select " + item.label.replace(/\*/g, "")
                                    }
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {item.options?.map(
                                    (st: any, index: number) => (
                                      <SelectItem
                                        key={index}
                                        value={String(st.value)}
                                      >
                                        {st.label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
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
                <Controller
                  name="imagemale"
                  control={control}
                  defaultValue={[]}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <FileUploader
                        value={field.value}
                        onValueChange={(files: File[] | null) => {
                          // Pass files or null depending on whether files exist
                          field.onChange(files ?? null);
                        }}
                        dropzoneOptions={dropzone}
                      >
                        {field.value && field.value.length > 0 ? (
                          field.value.map((file, i) => (
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
                                    // src="https://uploads.fitnfi.com/images/background.png"
                                    alt={file.name}
                                    className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
                                  />
                                </FileUploaderItem>
                              </FileUploaderContent>
                            </div>
                          ))
                        ) : existingMaleImage &&
                          existingMaleImage.length > 0 ? (
                          <div className="h-40">
                            <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                              <FileUploaderItem
                                className="h-full p-0 rounded-md overflow-hidden relative"
                                index={1}
                                onRemove={handleRemoveImage(
                                  setExistingMaleImage
                                )}
                              >
                                <img
                                  src={
                                    existingMaleImage
                                      ? `${VITE_VIEW_S3_URL}/${existingMaleImage}`
                                      : ""
                                  }
                                  alt="Existing Male Image"
                                  className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
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
                                  Drop your image here or{" "}
                                  <span className="underline text-blue-500">
                                    Browse
                                  </span>
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
                      {error && (
                        <p className="text-red-500 text-sm mt-2">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="w-[33%]">
                <h1 className="m-2 font-semibold"> Female Image</h1>
                <Controller
                  name="imagefemale"
                  control={control}
                  defaultValue={[]}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <FileUploader
                        value={field.value}
                        onValueChange={(files: File[] | null) => {
                          // Pass files or null depending on whether files exist
                          field.onChange(files ?? null);
                        }}
                        dropzoneOptions={dropzone}
                      >
                        {field.value && field.value.length > 0 ? (
                          field.value.map((file, i) => (
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
                                    className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
                                  />
                                </FileUploaderItem>
                              </FileUploaderContent>
                            </div>
                          ))
                        ) : existingFemaleImage &&
                          existingFemaleImage.length > 0 ? (
                          <div className="h-40">
                            <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                              <FileUploaderItem
                                className="h-full p-0 rounded-md overflow-hidden relative"
                                index={1}
                                onRemove={handleRemoveImage(
                                  setExistingFemaleImage
                                )}
                              >
                                <img
                                  src={
                                    existingFemaleImage
                                      ? `${VITE_VIEW_S3_URL}/${existingFemaleImage}`
                                      : ""
                                  }
                                  alt="Existing Female Image"
                                  className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
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
                                  Drop your image here or{" "}
                                  <span className="underline text-blue-500">
                                    Browse
                                  </span>
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
                      {error && (
                        <p className="text-red-500 text-sm mt-2">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="w-[33%]">
                <h1 className="m-2 font-semibold">Upload Gif*</h1>
                <Controller
                  name="gif"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: existingGIf ? false : "Required" }}
                  // rules={{ required: "Required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <FileUploader
                        value={field.value}
                        onValueChange={(files: File[] | null) => {
                          // Pass files or null depending on whether files exist
                          field.onChange(files ?? null);
                        }}
                        dropzoneOptions={dropzoneGif}
                      >
                        {field.value && field.value.length > 0 ? (
                          field.value.map((file, i) => (
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
                                    className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
                                  />
                                </FileUploaderItem>
                              </FileUploaderContent>
                            </div>
                          ))
                        ) : existingGIf && existingGIf.length > 0 ? (
                          <div className="h-40">
                            <FileUploaderContent className="flex items-center justify-center flex-row gap-2 bg-gray-100">
                              <FileUploaderItem
                                className="h-full p-0 rounded-md overflow-hidden relative"
                                index={1}
                                onRemove={handleRemoveImage(setExistingGif)}
                              >
                                <img
                                  src={
                                    existingGIf
                                      ? `${VITE_VIEW_S3_URL}/${existingGIf}`
                                      : ""
                                  }
                                  alt="Existing GIF"
                                  className="object-contain max-h-40 border-dashed border-2 border-primary h-72 p-2"
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
                                  Drop your Gif here or{" "}
                                  <span className="underline text-blue-500">
                                    Browse
                                  </span>
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
                      {error && (
                        <p className="text-red-500 text-sm mt-2">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="my-5">
              <h1 className="font-bold text-xl">Exercise Type :</h1>
              {Exercise_info.map((item) => {
                if (item.type === "radio") {
                  return (
                    <div key={item.name} className="relative">
                      <Controller
                        name={item.name as keyof createExerciseInputTypes}
                        rules={{ required: "Required" }}
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <div>
                            <RadioGroup
                              onValueChange={onChange}
                              defaultValue={
                                value != null ? String(value) : undefined
                              }
                              className="flex flex-row space-x-4"
                            >
                              {item.options?.map(
                                (option: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-start items-center space-x-3"
                                  >
                                    <RadioGroupItem
                                      value={String(option.value)}
                                    />
                                    <label>{option.label}</label>
                                  </div>
                                )
                              )}
                            </RadioGroup>
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
              <div className="relative pt-6">
                {mode === ExerciseTypeEnum.time_based && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Sets:</h3>

                    {timeFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="mb-4 gap-2 flex items-center"
                      >
                        <Controller
                          name={`timePerSet.${index}.value` as const}
                          control={control}
                          rules={{
                            required: "Required",
                            validate: {
                              positiveInteger: (value) =>
                                value !== null &&
                                value !== undefined &&
                                value >= 10 &&
                                value <= 3600
                                  ? true
                                  : "The accepted values are between 10 to 3600",
                            },
                          }}
                          render={({ field }) => (
                            <div>
                              <FloatingLabelInput
                                label={"Time(s)*"}
                                type="number"
                                id={`time-${index}`}
                                {...field}
                                className={`border${
                                  errors?.timePerSet?.[index]
                                    ? "border-red-500"
                                    : ""
                                }`}
                                min="1"
                                value={field.value ?? ""}
                              />
                              {errors?.timePerSet?.[index] && (
                                <span
                                  className="text-red-500 mr-4 text-xs pt-2"
                                  style={{
                                    width: "200px",
                                    display: "inline-block",
                                  }}
                                >
                                  {errors.timePerSet[index]?.value?.message}
                                </span>
                              )}
                            </div>
                          )}
                        />

                        <Controller
                          name={`restPerSet.${index}.value` as const}
                          control={control}
                          rules={{
                            required: "Required",
                            validate: {
                              positiveInteger: (value) =>
                                value !== null &&
                                value !== undefined &&
                                value >= 0 &&
                                value <= 3600
                                  ? true
                                  : "The accepted values are between 0 to 3600",
                            },
                          }}
                          render={({ field }) => (
                            <div>
                              <FloatingLabelInput
                                label={"Rest Time (s)*"}
                                id={`rest-time-${index}`}
                                type="number"
                                {...field}
                                className={`border${
                                  errors?.restPerSet?.[index]
                                    ? "border-red-500"
                                    : ""
                                }`}
                                min="1"
                                value={field.value ?? ""}
                              />
                              {errors?.restPerSet?.[index] && (
                                <span
                                  className="text-red-500 mr-4 text-xs pt-2"
                                  style={{
                                    width: "200px",
                                    display: "inline-block",
                                  }}
                                >
                                  {errors.restPerSet[index]?.value?.message}
                                </span>
                              )}
                            </div>
                          )}
                        />
                        <Button
                          variant={"ghost"}
                          type="button"
                          onClick={() => {
                            appendTime({ value: null }, { shouldFocus: false });
                            appendRest({ value: null }, { shouldFocus: false });
                          }}
                          className="text-primary gap-2 items-center justify-center px-4 py-2 rounded hover:bg-primary"
                        >
                          Add <i className="fa-solid fa-plus"></i>
                        </Button>
                        {
                          <button
                            type="button"
                            onClick={() => {
                              removeTime(index);
                              removeRest(index);
                            }}
                            disabled={timeFields.length <= 1}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i
                              className={`fa-solid fa-trash ${
                                timeFields.length <= 1
                                  ? "text-red-300 cursor-not-allowed"
                                  : "text-red-500"
                              }`}
                            />
                          </button>
                        }
                      </div>
                    ))}
                  </div>
                )}
                {mode === ExerciseTypeEnum.repetition_based && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Sets:</h3>
                    {repetitionFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="mb-4 gap-2 flex items-center"
                      >
                        <Controller
                          name={`repetitionPerSet.${index}.value` as const}
                          control={control}
                          rules={{
                            required: "Required",
                            validate: {
                              withinRange: (value) =>
                                value !== null &&
                                value !== undefined &&
                                value >= 1 &&
                                value <= 100
                                  ? true
                                  : "The accepted values are 1 to 100",
                            },
                          }}
                          render={({ field }) => (
                            <div>
                              <FloatingLabelInput
                                type="number"
                                label="Repetitions(x)*"
                                id={`repitition-time-${index}`}
                                {...field}
                                className={`border ${
                                  errors?.repetitionPerSet?.[index]
                                    ? "border-red-500"
                                    : ""
                                }`}
                                min="1"
                                value={field.value ?? ""}
                              />
                              {errors?.repetitionPerSet?.[index] && (
                                <span
                                  className="text-red-500 mr-4 text-xs pt-2"
                                  style={{
                                    width: "200px",
                                    display: "inline-block",
                                  }}
                                >
                                  {
                                    errors.repetitionPerSet[index]?.value
                                      ?.message
                                  }
                                </span>
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          name={`restPerSetrep.${index}.value` as const}
                          control={control}
                          rules={{
                            required: "Required",
                            validate: {
                              positiveInteger: (value) =>
                                value !== null &&
                                value !== undefined &&
                                value >= 0 &&
                                value <= 3600
                                  ? true
                                  : "The accepted values are between 0 to 3600",
                            },
                          }}
                          render={({ field }) => (
                            <div>
                              <FloatingLabelInput
                                label={"Rest Time (s)*"}
                                type="number"
                                id={`rest-time-${index}`}
                                {...field}
                                className={`border ${
                                  errors?.restPerSetrep?.[index]
                                    ? "border-red-500"
                                    : ""
                                }`}
                                min="1"
                                value={field.value ?? ""}
                              />
                              {errors?.restPerSetrep?.[index] && (
                                <span
                                  className="text-red-500 mr-4 text-xs pt-2"
                                  style={{
                                    width: "200px",
                                    display: "inline-block",
                                  }}
                                >
                                  {errors.restPerSetrep[index]?.value?.message}
                                </span>
                              )}
                            </div>
                          )}
                        />
                        <Button
                          variant={"ghost"}
                          type="button"
                          onClick={() => {
                            appendRepetition(
                              { value: null },
                              { shouldFocus: false }
                            );
                            appendRestrep(
                              { value: null },
                              { shouldFocus: false }
                            );
                          }}
                          className="text-primary gap-2 items-center justify-center px-4 py-2 rounded hover:bg-primary"
                        >
                          Add <i className="fa-solid fa-plus"></i>
                        </Button>
                        {
                          <button
                            type="button"
                            disabled={repetitionFields.length <= 1}
                            onClick={() => {
                              removeRepetition(index);
                              removeRestrep(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i
                              className={`fa-solid fa-trash ${
                                repetitionFields.length <= 1
                                  ? "text-red-300 cursor-not-allowed"
                                  : "text-red-500"
                              }`}
                            />
                          </button>
                        }
                      </div>
                    ))}
                  </div>
                )}
                {watcher.exercise_type === ExerciseTypeEnum.time_based ? (
                  <>
                    <div className="relative">
                      <div className="flex gap-4">
                        <Controller
                          control={form.control}
                          name="met_id"
                          render={({ field, fieldState }) => (
                            <Popover modal={true}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between font-normal",
                                    !field.value &&
                                      "font-medium text-gray-400 focus:border-primary"
                                  )}
                                >
                                  {field.value
                                    ? MetsData?.find(
                                        (mets: baseExerciseApiResponse) =>
                                          mets.value === field.value
                                      )?.label
                                    : "MET"}
                                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandList>
                                    <CommandInput placeholder="Select Metabolism" />
                                    <CommandEmpty>
                                      No Metabolism found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {MetsData?.map(
                                        (mets: baseExerciseApiResponse) => (
                                          <CommandItem
                                            value={mets.label}
                                            key={mets.value}
                                            onSelect={() =>
                                              field.onChange(mets.value)
                                            }
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                                mets.value === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {mets.label}
                                          </CommandItem>
                                        )
                                      )}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        <Controller
                          control={form.control}
                          name="distance"
                          render={({ field, fieldState }) => (
                            <FloatingLabelInput
                              {...field}
                              type="number"
                              id="distance"
                              label="Distance(KM)"
                            />
                          )}
                        />
                        <Controller
                          control={form.control}
                          name="speed"
                          render={({ field, fieldState }) => (
                            <FloatingLabelInput
                              {...field}
                              id="speed"
                              type="number"
                              label="Speed(KM/H)"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Controller
                        control={form.control}
                        name="exercise_intensity"
                        render={({ field }) => (
                          <div className="flex gap-4 w-full justify-start items-start flex-col">
                            <div className="font-bold text-xl">
                              Other Details:
                            </div>
                            <div className="flex flex-row gap-2 justify-start items-center w-full">
                              {Object.values(IntensityEnum).map((value) => (
                                <label key={value}>
                                  <input
                                    type="radio"
                                    value={value}
                                    checked={field.value === value}
                                    onChange={field.onChange}
                                    className="mr-2 checked:bg-primary"
                                  />
                                  {value === "irm"
                                    ? `${value.toUpperCase()}%`
                                    : value}
                                </label>
                              ))}
                              {field.value === "irm" && (
                                <Controller
                                  control={form.control}
                                  name="intensity_value"
                                  render={({ field, fieldState }) => (
                                    <>
                                      <Slider
                                        value={[field.value as number]} // Slider expects an array for the value
                                        onValueChange={(val) => {
                                          field.onChange(val[0]);
                                          setCurrentValue(val[0]);
                                        }} // Update the field with the first value as an integer
                                        max={100}
                                        className="w-[30%]"
                                        step={1} // Step set to 1 for integer values
                                      />
                                      {currentValue + "%"}
                                    </>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default ExerciseForm;
