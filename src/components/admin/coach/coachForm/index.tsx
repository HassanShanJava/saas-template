import { format } from "date-fns";
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
import "react-phone-number-input/style.css";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { PlusIcon, CameraIcon, Webcam } from "lucide-react";
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
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { CountryTypes, ErrorType, sourceTypes } from "@/app/types";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import {
  useGetAllSourceQuery,
  useGetCountriesQuery,
} from "@/services/memberAPi";

import { useGetMembershipsQuery } from "@/services/membershipsApi";
import {
  useAddCoachMutation,
  useGetCoachByIdQuery,
  useGetCoachCountQuery,
  useGetMemberListQuery,
} from "@/services/coachApi";

const AddCoachForm: React.FC = () => {
  const { id } = useParams();
  const {
    data: EditCoachData,
    isLoading: editisLoading,
    refetch: editRefetch,
  } = useGetCoachByIdQuery(id);
  console.log("update the damn data", EditCoachData);
  // const [counter, setCounter] = React.useState(0);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const creator_id =
    useSelector((state: RootState) => state.auth.userInfo?.user?.id) || 0;

  const membersSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const FormSchema = z.object({
    profile_img: z
      .string()
      .trim()
      .default(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      )
      .optional(),
    own_coach_id: z.string({
      required_error: "Gym Coach Id Required.",
    }),
    first_name: z
      .string({
        required_error: "Firstname Required.",
      })
      .trim()
      .min(3, { message: "First Name Is Required." }),
    last_name: z
      .string({
        required_error: "Lastname Required.",
      })
      .trim()
      .min(3, { message: "Last Name Is Required" }),
    gender: z
      .enum(["male", "female", "other"], {
        required_error: "You need to select a gender type.",
      })
      .default("male"),
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    email: z
      .string()
      .min(1, { message: "Required." })
      .email("This is not a valid email."),
    phone: z
      .string()
      .max(11, {
        message: "Cannot be greater than 11 digits.",
      })
      .trim()
      .optional(),
    mobile_number: z
      .string()
      .max(11, {
        message: "Cannot be greater than 11 digits.",
      })
      .trim()
      .optional(),
    member_ids: z.array(membersSchema).nonempty({
      message: "Minimum one member must be assigned", // Custom error message
    }),
    coach_status: z
      .enum(["pending", "active", "inactive"], {
        required_error: "You need to select status.",
      })
      .default("pending"),
    notes: z.string().optional(),
    source_id: z
      .number({
        required_error: "Source Required.",
      })
      .refine((val) => val !== 0, {
        message: "Source is required",
      }),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    zipcode: z.string().trim().optional(),
    bank_name: z.string().trim().optional(),
    iban_no: z.string().trim().optional(),
    swift_code: z.string().trim().optional(),
    acc_holder_name: z.string().trim().optional(),
    country_id: z
      .number({
        required_error: "Country Required.",
      })
      .refine((val) => val !== 0, {
        message: "Country is required",
      }),
    city: z
      .string({
        required_error: "City Required.",
      })
      .trim()
      .min(3, {
        message: "City Required.",
      }),

    org_id: z
      .number({
        required_error: "Org id is required",
      })
      .default(orgId),
    created_by: z
      .number({
        required_error: "must send creater",
      })
      .default(creator_id),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const {
    data: coachCountData,
    isLoading,
    refetch,
  } = useGetCoachCountQuery(orgId);

  const { data: countries } = useGetCountriesQuery();
  const { data: sources } = useGetAllSourceQuery();

  const [addCoach, { isLoading: memberLoading }] = useAddCoachMutation();
  const { data: transformedData } = useGetMemberListQuery(orgId);
  const navigate = useNavigate();

  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSetAvatarClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      own_coach_id: "",
    },
    mode: "onChange",
  });

  const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log(JSON.stringify(data, null, 2));
    const updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
      member_ids: data.member_ids.map((member) => member.id),
    };

    console.log("Updated data with only date:", updatedData);
    console.log("only once", data);

    try {
      const resp = await addCoach(updatedData).unwrap();
      refetch();
      toast({
        variant: "success",
        title: "Coach Added Successfully ",
      });
      navigate("/admin/coach/");
    } catch (error: unknown) {
      console.log("Error", error);
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
    navigate("/admin/coach/");
  }

  React.useEffect(() => {
    if (orgName) {
      const total = coachCountData?.total_coaches as number;
      if (total >= 0 && id === undefined) {
        form.setValue("own_coach_id", `${orgName.slice(0, 2)}-C${total + 1}`);
      }
    }
  }, [coachCountData, orgName]);

  console.log("user list create", form.getValues);

  return (
    <div className="p-6 bg-bgbackground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-7 px-4">
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative flex">
                    <img
                      id="avatar"
                      src={avatar ? String(avatar) : "/profile-image.svg"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover mb-4 relative"
                    />
                    <CameraIcon className="w-8 h-8 text-black bg-primary rounded-full p-2 absolute top-8 left-14 " />
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    onClick={handleSetAvatarClick}
                    variant={"outline"}
                    type="button"
                    className="px-4 py-2 bg-transparent gap-2 text-black rounded hover:bg-primary hover:text-white"
                  >
                    <Webcam className="h-4 w-4" />
                    Profile Snapshot
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Button
                      type={"button"}
                      onClick={gotoCaoch}
                      disabled={memberLoading}
                      className="gap-2 bg-transparent border border-primary text-black hover:bg-red-300 hover:text-white"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                      loading={memberLoading}
                      disabled={memberLoading}
                    >
                      {!memberLoading && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Basic Information</h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative">
                  <FormField
                    control={form.control}
                    rules={{
                      validate: (value) => {
                        // Ensure value is treated as a number for comparison
                        return Number(value) !== 0 || "Source is required";
                      },
                    }}
                    name="own_coach_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_coach_id"
                          label="Gym Coach Id*"
                          disabled
                        />
                        {watcher.own_coach_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="first_name"
                          label="First Name*"
                        />
                        {watcher.first_name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="last_name"
                          label="Last Name*"
                        />
                        {watcher.last_name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="gender"
                    defaultValue="male"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: "male" | "female" | "other") =>
                            form.setValue("gender", value)
                          }
                          defaultValue="male"
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Gender*"
                              className={`${watcher.gender ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {watcher.gender ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <TooltipProvider>
                    <Tooltip>
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Date of Birth*</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </TooltipTrigger>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-2"
                                align="center"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown-buttons"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  fromYear={1960}
                                  toYear={2030}
                                  disabled={(date: any) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {watcher.dob ? <></> : <FormMessage />}
                          </FormItem>
                        )}
                      />
                      <TooltipContent>
                        <p>Date of Birth*</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Email Address*"
                        />
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="phone"
                          label="Landline Number"
                        />
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="mobile_number"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="mobile_number"
                          label="Mobile Number"
                        />
                        {watcher.mobile_number ? <></> : <FormMessage />}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="member_ids"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <MultiSelector
                          onValuesChange={(values) => field.onChange(values)}
                          values={field.value}
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Assignee Members*" />
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
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="coach_status"
                    defaultValue="pending"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          disabled
                          onValueChange={(
                            value: "pending" | "active" | "inactive"
                          ) => form.setValue("coach_status", value)}
                          defaultValue="pending"
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Status*"
                              className={`${watcher.coach_status ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Select Coach status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">active</SelectItem>
                            <SelectItem value="inactive">inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        {watcher.coach_status ? <></> : <FormMessage />}
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
                          label="Notes"
                        />
                        {watcher.notes ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="source_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || "0"} // Set default to "0" for the placeholder
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.source_id ? "text-black" : ""}`}
                            >
                              <SelectValue>
                                {field.value === 0
                                  ? "Source*"
                                  : sources?.find(
                                      (source) => source.id === field.value
                                    )?.source || "Source*"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* <SelectItem value="0">Select Source*</SelectItem>{" "} */}
                            {/* Placeholder option */}
                            {sources && sources.length ? (
                              sources.map((sourceval: sourceTypes, i: any) => (
                                <SelectItem
                                  value={sourceval.id?.toString()}
                                  key={i}
                                >
                                  {sourceval.source}
                                </SelectItem>
                              ))
                            ) : (
                              <p className="p-2">No Sources Found</p>
                            )}
                          </SelectContent>
                        </Select>
                        {watcher.source_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative "></div>
                <div className="relative ">
                  <div className="justify-start items-center flex"></div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Address</h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="address_1"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="address_1"
                          label="Street Address"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="address_2"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="address_2"
                          label="Extra Address"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="zipcode"
                          label="Zip Code"
                        />
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="country_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between !font-normal",
                                  !field.value &&
                                    "text-muted-foreground focus:border-primary "
                                )}
                              >
                                {field.value
                                  ? countries?.find(
                                      (country: CountryTypes) =>
                                        country.id === field.value // Compare with numeric value
                                    )?.country // Display country name if selected
                                  : "Select country*"}
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Select Country" />
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countries &&
                                    countries.map((country: CountryTypes) => (
                                      <CommandItem
                                        value={country.country}
                                        key={country.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "country_id",
                                            country.id // Set country_id to country.id as number
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                            country.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {country.country}{" "}
                                        {/* Display the country name */}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {watcher.country_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="city"
                          label="City*"
                        />
                        {watcher.city ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base">Bank Details</h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="bank_name"
                          label="Bank Name"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="iban_no"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="iban_no"
                          label="IBAN Number"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="swift_code"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="swift_code"
                          label="BIC/Swift Code"
                        />
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="acc_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="acc_holder_name"
                          label="Account Holder Name"
                        />
                        <FormMessage className="" />
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

export default AddCoachForm;
