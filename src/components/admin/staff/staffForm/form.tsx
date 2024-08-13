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
import React, { useEffect, useState } from "react";
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
  staffTypesResponseList,
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
import { UploadCognitoImage } from "@/utils/lib/s3Service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import profileimg from "@/assets/profile-image.svg";

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

interface StaffFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  staffData: staffTypesResponseList | null;
  setStaffData: React.Dispatch<
    React.SetStateAction<staffTypesResponseList | null>
  >;
}
const StaffForm: React.FC<StaffFormProps> = ({
  open,
  setOpen,
  staffData,
  setStaffData,
}) => {
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  //const {
  //  data: EditStaffData,
  //  isLoading: editLoading,
  //  refetch: editRefetch,
  //} = useGetStaffByIdQuery(staffId as number, {
  //  skip: staffId == undefined,
  //});

  const initialState: StaffInputType = {
    profile_img: "",
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

  const handleClose = () => {
    form.clearErrors();
    form.reset(initialState);
    setAvatar(null);
    setStaffData(null);
    setOpen(false);
  };

  const FormSchema = z.object({
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
    email: z.string().min(1, { message: "Required" }).max(50, "Should be 50 characters or less").email("invalid email"),
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
    zipcode: z
      .string()
      .trim()
      .max(10, "Zipcode must be 10 characters or less")
      .optional(),
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
    skip: staffData != null,
  });

  const [addStaff, { isLoading: staffLoading }] = useAddStaffMutation();
  const [editStaff, { isLoading: editStaffLoading }] = useUpdateStaffMutation();

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (file && validTypes.includes(file.type)) {
      const reader = new FileReader();

      setSelectedImage(file);

      reader.onloadend = () => {
        setAvatar(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Error Uploading image",
        description: "Unsupported image only Support (png/jpg/jpeg/gif)",
      });
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
    let updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
    };
    console.log("Updated data with only date:", updatedData);
    console.log("only once", data);
    if (selectedImage) {
      try {
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

  useEffect(() => {
    if (!open || staffData == null) return;
    form.reset(staffData);
    setAvatar(staffData?.profile_img as string);
  }, [open, staffData]);

  useEffect(() => {
    if (!open) return;
    const total = staffCount?.total_staffs as number;
    if (total >= 0) {
      form.setValue("own_staff_id", `${orgName?.slice(0, 2)}-S${total + 1}`);
      form.clearErrors();
    }
  }, [open, staffCount]);

  return (
    <Sheet open={open}>
      <SheetContent hideCloseButton className="overflow-y-auto !max-w-[1050px]">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription>
            <div className="p-6 bg-bgbackground">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                      <div className="relative flex">
                        <img
                          id="avatar"
                          src={avatar ? String(avatar) : profileimg}
                          alt={profileimg}
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
                          onClick={handleClose}
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
                              label="Last Name*"
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
                                            !field.value &&
                                              "text-muted-foreground"
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
                                      defaultMonth={
                                        new Date(
                                          field && field.value
                                            ? field.value
                                            : Date.now()
                                        )
                                      }
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
                              disabled={staffData != null}
                            />
                            <FormMessage />
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
                                  sources.map(
                                    (sourceval: sourceTypes, i: any) => (
                                      <SelectItem
                                        value={sourceval.id?.toString()}
                                        key={i}
                                      >
                                        {sourceval.source}
                                      </SelectItem>
                                    )
                                  )
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
                                          (role) => role.id === field.value
                                        )?.name || "Select Role*"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roleData && roleData.length > 0 ? (
                                  roleData?.map((sourceval: getRolesType) => {
                                    return (
                                      <SelectItem
                                        key={sourceval.id}
                                        value={sourceval.id?.toString()}
                                      >
                                        {sourceval.name}
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
                                <SelectItem value="inactive">
                                  inactive
                                </SelectItem>
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
                                    <CommandEmpty>
                                      No country found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {countries &&
                                        countries.map(
                                          (country: CountryTypes) => (
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
                                          )
                                        )}
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
                              label="City"
                            />
                            {watcher.city ? <></> : <FormMessage />}
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
                </form>
              </Form>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default StaffForm;
