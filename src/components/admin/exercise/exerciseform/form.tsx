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
  useGetAllCategoryQuery,
  useGetAllEquipmentsQuery,
  useGetAllJointsQuery,
  useGetAllMuscleQuery,
} from "@/services/exerciseApi";
import { watch } from "fs";

enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}

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
  maxIntensity = "maxIntensity",
  irm = "irm",
}

enum VisibilityEnum {
  only_myself = "Only Myself",
  staff_of_my_club = "Staff of My Club",
  members_of_my_club = "Members of My Club",
  everyone_in_my_club = "Everyone in My Club",
}

const ExericeForm: React.FC = () => {
  const { id } = useParams();
  const [entries, setEntries] = React.useState([{ time: "", restTime: "" }]);
  const [errors, setErrors] = React.useState<z.ZodError | null>(null);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { data: CategoryData } = useGetAllCategoryQuery();
  const { data: EquipmentData } = useGetAllEquipmentsQuery();
  const { data: MuscleData } = useGetAllMuscleQuery();
  const { data: JointsData } = useGetAllJointsQuery();

  const baseScehmaExercise = z.object({
    id: z.number(),
    name: z.string(),
  });

  // const initialState: any = {};
  const ExerciseTimeSchema = z.object({
    time: z.array(z.coerce.number()).nonempty("Required"),
    restTime: z.array(z.coerce.number()).nonempty("Required"),
  });

  const timeEntriesSchema = z.array(ExerciseTimeSchema);
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
    category_id: z.coerce
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0 || isNaN(value), {
        message: "Required",
      })
      .default(0),
    difficulty: z.nativeEnum(difficultyEnum, {
      required_error: "Required",
    }),
    equipments: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    primary_muscle_ids: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    secondary_muscle_ids: z.array(baseScehmaExercise).optional(),
    primary_joint_ids: z.array(baseScehmaExercise).nonempty({
      message: "Required",
    }),
    gif_url: z.string({
      required_error: "Required",
    }),
    video_url_male: z.string().optional(),
    video_url_female: z.string().optional(),
    thumbnail_male: z.string().optional(),
    thumbnail_female: z.string().optional(),
    image_url_female: z.string().optional(),
    image_url_male: z.string().optional(),
    exercise_type: z.nativeEnum(ExerciseTypeEnum, {
      required_error: "Required",
    }),
    timeEntriesSchema,
    distance: z.number().optional(),
    speed: z.number().optional(),
    max_intensity: z
      .nativeEnum(IntensityEnum)
      .default(IntensityEnum.maxIntensity),
    irmValue: z.number().optional(),
    met: z.coerce
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0 || isNaN(value), {
        message: "Required",
      })
      .default(0),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const navigate = useNavigate();
  // const [initialValues, setInitialValues] = React.useState<any>(initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exercise_type: ExerciseTypeEnum.time_based,
      max_intensity: IntensityEnum.maxIntensity, // Set the default value here
    },
    mode: "onChange",
  });

  const watcher = form.watch();

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
    try {
      if (true) {
        toast({
          variant: "success",
          title: "Exercise Created Successfully ",
        });
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

  function gotoExercise() {
    navigate("/admin/exercise");
  }

  return (
    <div className="p-6 bg-bgbackground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-7 px-4">
            <CardContent className="space-y-3">
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
                    name="equipments"
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
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
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
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
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
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
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
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
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
              <div className="w-4/5  flex justify-start gap-4items-start">
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Images</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-100 p-5 rounded-lg">
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 gap-2 border-dashed border-2 text-xs"
                        >
                          <FiUpload className="text-primary w-5 h-5" /> Image -
                          Male
                        </Button>
                      </div>
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <Button
                          variant="ghost"
                          className="gap-2 mt-2 text-xs border-dashed border-2"
                        >
                          <FiUpload className="text-primary w-5 h-5 " />
                          Image - Female
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Thumbnail</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-100 p-5 rounded-lg">
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 text-xs border-dashed gap-2 border-2"
                        >
                          <FiUpload className="text-primary w-5 h-5 " />
                          Thumbnail - Male
                        </Button>
                      </div>
                      <div className="justify-center items-center flex flex-col">
                        <div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-2 text-xs gap-2 border-dashed border-2"
                        >
                          <FiUpload className="text-primary w-5 h-5" />
                          Thumbnail - Female
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-3 justify-start items-center">
                <div className="relative">
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
                </div>
              </div>
              <div className="relative">
                {entries.map((entry, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex gap-2">
                      <label className="block font-semibold">
                        <input
                          type="text"
                          value={entry.time}
                          placeholder={
                            watcher.exercise_type ===
                            ExerciseTypeEnum.time_based
                              ? "Time (s)*"
                              : "Repetition (x)*"
                          }
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
                {watcher.exercise_type === ExerciseTypeEnum.time_based ? (
                  <>
                    <div className="relative">
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
                                          ? CategoryData?.find(
                                              (
                                                category: baseExerciseApiResponse
                                              ) => category.id === field.value // Compare with numeric value
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
                                          {CategoryData &&
                                            CategoryData.map(
                                              (
                                                Category: baseExerciseApiResponse
                                              ) => (
                                                <CommandItem
                                                  value={Category.name}
                                                  key={Category.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      "met",
                                                      Category.id
                                                    );
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                                      Category.id ===
                                                        field.value
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
                          <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => (
                              <FormItem>
                                <FloatingLabelInput
                                  {...field}
                                  id="distance"
                                  label="Distance"
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
                                  label="speed"
                                />
                                {watcher.speed ? <></> : <FormMessage />}
                              </FormItem>
                            )}
                          />
                        </div>
                      }
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
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
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ExericeForm;
