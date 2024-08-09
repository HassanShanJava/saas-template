import {
  Check,
  ChevronDownIcon,
  ImageIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { RxCross2 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { FiUpload } from "react-icons/fi";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  baseExerciseApiResponse,
  CategoryApiResponse,
  ErrorType,
} from "@/app/types";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { FaFileUpload } from "react-icons/fa";
import {
  useAddExerciseMutation,
  useGetAllCategoryQuery,
  useGetAllEquipmentsQuery,
  useGetAllJointsQuery,
  useGetAllMetQuery,
  useGetAllMuscleQuery,
} from "@/services/exerciseApi";
import { UploadCognitoImage } from "@/utils/lib/s3Service";
import { Sheet, SheetContent } from "@/components/ui/sheet";

enum difficultyEnum {
  Novice = "Novice",
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advance = "Advance",
  Expert = "Expert",
}

enum ExerciseTypeEnum {
  time_based = "Time Based",
  repetition_based = "Repetition Based",
}

enum IntensityEnum {
  irm = "irm",
  max_intensity = "Max Intensity",
}

enum VisibilityEnum {
  only_myself = "Only Myself",
  staff_of_my_club = "Staff of My Club",
  members_of_my_club = "Members of My Club",
  everyone_in_my_club = "Everyone in My Club",
}

interface ExerciseFormProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ isOpen, setOpen }) => {
  const [images, setImages] = React.useState({
    image_url_male: null as File | null,
    image_url_female: null as File | null,
    thumbnail_male: null as File | null,
    thumbnail_female: null as File | null,
  });
  const [previewUrls, setPreviewUrls] = React.useState({
    image_url_male: "",
    image_url_female: "",
    thumbnail_male: "",
    thumbnail_female: "",
  });
  const [entries, setEntries] = React.useState([{ time: "", restTime: "" }]);
  const [errors, setErrors] = React.useState<z.ZodError | null>(null);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const userId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.id) || 0;
  const { data: CategoryData } = useGetAllCategoryQuery();
  const { data: EquipmentData } = useGetAllEquipmentsQuery();
  const { data: MuscleData } = useGetAllMuscleQuery();
  const { data: JointsData } = useGetAllJointsQuery();
  const { data: MetsData } = useGetAllMetQuery();

  const [addExercise, { isLoading: ExerciseLoading }] =
    useAddExerciseMutation();
  const baseScehmaExercise = z.object({
    id: z.number(),
    name: z.string(),
  });

  const FormSchema = z.object({
    exercise_name: z.string({
      required_error: "Required",
    }),
    visible_for: z.nativeEnum(VisibilityEnum, {
      required_error: "Required",
    }),
    org_id: z
      .number({
        required_error: "Required",
      })
      .default(orgId),
    exercise_type: z.nativeEnum(ExerciseTypeEnum, {
      required_error: "Required",
    }),
    exercise_intensity: z
      .nativeEnum(IntensityEnum)
      .default(IntensityEnum.max_intensity),
    intensity_value: z.number().optional().default(0),
    difficulty: z.nativeEnum(difficultyEnum, {
      required_error: "Required",
    }),
    sets: z.coerce
      .number({
        required_error: "Required",
      })
      .default(entries.length),
    seconds_per_set: z.array(z.number().int()).default([]),
    repetitions_per_set: z.array(z.number().int()).default([]),
    rest_between_set: z.array(z.number().int()).default([]),
    distance: z.coerce.number().optional().default(0),
    speed: z.coerce.number().optional().default(0),
    met_id: z.coerce.number().optional().default(1),
    gif_url: z.string({
      required_error: "Required",
    }),
    video_url_male: z.string().optional().default(""),
    video_url_female: z.string().optional().default(""),
    thumbnail_male: z.string().optional().default(""),
    thumbnail_female: z.string().optional().default(""),
    image_url_female: z.string().optional().default(""),
    image_url_male: z.string().optional().default(""),
    category_id: z.coerce
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0 || isNaN(value), {
        message: "Required",
      })
      .default(0),
    equipment_ids: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    primary_muscle_ids: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    secondary_muscle_ids: z.array(baseScehmaExercise).optional(),
    primary_joint_ids: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    created_by: z
      .number({
        required_error: "Required",
      })
      .default(userId),
    updated_by: z
      .number({
        required_error: "Required",
      })
      .default(userId),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exercise_type: ExerciseTypeEnum.time_based,
      exercise_intensity: IntensityEnum.max_intensity,
      org_id: orgId, // Set the default value here
    },
    mode: "onChange",
  });

  const watcher = form.watch();

  type ImageType =
    | "image_url_male"
    | "image_url_female"
    | "thumbnail_male"
    | "thumbnail_female";

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: keyof typeof images
  ) => {
    const file = e.target.files?.[0];
    // Validate the file type
    if (
      file &&
      !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
    ) {
      toast({
        variant: "destructive",
        title: `Invalid file type for ${imageType}.`,
        description: "Only PNG, JPEG, JPG, and GIF are allowed.",
      });
      console.error(
        `Invalid file type for ${imageType}. Only PNG, JPEG, JPG, and GIF are allowed.`
      );
      return; // Exit if the file type is not allowed
    }
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrls((prevImages) => ({
        ...prevImages,
        [imageType]: objectUrl,
      }));

      setImages((prevFiles) => ({
        ...prevFiles,
        [imageType]: file,
      }));
    }
  };

  const uploadFile = async (
    type: ImageType
  ): Promise<{ type: ImageType; url: string } | null> => {
    const selectedFile = images[type];
    if (!selectedFile) {
      console.log(`No file selected for ${type}`);
      return null; // Return null if no file is selected
    }

    try {
      // Call the custom upload function and get the S3 URL
      const s3Response = await UploadCognitoImage(selectedFile);
      const s3Url = s3Response.location;

      // Return the structured data for this image
      return { type, url: s3Url as string };
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null; // Return null in case of an error
    }
  };

  const uploadAllFiles = async () => {
    if (!Object.values(images).some((file) => file !== null)) {
      console.log("No files selected for upload.");
      return;
    }

    const uploadResults = await Promise.all(
      Object.keys(images).map((type) => uploadFile(type as ImageType))
    );

    // Create an object to store the URLs
    const uploadedUrls = uploadResults.reduce<Record<ImageType, string>>(
      (acc, result) => {
        if (result) {
          acc[result.type] = result.url;
        }
        return acc;
      },
      {
        thumbnail_male: "",
        thumbnail_female: "",
        image_url_male: "",
        image_url_female: "",
      }
    );
    console.log("Upload Results:", uploadedUrls);
    return uploadedUrls;
  };

  const handleChange = (
    index: number,
    field: "time" | "restTime",
    value: string
  ) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { time: "", restTime: "" }]);
  };

  const removeEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const uploadedurl = await uploadAllFiles();
    // console.log(uploadedurl);
    let updatedData = {
      ...data,
      equipment_ids: data.equipment_ids.map((equipment) => equipment.id),
      primary_muscle_ids: data.primary_muscle_ids.map((muscle) => muscle.id),
      secondary_muscle_ids: data.secondary_muscle_ids?.map(
        (muscle) => muscle.id
      ),
      primary_joint_ids: data.primary_joint_ids.map((joints) => joints.id),
      ...uploadedurl,
    };

    const times = entries
      .map((entry) => Number(entry.time))
      .filter((num) => !isNaN(num));
    const restTimes = entries
      .map((entry) => Number(entry.restTime))
      .filter((num) => !isNaN(num));
    if (updatedData.exercise_type === ExerciseTypeEnum.time_based) {
      updatedData = {
        ...updatedData,
        seconds_per_set: times, // or actual data if available
        rest_between_set: restTimes, // or actual data if available
      };
    } else if (updatedData.exercise_type) {
      updatedData = {
        ...updatedData,
        rest_between_set: times, // or actual data if available
        repetitions_per_set: restTimes, // or actual data if available
      };
    }

    console.log("DATA", data);
    console.log("Updated Data", updatedData);
    // console.log("images", images);
    try {
      if (true) {
        const resp = await addExercise(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Exercise Created Successfully ",
          });
          navigate("/admin/exercise");
        }
      } else {
        toast({
          variant: "success",
          title: "Exercise Updated Successfully ",
        });
      }
    } catch (error: unknown) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description:
            typeof typedError.data?.detail === "object"
              ? "required missing fields"
              : typedError.data?.detail,
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

  function gotoExercise() {
    navigate("/admin/exercise");
  }

  return (
    <Sheet open={isOpen}>
      <SheetContent hideCloseButton className="!max-w-[1050px]">
        <div className="p-6 bg-bgbackground">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <p className="text-lg font-bold text-black">
                    Exercise Details
                  </p>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Button
                      type={"button"}
                      onClick={gotoExercise}
                      className="gap-2 bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                    >
                      {!(true || true) && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="exercise_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="exercise_name"
                          label="Exercise Name*"
                        />
                        {watcher.exercise_name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="visible_for"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: VisibilityEnum) =>
                            form.setValue("visible_for", value)
                          }
                          value={field.value as VisibilityEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Visible for*"
                              className={`${watcher.visible_for ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue placeholder="Select Visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Only Myself">
                              Only Myself
                            </SelectItem>
                            <SelectItem value="Staff of My Club">
                              Staff of My Club
                            </SelectItem>
                            <SelectItem
                              value="Members of
                            My Club"
                            >
                              Members of My Club
                            </SelectItem>
                            <SelectItem
                              value="Everyone in My
                            Club"
                            >
                              Everyone in My Club
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {watcher.visible_for ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value &&
                                    "font-medium text-gray-400 focus:border-primary "
                                )}
                              >
                                {field.value
                                  ? CategoryData?.find(
                                      (category: baseExerciseApiResponse) =>
                                        category.id === field.value // Compare with numeric value
                                    )?.name // Display category name if selected
                                  : "Select Category*"}
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Select Category" />
                                <CommandEmpty>No Category found.</CommandEmpty>
                                <CommandGroup>
                                  {CategoryData &&
                                    CategoryData.map(
                                      (Category: baseExerciseApiResponse) => (
                                        <CommandItem
                                          value={Category.name}
                                          key={Category.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "category_id",
                                              Category.id
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                              Category.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {Category.name}{" "}
                                        </CommandItem>
                                      )
                                    )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {watcher.category_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: difficultyEnum) =>
                            form.setValue("difficulty", value)
                          }
                          value={field.value as difficultyEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Select difficulty*"
                              className={`${watcher.difficulty ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue placeholder="Select Difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Novice">Novice</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advance">Advance</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        {watcher.difficulty ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="equipment_ids"
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
                                field.value?.length >= 1
                                  ? ""
                                  : "Select Equipments"
                              }
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {EquipmentData &&
                                EquipmentData.map((user: any) => (
                                  <MultiSelectorItem key={user.id} value={user}>
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
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="primary_muscle_ids"
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
                                field.value?.length >= 1
                                  ? ""
                                  : "Select Primary Muscles"
                              }
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {MuscleData &&
                                MuscleData.map((user: any) => (
                                  <MultiSelectorItem key={user.id} value={user}>
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
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="secondary_muscle_ids"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <MultiSelector
                          onValuesChange={(values) => field.onChange(values)}
                          values={field.value || []}
                        >
                          <MultiSelectorTrigger className="border-[1px] border-gray-300">
                            <MultiSelectorInput
                              className="font-medium"
                              placeholder={
                                field.value?.length && field.value?.length >= 1
                                  ? ""
                                  : "Select Secondary Muscles"
                              }
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {MuscleData &&
                                MuscleData.map((user: any) => (
                                  <MultiSelectorItem key={user.id} value={user}>
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
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="primary_joint_ids"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <MultiSelector
                          onValuesChange={(values) => field.onChange(values)}
                          values={field.value || []}
                        >
                          <MultiSelectorTrigger className="border-[1px] border-gray-300">
                            <MultiSelectorInput
                              className="font-medium"
                              placeholder={
                                field.value?.length && field.value?.length >= 1
                                  ? ""
                                  : "Select Primary Joints"
                              }
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {JointsData &&
                                JointsData.map((user: any) => (
                                  <MultiSelectorItem key={user.id} value={user}>
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
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="gif_url"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="gif_url"
                          label="GIF URL"
                        />
                        {watcher.gif_url ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="video_url_female"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="video_url_female"
                          label="Youtube Link : Female"
                        />
                        {watcher.video_url_female ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="video_url_male"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="video_url_male"
                          label="Youtube Link : Male"
                        />
                        {watcher.video_url_male ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-4/5 flex justify-start gap-4 items-start">
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Images Section */}
                  <div>
                    <h3 className="text-lg font-semibold">Images</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-100 p-5 rounded-lg">
                      {/* Male Image */}
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          {images.image_url_male ? (
                            <img
                              src={previewUrls.image_url_male}
                              alt="Male"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 gap-2 border-dashed border-2 text-xs"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="male-image-upload"
                            onChange={(e) =>
                              handleImageChange(e, "image_url_male")
                            }
                          />
                          <label
                            htmlFor="male-image-upload"
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <FiUpload className="text-primary w-5 h-5" /> Image
                            - Male
                          </label>
                        </Button>
                      </div>
                      {/* Female Image */}
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          {images.image_url_female ? (
                            <img
                              src={previewUrls.image_url_female}
                              alt="Female"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="gap-2 mt-2 text-xs border-dashed border-2"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="female-image-upload"
                            onChange={(e) =>
                              handleImageChange(e, "image_url_female")
                            }
                          />
                          <label
                            htmlFor="female-image-upload"
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <FiUpload className="text-primary w-5 h-5" />
                            Image - Female
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails Section */}
                  <div>
                    <h3 className="text-lg font-semibold">Thumbnail</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-100 p-5 rounded-lg">
                      {/* Male Thumbnail */}
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          {images.thumbnail_male ? (
                            <img
                              src={previewUrls.thumbnail_male}
                              alt="Male Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 text-xs border-dashed gap-2 border-2"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="male-thumbnail-upload"
                            onChange={(e) =>
                              handleImageChange(e, "thumbnail_male")
                            }
                          />
                          <label
                            htmlFor="male-thumbnail-upload"
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <FiUpload className="text-primary w-5 h-5" />
                            Thumbnail - Male
                          </label>
                        </Button>
                      </div>
                      {/* Female Thumbnail */}
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          {images.thumbnail_female ? (
                            <img
                              src={previewUrls.thumbnail_female}
                              alt="Female Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 text-xs gap-2 border-dashed border-2"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="female-thumbnail-upload"
                            onChange={(e) =>
                              handleImageChange(e, "thumbnail_female")
                            }
                          />
                          <label
                            htmlFor="female-thumbnail-upload"
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <FiUpload className="text-primary w-5 h-5" />
                            Thumbnail - Female
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-3 justify-start items-center">
                {/* <div className="relative">
                  <FormField
                    control={form.control}
                    name="exercise_type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-4 w-full">
                          Exercise Type:
                          {Object.values(ExerciseTypeEnum).map((value) => (
                            <label key={value}>
                              <input
                                type="radio"
                                value={value} // Use the enum value here
                                checked={field.value === value}
                                onChange={field.onChange}
                                className="mr-2"
                              />
                              {value}
                            </label>
                          ))}
                        </div>

                        {watcher.exercise_type ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div> */}
              </div>
              <div className="relative">
                {entries.map((entry, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex gap-2">
                      <label className="block font-semibold">
                        <input
                          type="text"
                          value={entry.time}
                          // watcher.exercise_type ===
                          //   ExerciseTypeEnum.time_based
                          placeholder={true ? "Time (s)*" : "Repetition (x)*"}
                          onChange={(e) =>
                            handleChange(index, "time", e.target.value)
                          }
                          required={watcher.gif_url ? true : false}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                      {errors?.issues.find(
                        (issue) =>
                          issue.path[0] === index && issue.path[1] === "time"
                      )?.message && (
                        <div className="text-red-500 text-sm">
                          {
                            errors.issues.find(
                              (issue) =>
                                issue.path[0] === index &&
                                issue.path[1] === "time"
                            )?.message
                          }
                        </div>
                      )}
                      <label className="block font-semibold">
                        <input
                          type="text"
                          value={entry.restTime}
                          placeholder="Rest time(s)*"
                          required={watcher.gif_url ? true : false}
                          onChange={(e) =>
                            handleChange(index, "restTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                      {errors?.issues.find(
                        (issue) =>
                          issue.path[0] === index &&
                          issue.path[1] === "restTime"
                      )?.message && (
                        <div className="text-red-500 text-sm">
                          {
                            errors.issues.find(
                              (issue) =>
                                issue.path[0] === index &&
                                issue.path[1] === "restTime"
                            )?.message
                          }
                        </div>
                      )}
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={addEntry}
                        className="text-black rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 gap-2 justify-center items-center flex"
                      >
                        <PlusIcon className="h-5 w-5 text-black" /> Add a Set
                      </Button>
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEntry(index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* watcher.exercise_type === ExerciseTypeEnum.time_based */}
                {true ? (
                  <>
                    {/* <div className="relative">
                      {
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name="met"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "justify-between font-normal",
                                          !field.value &&
                                            "font-medium text-gray-400 focus:border-primary "
                                        )}
                                      >
                                        {field.value
                                          ? MetsData?.find(
                                              (mets: baseExerciseApiResponse) =>
                                                mets.id === field.value // Compare with numeric value
                                            )?.name // Display category name if selected
                                          : "MET"}
                                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0">
                                    <Command>
                                      <CommandList>
                                        <CommandInput placeholder="Select Metabolism" />
                                        <CommandEmpty>
                                          No Metabolism found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {MetsData &&
                                            MetsData.map(
                                              (
                                                mets: baseExerciseApiResponse
                                              ) => (
                                                <CommandItem
                                                  value={mets.name}
                                                  key={mets.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      "met",
                                                      mets.id
                                                    );
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                                      mets.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                  {mets.name}
                                                </CommandItem>
                                              )
                                            )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                {watcher.met ? <></> : <FormMessage />}
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => (
                              <FormItem>
                                <FloatingLabelInput
                                  {...field}
                                  type="number"
                                  id="distance"
                                  label="Distance(KM)"
                                />
                                {watcher.distance ? <></> : <FormMessage />}
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="speed"
                            render={({ field }) => (
                              <FormItem>
                                <FloatingLabelInput
                                  {...field}
                                  id="speed"
                                  type="number"
                                  label="speed(KM/H)"
                                />
                                {watcher.speed ? <></> : <FormMessage />}
                              </FormItem>
                            )}
                          />
                        </div>
                      }
                    </div> */}
                  </>
                ) : (
                  <>
                    {/* <div className="relative">
                      <FormField
                        control={form.control}
                        name="max_intensity"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-4 w-full justify-start items-center">
                              Exercise Type:
                              {Object.values(IntensityEnum).map((value) => (
                                <label key={value}>
                                  <input
                                    type="radio"
                                    value={value} // Use the enum value here
                                    checked={field.value === value}
                                    onChange={field.onChange}
                                    className="mr-2 checked:bg-primary"
                                  />
                                  {value}
                                </label>
                              ))}
                              {field.value == "irm" && (
                                <FormField
                                  control={form.control}
                                  name="irmValue"
                                  render={({ field }) => (
                                    <FormItem className="w-[10%]">
                                      <FloatingLabelInput
                                        {...field}
                                        id="irmValue"
                                        label="IRM*"
                                      />
                                      {watcher.irmValue ? (
                                        <></>
                                      ) : (
                                        <FormMessage />
                                      )}
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>

                            {watcher.max_intensity ? <></> : <FormMessage />}
                          </FormItem>
                        )}
                      />
                    </div> */}
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExerciseForm;
