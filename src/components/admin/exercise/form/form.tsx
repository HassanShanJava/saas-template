import { Check, ChevronDownIcon } from "lucide-react";
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

const ExericeForm: React.FC = () => {
  const { id } = useParams();

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const membersSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const initialState: any = {
    own_coach_id: "",
    gender: "male",
    email: "",
    notes: "",
    org_id: orgId,
  };
  const FormSchema = z.object({
    own_coach_id: z.string({
      required_error: "Required",
    }),
    gender: z
      .enum(["male", "female", "other"], {
        required_error: "You need to select a gender type.",
      })
      .default("male"),
    email: z.string().min(1, { message: "Required" }).email("invalid email"),
    notes: z.string().optional(),
    org_id: z
      .number({
        required_error: "Required",
      })
      .default(orgId),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const navigate = useNavigate();
  const [initialValues, setInitialValues] = React.useState<any>(initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...initialState,
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

  function gotoCaoch() {
    navigate("/admin/coach");
  }

  // React.useEffect(() => {
  //   if (!EditCoachData) {
  //     if (orgName) {
  //       const total = coachCountData?.total_coaches as number;
  //       if (total >= 0) {
  //         form.setValue("own_coach_id", `${orgName.slice(0, 2)}-C${total + 1}`);
  //       }
  //     }
  //   } else {
  //     setInitialValues(EditCoachData as CoachInputTypes);
  //     form.reset(EditCoachData);
  //   }
  // }, [EditCoachData, coachCountData, orgName]);

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
                      onClick={gotoCaoch}
                      // disabled={memberLoading || editcoachLoading}
                      className="gap-2 bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                      // loading={memberLoading || editcoachLoading}
                      // disabled={memberLoading || editcoachLoading}
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
                    name="own_coach_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_coach_id"
                          label="Exercise Name*"
                        />
                        {watcher.own_coach_id ? <></> : <FormMessage />}
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
                              floatingLabel="Visible for*"
                              className={`${watcher.gender ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue placeholder="Select Visibility" />
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Add difficulty*"
                              className={`${watcher.gender ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue placeholder="Select Difficulty" />
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="notes"
                          label="GIF URL"
                        />
                        {watcher.notes ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="notes"
                          label="Youtube Link : Female"
                        />
                        {watcher.notes ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="notes"
                          label="Youtube Link : Male"
                        />
                        {watcher.notes ? <></> : <FormMessage />}
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
