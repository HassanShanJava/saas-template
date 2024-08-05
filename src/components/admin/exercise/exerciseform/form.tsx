import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
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
import { ErrorType } from "@/app/types";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { FaFileUpload } from "react-icons/fa";

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

enum VisibilityEnum {
  only_myself = "Only Myself",
  staff_of_my_club = "Staff of My Club",
  members_of_my_club = "Members of My Club",
  everyone_in_my_club = "Everyone in My Club",
}

const ExericeForm: React.FC = () => {
  const { id } = useParams();

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const membersSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const initialState: any = {};

  const FormSchema = z.object({
    exercise_name: z.string({
      required_error: "Required",
    }),
    exercise_type: z.nativeEnum(ExerciseTypeEnum, {
      required_error: "Required",
    }),
    difficulty: z.nativeEnum(difficultyEnum, {
      required_error: "Required",
    }),
    visibility: z.nativeEnum(VisibilityEnum, {
      required_error: "Required",
    }),
    gender: z.nativeEnum(genderEnum, {
      required_error: "Required",
    }),
    email: z.string().min(1, { message: "Required" }).email("invalid email"),
    notes: z.string().optional(),
    gif_url: z.string({
      required_error: "Required",
    }),
    youtube_male: z.string().optional(),
    youtube_female: z.string().optional(),
    sets: z.coerce.number().optional(),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const navigate = useNavigate();
  const [initialValues, setInitialValues] = React.useState<any>(initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exercise_type: ExerciseTypeEnum.time_based, // Set the default value here
    },
    mode: "onChange",
  });

  const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (true) {
        toast({
          variant: "success",
          title: "Coach Created Successfully ",
        });
        navigate("/admin/coach");
      } else {
        toast({
          variant: "success",
          title: "Coach Updated Successfully ",
        });
        navigate("/admin/coach");
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
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: VisibilityEnum) =>
                            form.setValue("visibility", value)
                          }
                          value={field.value as VisibilityEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Visible for*"
                              className={`${watcher.visibility ? "text-black" : "text-gray-500"}`}
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
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Exercise Category*"
                              className={`${watcher.gender ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent></SelectContent>
                        </Select>
                        <FormMessage />
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
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Equipment*"
                              className={`${watcher.gender ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent></SelectContent>
                        </Select>
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Primary Muscle"
                              className={`${watcher.gender ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Primary Muscle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent></SelectContent>
                        </Select>
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Secondary Muscle"
                              className={`${watcher.gender ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Secondary Muscle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent></SelectContent>
                        </Select>
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Primary Joint"
                              className={`${watcher.gender ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Primary Joint" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent></SelectContent>
                        </Select>
                        {<FormMessage />}
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
                    name="youtube_female"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="youtube_female"
                          label="Youtube Link : Female"
                        />
                        {watcher.youtube_female ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="youtube_male"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="youtube_male"
                          label="Youtube Link : Male"
                        />
                        {watcher.youtube_male ? <></> : <FormMessage />}
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
                <div className="w-[10%]">
                  <FormField
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput {...field} id="sets" label="Set*" />
                        {watcher.sets ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ExericeForm;
