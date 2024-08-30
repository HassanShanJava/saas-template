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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
import {
  CoachInputTypes,
  CoachTableDataTypes,
  CountryTypes,
  ErrorType,
  coachUpdateInput,
  sourceTypes,
} from "@/app/types";
import profileimg from "@/assets/profile-image.svg";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import {
  useGetAllSourceQuery,
  useGetCountriesQuery,
} from "@/services/memberAPi";

import {
  useAddCoachMutation,
  useGetCoachCountQuery,
  useUpdateCoachMutation,
  useGetCoachAutoFillQuery,
} from "@/services/coachApi";

import { useGetMembersListQuery } from "@/services/memberAPi";
import { UploadCognitoImage, deleteCognitoImage } from "@/utils/lib/s3Service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
const { VITE_VIEW_S3_URL } = import.meta.env;

interface CoachFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  coachData: coachUpdateInput | null;
  setCoachData: React.Dispatch<React.SetStateAction<coachUpdateInput | null>>;
  refetch?: any;
}

const CoachForm: React.FC<CoachFormProps> = ({
  coachData,
  setCoachData,
  setOpen,
  open,
  refetch,
}) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const creator_id =
    useSelector((state: RootState) => state.auth.userInfo?.user?.id) || 0;

  const [emailAutoFill, setEmailAutoFill] = React.useState<string>("");
  const [openAutoFill, setAutoFill] = useState(false);
  const membersSchema = z.number();

  const initialState: CoachInputTypes = {
    profile_img: "",
    own_coach_id: "",
    first_name: "",
    last_name: "",
    gender: "male",
    dob: "",
    email: "",
    phone: "",
    mobile_number: "",
    notes: "",
    source_id: 0,
    country_id: 0,
    city: "",
    coach_status: "pending",
    zipcode: "",
    address_1: "",
    address_2: "",
    bank_name: "",
    iban_no: "",
    acc_holder_name: "",
    swift_code: "",
    org_id: orgId,
    member_ids: [] as z.infer<typeof membersSchema>[], // Correct placement of brackets
  };
  const FormSchema = z.object({
    profile_img: z.string().trim().default("").optional(),
    own_coach_id: z.string({
      required_error: "Required",
    }),
    first_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .max(40, "Sbould be 40 characters or less")
      .min(3, { message: "Required" }),
    last_name: z
      .string({
        required_error: "Required",
      })
      .trim()
      .max(40, "Sbould be 40 characters or less")
      .min(3, { message: "Required" }),
    gender: z
      .enum(["male", "female", "other"], {
        required_error: "You need to select a gender type.",
      })
      .default("male"),
    dob: z.coerce
      .string({
        required_error: "Required",
      })
      .refine((value) => value.trim() !== "", {
        message: "Required",
      }),
    email: z
      .string()
      .min(1, { message: "Required" })
      .max(50, "Must be 50 characters or less")
      .email("Invalid Email"),
    phone: z
      .string()
      .max(15, {
        message: "Cannot be greater than 15 characters",
      })
      .trim()
      .optional(),
    mobile_number: z
      .string()
      .max(15, {
        message: "Cannot be greater than 15 characters",
      })
      .trim()
      .optional(),
    member_ids: z.array(membersSchema).optional(),
    coach_status: z
      .enum(["pending", "active", "inactive"], {
        required_error: "You need to select status.",
      })
      .default("pending"),
    notes: z.string().optional(),
    source_id: z.coerce
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0, {
        message: "Required",
      }),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    zipcode: z
      .string()
      .trim()
      .max(10, "Zipcode must be 10 characters or less")
      .optional(),
    bank_name: z
      .string()
      .trim()
      .max(40, "Sbould be 40 characters or less")
      .optional(),
    iban_no: z
      .string()
      .trim()
      .max(34, "Sbould be 34 characters or less")
      .optional(),
    swift_code: z
      .string()
      .trim()
      .max(11, "Should be 11 characters or less")
      .optional(),
    acc_holder_name: z
      .string()
      .trim()
      .max(50, "Should be 50 characters or less")
      .optional(),
    country_id: z.coerce
      .number({
        required_error: "Required",
      })
      .refine((value) => value !== 0, {
        message: "Required",
      }),
    city: z.string().optional(),
    org_id: z
      .number({
        required_error: "Required",
      })
      .default(orgId),
    created_by: z
      .number({
        required_error: "Required",
      })
      .default(creator_id),
  });

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const { data: coachCountData } = useGetCoachCountQuery(orgId, {
    skip: coachData != null,
  });

  const {
    data: autoFill,
    error: autoFillErrors,
    isSuccess: autoFillSuccess,
    isLoading,
    isFetching,
    isError,
    status,
  } = useGetCoachAutoFillQuery(
    {
      org_id: orgId,
      email: emailAutoFill,
    },
    {
      skip: emailAutoFill == "",
    }
  );

  const { data: countries } = useGetCountriesQuery();
  const { data: sources } = useGetAllSourceQuery();

  const [addCoach] = useAddCoachMutation();
  const [editCoach] = useUpdateCoachMutation();

  const { data: transformedData } = useGetMembersListQuery(orgId);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  console.log({ transformedData });

  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>();

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
    defaultValues: initialState,
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

  const email = form.watch("email");
  useEffect(() => {
    if ((isLoading || isFetching || status === "pending") && !errors.email) {
      setAutoFill(false);
      return;
    }

    if (coachData === null && !errors.email && email) {
      setEmailAutoFill(email);
    } else {
      setEmailAutoFill("");
      setAutoFill(false);
      return;
    }

    if (!isError && autoFillSuccess && !errors.email) {
      setAutoFill(true);
    } else if (isError && !errors.email) {
      const errorMessage =
        typeof autoFillErrors === "object" && "data" in autoFillErrors
          ? (autoFillErrors as ErrorType).data?.detail
          : "Something Went Wrong.";

      const errorCode =
        typeof autoFillErrors === "object" &&
        "status" in autoFillErrors &&
        (autoFillErrors as ErrorType).status;

      if (errorCode != 404) {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: errorMessage,
        });
      }
    }
  }, [
    email,
    coachData,
    errors.email,
    isLoading,
    isFetching,
    status,
    autoFillSuccess,
    isError,
    autoFillErrors,
  ]);

  function handleClose() {
    form.clearErrors();
    form.reset(initialState);
    setAvatar(null);
    setCoachData(null);
    setOpen(false);
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
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
      if (coachData == null) {
        const resp = await addCoach(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Coach Created Successfully ",
          });
          refetch();
          handleClose();
        }
      } else {
        const resp = await editCoach({
          ...updatedData,
          id: coachData.id,
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Coach Updated Successfully ",
          });
          refetch();
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
    if (!open) return;
    const total = coachCountData?.total_coaches as number;
    if (total >= 0) {
      form.setValue("own_coach_id", `${orgName?.slice(0, 2)}-C${total + 1}`);
      form.clearErrors();
    }
  }, [open, coachCountData]);

  useEffect(() => {
    if (!open || coachData == null) return;
    const payloadCoach = { ...coachData };
    console.log("Member_ids before that", payloadCoach.member_ids);

    payloadCoach.member_ids = Array.isArray(coachData?.member_ids)
      ? coachData.member_ids.every(
        (item: any) =>
          (typeof item === "object" &&
            item.id === 0 &&
            item.name.trim() === "") ||
          (typeof item === "number" && item === 0)
      )
        ? []
        : coachData.member_ids.map((item: any) =>
          typeof item === "object" ? item.id : item
        )
      : [];

    form.reset(payloadCoach);
    console.log("Member_ids", payloadCoach.member_ids);
    // setAvatar(coachData?.profile_img as string);
  }, [open, coachData]);

  console.log("watcher", form.watch());

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const setUserAutofill = () => {
    if (autoFill) {
      const { id, org_id, ...payload } = autoFill;
      payload.own_coach_id = watcher.own_coach_id;
      payload.coach_status = 'pending';
      payload.member_ids = [];
      payload.members = [];
      reset(payload);
    }
  };

  return (
    <Sheet open={open}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1300px] py-0 custom-scrollbar"
      >
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit, onError)}>
            <SheetHeader className="sticky !top-0 z-40 py-4 bg-white">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-start  bg-white">
                  <div>
                    <p className="font-semibold">{coachData==null?"Add":"Edit"} Coach</p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                      {coachData==null?"Add":"Edit"} Coach
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
                        {coachData ? "Update" : "Save"}
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </SheetTitle>
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>
            <SheetDescription className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative flex">
                    <img
                      id="avatar"
                      src={
                        avatar
                          ? String(avatar)
                          : watcher.profile_img
                            ? `${VITE_VIEW_S3_URL}/${watcher.profile_img}`
                            : profileimg
                      }
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
                    name="own_coach_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_coach_id"
                          label="Coach Id*"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Email Address*"
                          disabled={coachData != null}
                        />
                        {<FormMessage />}
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
                        <FormMessage>
                          {form.formState.errors.first_name?.message}
                        </FormMessage>
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
                        <FormMessage>
                          {form.formState.errors.last_name?.message}
                        </FormMessage>
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
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute p-0 text-xs left-2 -top-1.5 px-1 bg-white">Date of brith*</span>

                                <Button
                                  variant={"outline"}
                                  type="button"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd-MM-yyyy")
                                  ) : (
                                    <span className="font-normal text-gray-400">
                                      Select date of birth
                                    </span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </div>
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
                    render={({ field: { onChange } }) => (
                      <FormItem className="w-full ">
                        <MultiSelect
                          floatingLabel={"Assign Members"}
                          options={
                            transformedData as {
                              value: number;
                              label: string;
                            }[]
                          }
                          defaultValue={form.watch("member_ids") || []} // Ensure defaultValue is always an array
                          onValueChange={(selectedValues) => {
                            console.log("Selected Values: ", selectedValues); // Debugging step
                            onChange(selectedValues); // Pass selected values to state handler
                          }}
                          placeholder={"Select members"}
                          variant="inverted"
                          maxCount={1}
                          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
                        />

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
                          disabled={field.value == "pending"}
                          onValueChange={(
                            value: "pending" | "active" | "inactive"
                          ) => form.setValue("coach_status", value)}
                          defaultValue="pending"
                        >
                          <FormControl>
                            <SelectTrigger
                              floatingLabel="Status*"
                              className={"font-medium text-gray-400"}
                            >
                              <SelectValue placeholder="Select Coach status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending" className={`${coachData && "hidden"}`}>Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                    rules={{
                      maxLength: {
                        value: 200,
                        message: "Notes should not exceed 350 characters"
                      }
                    }}
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
                              floatingLabel="Source*"
                              className={"font-medium text-gray-400"}
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
                <h1 className="font-bold text-lg text-gray-900 my-2">
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
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 my-2">
                  Bank Details
                </h1>
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
              {/*</CardContent>
									</Card>*/}
            </SheetDescription>
          </form>
        </Form>
      </SheetContent>
      {openAutoFill && (
        <AlertDialog
          open={openAutoFill}
          onOpenChange={() => setAutoFill(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
              <AlertDialogDescription>
                <div className="flex flex-col items-center  justify-center gap-4">
                  <AlertDialogTitle className="text-xl font-medium w-80 text-center">
                  The email is already registered in the system.<br/> Would you like to auto-fill the details?
                  </AlertDialogTitle>
                </div>
                <div className="w-full flex justify-between items-center gap-3 mt-4">
                  <AlertDialogCancel
                    onClick={() => setAutoFill(false)}
                    className="w-full border border-primary font-semibold"
                  >
                    <i className="fa fa-xmark text-base px-1 "></i>
                    No
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={setUserAutofill}
                    className="w-full bg-primary !text-black font-semibold"
                  >
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    Yes
                  </AlertDialogAction>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Sheet>
  );
};

export default CoachForm;
