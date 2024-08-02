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
import { Switch } from "@/components/ui/switch";
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
  FormLabel,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  CountryTypes,
  ErrorType,
  getRolesType,
  sourceTypes,
  StaffInputType,
} from "@/app/types";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Label } from "@/components/ui/label";
import {
  useGetAllSourceQuery,
  useGetCountriesQuery,
} from "@/services/memberAPi";
import { useGetRolesQuery } from "@/services/rolesApi";
import {
  useAddStaffMutation,
  useGetStaffByIdQuery,
  useGetStaffCountQuery,
  useUpdateStaffMutation,
} from "@/services/staffsApi";

enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}

export enum statusEnum {
  pending = "pending",
  active = "active",
  inactive = "inactive",
}

const StaffForm: React.FC = () => {
  const { id } = useParams();
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    data: EditStaffData,
    isLoading: editLoading,
    refetch: editRefetch,
  } = useGetStaffByIdQuery(Number(id), {
    skip: isNaN(Number(id)),
  });

  const initialState: StaffInputType = {
    profile_img:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    gender: genderEnum.male,
    org_id: orgId,
    own_staff_id: "",
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    role_id: 0,
    source_id: 0,
    country_id: 0,
    city: "",
    status: statusEnum.pending,
  };

  const [initialValues, setInitialValues] =
    React.useState<StaffInputType>(initialState);

  const FormSchema = z.object({
    profile_img: z
      .string()
      .trim()
      .default(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      )
      .optional(),
    own_staff_id: z.string({
      required_error: "Required",
    }),
    first_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .min(3, { message: "Required" }),
    last_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .min(3, { message: "Required" }),
    gender: z.nativeEnum(genderEnum, {
      required_error: "You need to select a gender type.",
    }),
    dob: z.coerce
      .string({
        required_error: "Required",
      })
      .refine((value) => value.trim() !== "", {
        message: "Required",
      }),
    email: z.string().min(1, { message: "Required" }).email("invalid email"),
    phone: z
      .string()
      .max(11, {
        message: "Cannot be greater than 11 digits",
      })
      .trim()
      .optional(),
    mobile_number: z
      .string()
      .max(11, {
        message: "Cannot be greater than 11 digits",
      })
      .trim()
      .optional(),
    notes: z.string().optional(),
    source_id: z.coerce
      .number({
        required_error: "Source Required.",
      })
      .refine((value) => value !== 0, {
        message: "Required",
      }),
    country_id: z.coerce
      .number({
        required_error: "Country Required.",
      })
      .refine((value) => value !== 0, {
        message: "Required",
      }),
    status: z.nativeEnum(statusEnum, {
      required_error: "You need to select a status.",
    }),
    city: z.string().optional(),
    zipcode: z.string().trim().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    org_id: z
      .number({
        required_error: "Required",
      })
      .default(orgId),
    role_id: z
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0, {
        message: "Required",
      }),
    send_invitation: z.boolean().default(true).optional(),
  });

  const { data: roleData } = useGetRolesQuery(orgId);
  const { data: countries } = useGetCountriesQuery();
  const { data: sources } = useGetAllSourceQuery();
  const { data: staffCount } = useGetStaffCountQuery(orgId, {
    skip: id == undefined ? false : true,
  });
  const { data: EditstaffData } = useGetStaffByIdQuery(Number(id), {
    skip: isNaN(Number(id)),
  });
  const [addStaff, { isLoading: staffLoading }] = useAddStaffMutation();
  const [editStaff, { isLoading: editStaffLoading }] = useUpdateStaffMutation();

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
      ...initialState,
    },
    mode: "onChange",
  });

  const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
    };
    console.log("Updated data with only date:", updatedData);
    console.log("only once", data);

    try {
      if (id == undefined || id == null) {
        const resp = await addStaff(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Staff Created Successfully",
          });
          navigate("/admin/staff");
        }
      } else {
        const resp = await editStaff({
          ...updatedData,
          id: Number(id),
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Staff Updated Successfully",
          });
          navigate("/admin/staff");
        }
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

  function gotoStaff() {
    navigate("/admin/staff");
  }

  React.useEffect(() => {
    if (!EditStaffData) {
      if (orgName) {
        const total = staffCount?.total_staffs as number;
        if (total >= 0) {
          form.setValue("own_staff_id", `${orgName.slice(0, 2)}-S${total + 1}`);
        }
      }
    } else {
      setInitialValues(EditStaffData as StaffInputType);
      form.reset(EditStaffData);
    }
  }, [EditStaffData, orgName, staffCount]);

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
                      onClick={gotoStaff}
                      disabled={staffLoading || editStaffLoading}
                      className="gap-2 bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                      loading={staffLoading || editStaffLoading}
                      disabled={staffLoading || editStaffLoading}
                    >
                      {!(staffLoading || editStaffLoading) && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Staff Data</h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="own_staff_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_staff_id"
                          label="Gym Staff Id"
                          disabled
                        />
                        {watcher.own_staff_id ? <></> : <FormMessage />}
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
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: genderEnum) =>
                            form.setValue("gender", value)
                          }
                          value={field.value as genderEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Gender*"
                              className={`text-black`}
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
                        <FormMessage />
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
                                        format(field.value, "dd-MM-yyyy")
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
                                  selected={new Date(field.value)}
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
                          disabled={id != undefined}
                        />
                        {watcher.email ? <></> : <FormMessage />}
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
                          label="Notes"
                        />
                        <FormMessage />
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
                              floatingLabel="Source*"
                              className={`${watcher.source_id ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue>
                                {field.value === 0
                                  ? "Select Source*"
                                  : sources?.find(
                                      (source) => source.id === field.value
                                    )?.source || "Select Source*"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString() || "0"}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Role*"
                              className={`${watcher.role_id ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue>
                                {field.value === 0
                                  ? "Select Role*"
                                  : roleData?.find(
                                      (role) => role.role_id === field.value
                                    )?.role_name || "Select Role*"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleData && roleData.length > 0 ? (
                              roleData?.map((sourceval: getRolesType) => {
                                return (
                                  <SelectItem
                                    key={sourceval.role_id}
                                    value={sourceval.role_id?.toString()}
                                  >
                                    {sourceval.role_name}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <>
                                <p className="p-2"> No Role Found</p>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        {watcher.role_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value: statusEnum) =>
                            form.setValue("status", value)
                          }
                          value={field.value as statusEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              disabled={field.value == "pending"}
                              floatingLabel="Status*"
                              className={`text-black`}
                            >
                              <SelectValue placeholder="Select Status*" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="active">active</SelectItem>
                            <SelectItem value="inactive">inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Address data</h1>
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
                        <FloatingLabelInput {...field} id="city" label="City" />
                        {watcher.city ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="h-full relative">
                  <FormField
                    control={form.control}
                    name="send_invitation"
                    defaultValue={true}
                    render={({ field }) => (
                      <FormItem className="h-10 flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Send invitation</FormLabel>
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

export default StaffForm;
