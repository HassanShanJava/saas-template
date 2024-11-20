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
import "react-international-phone/style.css"; // Import the default styles for the phone input
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { CameraIcon, Webcam } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  CountryTypes,
  ErrorType,
  sourceTypes,
  StaffInputType,
  staffTypesResponseList,
} from "@/app/types";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import {
  useGetAllSourceQuery,
  useGetCountriesQuery,
} from "@/services/memberAPi";
import { useGetRolesQuery } from "@/services/rolesApi";
import {
  useAddStaffMutation,
  useGetStaffCountQuery,
  useUpdateStaffMutation,
} from "@/services/staffsApi";
import { UploadCognitoImage, deleteCognitoImage } from "@/utils/lib/s3Service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import profileimg from "@/assets/profile-image.svg";
import { Separator } from "@/components/ui/separator";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import { Info } from "lucide-react";
import { Gender } from "@/app/shared_enums/enums";
import { formatNIC } from "@/utils/helper";
const { VITE_VIEW_S3_URL } = import.meta.env;

export enum statusEnum {
  pending = "pending",
  active = "active",
  inactive = "inactive",
}
interface StaffFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  staffData: staffTypesResponseList | null;
  setStaffData: React.Dispatch<
    React.SetStateAction<staffTypesResponseList | null>
  >;
  refetch?: any;
}
const StaffForm: React.FC<StaffFormProps> = ({
  open,
  setOpen,
  staffData,
  setStaffData,
  refetch,
}) => {
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const initialState: StaffInputType = {
    profile_img: "",
    gender: Gender.Male,
    org_id: orgId,
    own_staff_id: "",
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    role_id: 0,
    source_id: 0,
    country_id: 0,
    phone: "",
    notes: "",
    address_1: "",
    address_2: "",
    zipcode: "",
    mobile_number: "",
    city: "",
    nic: "",
    status: statusEnum.pending,
  };

  const handleClose = () => {
    form.clearErrors();
    form.reset(initialState);
    setAvatar(null);
    setSelectedImage(null);
    setStaffData(null);
    setOpen(false);
  };
  const phoneUtil = PhoneNumberUtil.getInstance();

  const FormSchema = z.object({
    id: z.number().optional(),
    profile_img: z.string().trim().default("").optional(),
    own_staff_id: z.string({
      required_error: "Required",
    }),
    first_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .max(40, "Should be 40 characters or less")
      .min(3, { message: "Required" }),
    last_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .max(40, "Should be 40 characters or less")
      .min(3, { message: "Required" }),
    gender: z.nativeEnum(Gender, {
      required_error: "You need to select a gender type.",
    }),
    dob: z.coerce
      .string({
        required_error: "Required",
      })
      .refine((value) => value.trim() !== "", {
        message: "Required",
      }),
    email: z
      .string()
      .min(8, { message: "Required" })
      .max(50, "Should be 50 characters or less")
      .refine(
        (value) =>
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(value),
        {
          message: "Incorrect email format",
        }
      ),
    phone: z
      .string()
      .max(15, {
        message: "Cannot be greater than 15 characters",
      })
      .trim()
      .optional()
      .refine(
        (value) =>
          value === undefined || value === "" || /^\d{1,15}$/.test(value),
        {
          message: "Must be a number between 1 and 15 digits",
        }
      ),
    mobile_number: z
      .string()
      .max(20, {
        message: "Phone number cannot exceed 20 digits",
      })
      .trim()
      .optional()
      .refine(
        (value) => {
          if (!value) return true; // Skip validation if the field is optional and not provided
          if (value.length <= 4) {
            return true; // Pass validation if length is 5 or fewer
          }
          try {
            // Parse the phone number with the utility
            const parsedNumber = phoneUtil.parseAndKeepRawInput(value);

            // Check if the parsed number is a valid phone number
            return phoneUtil.isValidNumber(parsedNumber);
          } catch (e) {
            // Return false if parsing fails (e.g., invalid format)
            return false;
          }
        },
        {
          message: "Invalid phone number", // Custom error message for refine validation
        }
      ),
    notes: z
      .string()
      .max(200, {
        message: "Note must be greater than 200 characters",
      })
      .optional(),
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
    city: z
      .string()
      .max(50, {
        message: "Should be 50 characters or less",
      })
      .trim()
      .optional(),
    zipcode: z
      .string()
      .trim()
      .max(15, "Zipcode must be 15 characters or less")
      .optional(),
    address_1: z
      .string()
      .max(50, {
        message: "Address must be greater than 50 characters",
      })
      .trim()
      .optional(),
    address_2: z
      .string()
      .max(50, {
        message: "Address must be greater than 50 characters",
      })
      .optional(),
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
    nic: z
      .string()
      .optional() // Makes the field optional
      .refine((value) => !value || /^\d{5}-\d{7}-\d$/.test(value), {
        message: "CNIC must follow #####-#######-#",
      }),
    send_invitation: z.boolean().default(true).optional(),
  });

  const { data: roleData } = useGetRolesQuery(orgId);

  const { data: countries } = useGetCountriesQuery();
  const { data: sources } = useGetAllSourceQuery();
  const { data: staffCount, refetch: countRefetch } = useGetStaffCountQuery(
    orgId,
    {
      skip: staffData != null,
    }
  );

  const [addStaff, { isLoading: staffLoading }] = useAddStaffMutation();
  const [editStaff, { isLoading: editStaffLoading }] = useUpdateStaffMutation();

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [country, setCountry] = useState(false);
  const [dob, setDob] = useState(false);
  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSizeMB = 1;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file) {
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Error Uploading Image",
          description:
            "Unsupported image type. Only PNG, JPG, and JPEG are supported.",
        });
        return;
      }

      if (file.size > maxSizeBytes) {
        toast({
          variant: "destructive",
          title: "Error Uploading Image",
          description: `Image size exceeds ${maxSizeMB} MB limit.`,
        });
        return;
      }

      const reader = new FileReader();

      setSelectedImage(file);

      reader.onloadend = () => {
        setAvatar(reader.result);
      };

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

  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let updatedData = {
      ...data,
      first_name: data.first_name.toLowerCase(),
      last_name: data.last_name.toLowerCase(),
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
      email: data.email.toLowerCase(),
      nic: data.nic?.length ? data.nic?.replace(/-/g, "") : undefined,
    };
    console.log("Updated data with only date:", updatedData);
    console.log("only once", data);
    if (selectedImage) {
      try {
        if (updatedData.profile_img !== "" && selectedImage) {
          await deleteCognitoImage(updatedData.profile_img as string);
        }
        const getUrl = await UploadCognitoImage(selectedImage);
        updatedData = {
          ...updatedData,
          profile_img: getUrl?.location as string,
        };
      } catch (error) {
        console.error("Upload failed:", error);
        toast({
          variant: "destructive",
          title: "Image Upload Failed",
          description: "Please try again.",
        });
        return;
      }
    }

    try {
      if (!staffData) {
        const resp = await addStaff(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Staff Created Successfully",
          });
          refetch();
          if (staffData == null) {
            countRefetch();
          }
          handleClose();
        }
      } else {
        const resp = await editStaff({
          ...updatedData,
          id: staffData.id,
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Staff Updated Successfully",
          });
          refetch();
          if (staffData == null) {
            countRefetch();
          }
          handleClose();
        }
      }
    } catch (error: unknown) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail || (typedError.data as { message?: string }).message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
      countRefetch();
    }
  }

  useEffect(() => {
    if (!open || staffData == null) return;

    const updatedStaffData = replaceNullWithEmptyString(staffData);
    if (
      updatedStaffData?.mobile_number &&
      [0, 2, 3, 4].includes(updatedStaffData?.mobile_number?.length)
    ) {
      updatedStaffData.mobile_number = `+92`;
    }
    const dataPayload = {
      ...updatedStaffData,
      nic: updatedStaffData?.nic !== null ? updatedStaffData?.nic : "",
    };
    form.reset(dataPayload);
    if (dataPayload?.nic?.length) {
      setValue("nic", formatNIC(dataPayload?.nic) ?? "");
    }
  }, [open, staffData]);

  useEffect(() => {
    if (!open) return;
    const total = staffCount?.total_staffs as number;
    if (total >= 0 && staffData == null) {
      form.setValue("own_staff_id", `${orgName?.slice(0, 2)}-S${total + 1}`);
      form.clearErrors();
    }
  }, [open, staffCount, staffData]);

  console.log({ watcher });

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  return (
    <Sheet open={open}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1300px] py-0 custom-scrollbar"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <SheetHeader className="sticky top-0 z-40 py-4 bg-white">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-start  bg-white">
                  <div>
                    <p className="font-semibold">
                      {staffData == null ? "Add" : "Edit"} Staff
                    </p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                        {staffData == null ? "Add" : "Edit"} Staff
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div>
                      <Button
                        type={"button"}
                        onClick={handleClose}
                        className="gap-2 bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                      >
                        <RxCross2 className="w-4 h-4" /> Cancel
                      </Button>
                    </div>
                    <div>
                      <LoadingButton
                        type="submit"
                        className="w-[120px] bg-primary text-black text-center flex items-center gap-2"
                        loading={form.formState.isSubmitting}
                        disabled={form.formState.isSubmitting}
                      >
                        {!form.formState.isSubmitting && (
                          <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                        )}
                        {staffData ? "Update" : "Save"}
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </SheetTitle>
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>
            <SheetDescription className="pb-4">
              <div className="flex justify-between items-center ">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative flex">
                    <img
                      id="avatar"
                      src={
                        avatar
                          ? String(avatar)
                          : watcher.profile_img
                            ? watcher.profile_img.includes(VITE_VIEW_S3_URL)
                              ? watcher.profile_img
                              : `${VITE_VIEW_S3_URL}/${watcher.profile_img}`
                            : profileimg
                      }
                      loading="lazy"
                      alt={profileimg}
                      className="w-14 h-14 rounded-full object-cover mb-4 relative"
                    />
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
              </div>
              <div>
                <h1 className="font-bold text-lg mb-2 text-gray-900">
                  Basic Information
                </h1>
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
                          className="disabled:!opacity-100 disabled:text-gray-800 placeholder:text-gray-800"
                          label="Staff Id"
                          text="*"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Email Address"
                          text="*"
                        />
                        <FormMessage />
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
                          label="First Name"
                          text="*"
                          className="capitalize"
                        />
                        <FormMessage />
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
                          label="Last Name"
                          text="*"
                          className="capitalize"
                        />
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
                        <Select
                          onValueChange={(value: Gender) =>
                            form.setValue("gender", value)
                          }
                          value={field.value as Gender}
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Gender"
                              text="*"
                              className={`text-black`}
                            >
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer not to say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover open={dob} onOpenChange={setDob}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute p-0 text-xs left-2 -top-1.5 px-1 bg-white">
                                  Date of brith{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                                <Button
                                  type="button"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd-MM-yyyy")
                                  ) : (
                                    <span>Select date of birth</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="center">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={new Date(field.value)}
                              onSelect={(selectedDate) => {
                                if (selectedDate) {
                                  const today = new Date();
                                  const oneYearAgo = new Date();
                                  oneYearAgo.setFullYear(
                                    today.getFullYear() - 1
                                  );

                                  // Check if the selected date is at least 1 year old
                                  if (selectedDate <= oneYearAgo) {
                                    field.onChange(selectedDate);
                                    setDob(false);
                                  } else {
                                    toast({
                                      variant: "destructive",
                                      description:
                                        "Date of birth must be at least 1 year old.",
                                    });
                                  }
                                }
                              }}
                              fromYear={1960}
                              toYear={new Date().getFullYear()}
                              defaultMonth={
                                new Date(
                                  field && field.value
                                    ? field.value
                                    : Date.now()
                                )
                              }
                              disabled={(date: Date) =>
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
                        <div className="relative ">
                          <span className="absolute p-0 text-xs left-12 -top-2 px-1 bg-white z-10">
                            Phone Number
                          </span>
                          <PhoneInput
                            defaultCountry="pk"
                            value={field.value}
                            // forceDialCode={true}
                            onChange={field.onChange}
                            inputClassName="w-full "
                          />
                        </div>
                        {<FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    rules={{
                      pattern: {
                        value: /^\d{5}-\d{7}-\d$/,
                        message: "CNIC must follow #####-#######-#",
                      },
                    }}
                    name="nic"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="nic"
                          label="CNIC"
                          value={field.value ? String(field.value) : ""} // Ensure value is a string or empty
                          onChange={(e) => {
                            const formattedValue = formatNIC(e.target.value);
                            field.onChange(formattedValue || ""); // Default to empty string
                          }}
                        />
                        {<FormMessage />}
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
                              floatingLabel="Source"
                              text="*"
                              className={`${watcher.source_id ? "text-black" : "text-gray-500"}`}
                            >
                              <SelectValue>
                                {field.value === 0
                                  ? "Select Source"
                                  : sources?.find(
                                      (source) => source.id === field.value
                                    )?.source || "Select Source"}
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
                <div className="relative flex gap-2 items-center w-full justify-between">
                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div className="relative w-full">
                        <span className="absolute p-0 text-xs font-light text-gray-900 left-3 -top-1.5  px-1 bg-white">
                          Role Name <span className="text-red-500">*</span>
                        </span>
                        <FormItem className=" w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full hover:bg-transparent border-[1px] shadow-sm"
                                  disabled={userInfo?.user?.id == watcher.id}
                                >
                                  <span className="w-full text-left font-normal">
                                    {value
                                      ? roleData?.find(
                                          (role) => role.id === value
                                        )?.name
                                      : "Select Role"}
                                  </span>
                                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0 relative "
                              side="bottom"
                            >
                              <Command className="w-full ">
                                <CommandList>
                                  <CommandInput placeholder="Select Role" />
                                  <CommandEmpty>No Role found.</CommandEmpty>
                                  <CommandGroup className="">
                                    {roleData &&
                                      roleData
                                        .filter((role) => role.name !== "Admin")
                                        .map((role: any) => (
                                          <CommandItem
                                            value={role.id}
                                            key={role.id}
                                            onSelect={() => {
                                              setValue("role_id", role.id);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                                role.id == value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {role.name}
                                          </CommandItem>
                                        ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {watcher.role_id ? <></> : <FormMessage />}
                        </FormItem>
                      </div>
                    )}
                  />

                  {userInfo?.user?.id == watcher.id && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          className="hover:cursor-pointer"
                        >
                          <Info className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Staff cannot edit there own role
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          disabled={field.value === "pending"}
                          onValueChange={(value: statusEnum) =>
                            form.setValue("status", value)
                          }
                          value={field.value as statusEnum}
                        >
                          <FormControl>
                            <SelectTrigger
                              disabled={field.value === "pending"}
                              floatingLabel="Status"
                              text="*"
                              className={`text-black`}
                            >
                              <SelectValue placeholder="Select Status*" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value="pending"
                              className={`${field.value != "pending" && "hidden"}`}
                            >
                              Pending
                            </SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <FormField
                    control={form.control}
                    name="notes"
                    rules={{
                      maxLength: {
                        value: 200,
                        message: "Notes should not exceed 200 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="notes"
                          type="textarea"
                          rows={3}
                          maxLength={200}
                          label="Notes"
                          // error={form.formState.errors.notes?.message}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 my-2">
                  {" "}
                  Address
                </h1>
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
                        <div className="flex flex-col w-full">
                          <label
                            className={`absolute left-3 top-0.5 bg-textwhite transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
                              field.value
                                ? "text-xs -top-2.5"
                                : "text-xs text-black"
                            }`}
                          >
                            Country <span className="text-red-500">*</span>
                          </label>
                          <Popover open={country} onOpenChange={setCountry}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "font-normal text-gray-800 border-[1px] justify-between hover:bg-transparent hover:text-gray-800",
                                    !field.value && "  focus:border-primary "
                                  )}
                                >
                                  {field.value
                                    ? countries?.find(
                                        (country: CountryTypes) =>
                                          country.id === field.value // Compare with numeric value
                                      )?.country // Display country name if selected
                                    : "Select country"}
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
                                            setCountry(false);
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
                        </div>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="h-full relative">
                  {/* <FormField
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
											/> */}
                </div>
              </div>
            </SheetDescription>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default StaffForm;
const replaceNullWithEmptyString = (obj: Record<string, any>) => {
  return Object.entries(obj).reduce(
    (acc: Record<string, any>, [key, value]) => {
      acc[key] = value === null ? "" : value;
      return acc;
    },
    {}
  );
};
