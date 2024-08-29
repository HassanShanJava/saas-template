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

import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
import { Switch } from "@/components/ui/switch";
import "react-phone-number-input/style.css";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { PlusIcon, CameraIcon, Webcam } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/ui/buttonGroup/button-group";

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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  BusinessTypes,
  CoachResponseType,
  CoachTableDataTypes,
  CoachTypes,
  CountryTypes,
  ErrorType,
  MemberInputTypes,
  membershipplanTypes,
  MemberTableDatatypes,
  membeshipsTableType,
  renewalData,
  sourceTypes,
} from "@/app/types";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Label } from "@/components/ui/label";
import {
  useGetAllBusinessesQuery,
  useGetAllSourceQuery,
  useGetCountriesQuery,
  useGetMemberCountQuery,
  useGetMembersAutoFillQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
} from "@/services/memberAPi";

import { useGetCoachListQuery } from "@/services/coachApi";
import {
  useGetMembershipListQuery,
  useGetMembershipsQuery,
} from "@/services/membershipsApi";
import { useParams } from "react-router-dom";
import { deleteCognitoImage, UploadCognitoImage } from "@/utils/lib/s3Service";
import profileimg from "@/assets/profile-image.svg";
import { Separator } from "@/components/ui/separator";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
const { VITE_VIEW_S3_URL } = import.meta.env;

enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}

const coachsSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const initialValues: MemberInputTypes = {
  own_member_id: "",
  profile_img: "",
  first_name: "",
  last_name: "",
  gender: genderEnum.male,
  dob: format(new Date(), "yyyy-MM-dd"),
  email: "",
  phone: "",
  mobile_number: "",
  notes: "",
  source_id: null,
  is_business: false,
  business_id: null,
  country_id: null,
  city: "",
  zipcode: "",
  address_1: "",
  address_2: "",
  coach_id: [] as z.infer<typeof coachsSchema>[],
  membership_plan_id: undefined,
  send_invitation: true,
  auto_renewal: false,
  prolongation_period: undefined,
  auto_renew_days: undefined,
  inv_days_cycle: undefined,
};

interface memberFormTypes {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberData: MemberTableDatatypes | null;
  setMemberData: React.Dispatch<
    React.SetStateAction<MemberTableDatatypes | null>
  >;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
}

const MemberForm = ({
  open,
  setOpen,
  memberData,
  setMemberData,
  action,
  setAction,
  refetch,
}: memberFormTypes) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);
  const [emailAutoFill, setEmailAutoFill] = React.useState<string>("");
  const [openAutoFill, setAutoFill] = useState(false);

  // conditional fetching
  const { data: memberCountData, refetch: refecthCount } =
    useGetMemberCountQuery(orgId, {
      skip: action == "edit",
    });

  const {
    data: autoFill,
    error: autoFillErrors,
    isSuccess: autoFillSuccess,
    isLoading,
    isFetching,
    isError,
    status,
  } = useGetMembersAutoFillQuery(
    {
      org_id: orgId,
      email: emailAutoFill,
    },
    {
      skip: emailAutoFill == "",
    }
  );

  const { data: countries } = useGetCountriesQuery();
  const { data: business } = useGetAllBusinessesQuery(orgId);
  const { data: coachesData } = useGetCoachListQuery(orgId);
  const { data: sources } = useGetAllSourceQuery();
  const { data: membershipPlans } = useGetMembershipListQuery(orgId);
  const [addMember] = useAddMemberMutation();
  const [editMember] = useUpdateMemberMutation();

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

  const form = useForm<MemberInputTypes>({
    defaultValues: initialValues,
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

  const watcher = watch();

  useEffect(() => {
    if (action == "edit") {
      const memberpayload = { ...memberData };
      memberpayload.coach_id = memberData?.coaches.every(
        (item) => item.id === 0 && item.name.trim() === ""
      )
        ? []
        : memberData?.coaches.map((item) => item.id);
      reset(memberpayload);
      // setAvatar(memberpayload.profile_img as string);
    } else {
      const total = memberCountData?.total_members as number;
      if (total >= 0 && action == "add") {
        initialValues.own_member_id = `${orgName?.slice(0, 2)}-${total + 1}`;
      }
      reset(initialValues);
    }
  }, [open, action, memberCountData]);

  const email = watch("email");
  useEffect(() => {
    if ((isLoading || isFetching || status === "pending") && !errors.email) {
      setAutoFill(false);
      return;
    }

    if (action === "add" && !errors.email && email) {
      setEmailAutoFill(email);
    } else {
      setEmailAutoFill("");
      setAutoFill(false);
      return;
    }

    if (!isError && autoFillSuccess && !errors.email) {
      setAutoFill(true);
    } else if (isError && !errors.email) {
      console.log({ autoFillErrors, status });
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
    action,
    errors.email,
    isLoading,
    isFetching,
    status,
    autoFillSuccess,
    isError,
    autoFillErrors,
  ]);

  console.log({ emailAutoFill });
  // set auto_renewal
  const handleMembershipPlanChange = (value: number) => {
    setValue("membership_plan_id", value);

    const data =
      membershipPlans &&
      membershipPlans?.filter((item: any) => item.id == value)[0];
    const renewalDetails = data?.renewal_details as renewalData;

    setValue("auto_renewal", data?.auto_renewal);
    if (data?.auto_renewal && renewalDetails) {
      setValue(
        "prolongation_period",
        renewalDetails?.prolongation_period as number
      );
      setValue("auto_renew_days", renewalDetails?.days_before as number);
      setValue("inv_days_cycle", renewalDetails?.next_invoice as number);
    }
  };

  function handleClose() {
    setAvatar(null);
    clearErrors();
    reset(initialValues, {
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDefaultValues: true,
    });
    setMemberData(null);
    setOpen(false);
    setAction("add");
  }

  async function onSubmit(data: MemberInputTypes) {
    let updatedData = {
      ...data,
      org_id: orgId,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
    };

    if (!updatedData.auto_renew_days) {
      setValue("prolongation_period", undefined);
      setValue("auto_renew_days", undefined);
      setValue("inv_days_cycle", undefined);
    }

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
      if (action == "add") {
        console.log({ updatedData }, "add");
        const resp = await addMember(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Member Created Successfully ",
          });
          refetch();
          refecthCount();
          handleClose();
        }
      } else {
        console.log({ ...updatedData, id: memberData?.id as number }, "update");
        const resp = await editMember({
          ...updatedData,
          id: memberData?.id as number,
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Record updated successfully ",
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
          description: typedError.data?.detail,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
      handleClose();
    }
  }
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  console.log({ watcher, errors, action, isSubmitting });

  const setUserAutofill = () => {
    if (autoFill) {
      const { id, org_id, ...payload } = autoFill;
      payload.own_member_id = watcher.own_member_id;
      payload.coach_id = [];
      payload.coaches = [];
      payload.membership_plan_id = undefined;
      payload.auto_renewal = false;
      payload.auto_renew_days = undefined;
      payload.prolongation_period = undefined;
      payload.inv_days_cycle = undefined;
      payload.send_invitation = true;
      reset(payload);
    }
  };
  return (
    <Sheet open={open}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1300px] py-0 custom-scrollbar"
      >
        <FormProvider {...form}>
          <form
            key={action}
            noValidate
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <SheetHeader className="sticky top-0 z-40 py-4 bg-white">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-start  bg-white">
                  <div>
                    <p className="font-semibold">Add Member</p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                        Add Member
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
                        className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {!isSubmitting && (
                          <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                        )}
                        Save
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </SheetTitle>
              <Separator className=" h-[1px] rounded-full my-2" />
            </SheetHeader>
            <SheetDescription className="pb-4">
              <div className="flex justify-between items-center sticky top-0 z-20 bg-white">
                <div className="flex flex-row gap-4 items-center">
                  <div className="relative flex">
                    <img
                      id="avatar"
                      // src={
                      //   watcher.profile_img !== "" && watcher.profile_img
                      //     ? VITE_VIEW_S3_URL + "/" + watcher.profile_img
                      //     : avatar
                      //       ? String(avatar)
                      //       : profileimg
                      // }
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
                    {/* <CameraIcon className="w-8 h-8 text-black bg-primary rounded-full p-2 absolute top-8 left-14 " /> */}
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
                  <FloatingLabelInput
                    id="own_member_id"
                    label="Member Id*"
                    className="disabled:!opacity-100 disabled:text-gray-800 placeholder:text-gray-800"
                    disabled
                    {...register("own_member_id")}
                    error={
                      errors?.own_member_id?.message as keyof MemberInputTypes
                    }
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="email"
                    className=""
                    type="email"
                    disabled={action == "edit"}
                    label="Email Address*"
                    {...register("email", {
                      required: "Required",
                      maxLength: {
                        value: 40,
                        message: "Should be 40 characters or less",
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                        message: "Incorrect email format",
                      },
                    })}
                    error={errors.email?.message}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="first_name"
                    label="First Name*"
                    {...register("first_name", {
                      required: "Required",
                      maxLength: {
                        value: 40,
                        message: "Should be 40 characters or less",
                      },
                    })}
                    error={
                      errors?.first_name?.message as keyof MemberInputTypes
                    }
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="last_name"
                    label="Last Name*"
                    {...register("last_name", {
                      required: "Required",
                      maxLength: {
                        value: 40,
                        message: "Should be 40 characters or less",
                      },
                    })}
                    error={errors?.last_name?.message as keyof MemberInputTypes}
                  />
                </div>
                <div className="relative ">
                  <Controller
                    name={"gender" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        onValueChange={(value: genderEnum) =>
                          setValue("gender", value)
                        }
                        value={value as genderEnum}
                      >
                        <SelectTrigger
                          floatingLabel="Gender*"
                          className={`text-black`}
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.gender?.message}
                    </span>
                  )}
                </div>
                <div className="relative ">
                  <TooltipProvider>
                    <Tooltip>
                      <Controller
                        name={"dob" as keyof MemberInputTypes}
                        rules={{ required: "Required" }}
                        control={control}
                        render={({
                          field: { onChange, value, onBlur },
                          fieldState: { invalid, error },
                        }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal ",
                                      !value && "text-muted-foreground"
                                    )}
                                  >
                                    {(value as Date) ? (
                                      format(value as Date, "dd-MM-yyyy")
                                    ) : (
                                      <span className="font-medium text-gray-400">
                                        Date of Birth*
                                      </span>
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
                                selected={value as Date}
                                defaultMonth={
                                  (value as Date) ? (value as Date) : undefined
                                }
                                onSelect={onChange}
                                fromYear={1960}
                                toYear={2030}
                                disabled={(date: any) =>
                                  date > new Date() ||
                                  date < new Date("1960-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      <TooltipContent>
                        <p>Date of Birth*</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="relative ">
                  <FloatingLabelInput
                    type="tel"
                    id="phone"
                    label="Landline Number"
                    className=""
                    {...register("phone", {
                      maxLength: {
                        value: 15,
                        message: "should be 15 character or less",
                      },
                    })}
                    error={errors.phone?.message}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    type="tel"
                    id="mobile_number"
                    label="Mobile Number"
                    {...register("mobile_number", {
                      maxLength: {
                        value: 15,
                        message: "should be 15 character or less",
                      },
                    })}
                    error={errors.mobile_number?.message}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="notes"
                    label="Notes"
                    {...register("notes")}
                    error={errors.notes?.message}
                  />
                </div>
                <div className="relative ">
                  <Controller
                    name={"source_id" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        onValueChange={(value) =>
                          setValue("source_id", Number(value))
                        }
                        value={value?.toString()}
                      >
                        <SelectTrigger className="font-medium text-gray-800">
                          <SelectValue placeholder="Select Source*" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources &&
                            sources?.map((item) => (
                              <SelectItem value={item.id.toString()}>
                                {item.source}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.source_id?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.source_id?.message}
                    </span>
                  )}
                </div>
                <div className="relative ">
                  <Controller
                    name={"coach_id" as keyof MemberInputTypes}
                    // rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <MultiSelect
                        floatingLabel={"Coaches"}
                        options={
                          coachesData as { value: number; label: string }[]
                        }
                        defaultValue={watch("coach_id") || []} // Ensure defaultValue is always an array
                        onValueChange={(selectedValues) => {
                          console.log("Selected Values: ", selectedValues); // Debugging step
                          onChange(selectedValues); // Pass selected values to state handler
                        }}
                        placeholder={"Select coaches"}
                        variant="inverted"
                        maxCount={1}
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
                      />
                    )}
                  />
                  {errors.coach_id?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.coach_id?.message}
                    </span>
                  )}
                </div>
                <div className="relative ">
                  <div className="justify-start items-center flex">
                    <Controller
                      name={"is_business" as keyof MemberInputTypes}
                      control={control}
                      render={({
                        field: { onChange, value, onBlur },
                        fieldState: { invalid, error },
                      }) => (
                        <div className="flex flex-row gap-3 items-center justify-between ">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Business :
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={value as boolean}
                              onCheckedChange={onChange}
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                    {errors.is_business?.message && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {errors.is_business?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`relative  ${watcher.is_business ? "hidden" : ""}`}
                >
                  <Controller
                    name={"business_id" as keyof MemberInputTypes}
                    // rules={{ required: !watcher.is_business && "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        onValueChange={(value) =>
                          setValue("business_id", Number(value))
                        }
                        value={value?.toString()}
                      >
                        <SelectTrigger className="font-medium text-gray-800">
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* <Button variant={"link"} className="gap-2 text-black">
                            <PlusIcon className="text-black w-5 h-5" /> Add New
                            business
                          </Button> */}
                          {business && business?.length ? (
                            business.map((sourceval: BusinessTypes) => {
                              // console.log(business.length);
                              return (
                                <SelectItem
                                  value={sourceval.id?.toString()}
                                  key={sourceval.id?.toString()}
                                >
                                  {sourceval.first_name}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <>
                              <p className="p-2"> No Business found</p>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.business_id?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.business_id?.message}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg my-2 text-gray-900">
                  Address
                </h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative ">
                  <FloatingLabelInput
                    id="address_1"
                    label="Street Address"
                    {...register("address_1")}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="address_2"
                    label="Extra Address"
                    {...register("address_2")}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="zipcode"
                    label="Zip Code"
                    {...register("zipcode")}
                  />
                </div>
                <div className="relative">
                  <Controller
                    name={"country_id" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div className="flex flex-col w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between ",
                                  !value &&
                                    "font-medium text-gray-800 focus:border-primary "
                                )}
                              >
                                {value
                                  ? countries?.find(
                                      (country: CountryTypes) =>
                                        country.id === value // Compare with numeric value
                                    )?.country // Display country name if selected
                                  : "Select country*"}
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0  ">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Select Country" />
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup className="">
                                  {countries &&
                                    countries.map((country: CountryTypes) => (
                                      <CommandItem
                                        value={country.country}
                                        key={country.id}
                                        onSelect={() => {
                                          setValue(
                                            "country_id",
                                            country.id // Set country_id to country.id as number
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                            country.id == value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {country.country}
                                        {/* Display the country name */}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  />
                  {errors.country_id?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.country_id?.message}
                    </span>
                  )}
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="city"
                    label="City"
                    {...register("city")}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg my-2 text-gray-900">
                  Membership and Auto Renewal
                </h1>
              </div>
              <div className="grid grid-cols-12 gap-3">
                <div className="relative col-span-4">
                  <Controller
                    name={"membership_plan_id" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <>
                        <Select
                          onValueChange={(value) =>
                            handleMembershipPlanChange(Number(value))
                          }
                          defaultValue={value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              name="membership_plan_id"
                              className={`font-medium text-gray-800`}
                            >
                              <SelectValue placeholder="Select membership plan*" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {membershipPlans && membershipPlans?.length > 0 ? (
                              membershipPlans.map(
                                (sourceval: membeshipsTableType) => {
                                  console.log({ sourceval });
                                  return (
                                    <SelectItem
                                      key={sourceval.id}
                                      value={sourceval.id?.toString()}
                                    >
                                      {sourceval.name}
                                    </SelectItem>
                                  );
                                }
                              )
                            ) : (
                              <>
                                <p className="2">No Membership plan found</p>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        {watcher.membership_plan_id ? <></> : <FormMessage />}
                      </>
                    )}
                  />
                  {errors.membership_plan_id?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.membership_plan_id?.message}
                    </span>
                  )}
                </div>

                <div className="h-full relative col-span-2">
                  <Controller
                    name={"auto_renewal" as keyof MemberInputTypes}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <div className="h-10 flex items-center gap-3">
                        <>
                          <Checkbox
                            checked={value as boolean}
                            onCheckedChange={onChange}
                            disabled={watcher.membership_plan_id == undefined}
                          />
                        </>
                        <Label className="!mt-0">Auto renewal</Label>
                      </div>
                    )}
                  />
                </div>

                {watcher.auto_renewal && (
                  <>
                    <div className="relative col-span-6">
                      <div className="flex h-10 items-center gap-3">
                        <Label className="text-base">
                          Prolongation period*
                        </Label>
                        <div className="relative pb-3">
                          <FloatingLabelInput
                            id="prolongation_period"
                            type="number"
                            min={1}
                            className="w-16"
                            {...register("prolongation_period", {
                              valueAsNumber: true,
                              required: watcher.auto_renewal && "Required",
                            })}
                            error={errors.prolongation_period?.message}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative col-span-5">
                      <div className="flex h-10 items-center gap-3">
                        <Label className="text-sm">
                          Auto renewal takes place*
                        </Label>
                        <div className="relative pt-3">
                          <FloatingLabelInput
                            id="auto_renew_days"
                            type="number"
                            min={1}
                            className="w-16"
                            {...register("auto_renew_days", {
                              valueAsNumber: true,
                              required: watcher.auto_renewal && "Required",
                            })}
                            error={errors.auto_renew_days?.message}
                          />
                        </div>
                        <Label className="text-xs text-black/60">
                          days before contracts runs out.
                        </Label>
                      </div>
                    </div>

                    <div className="relative col-span-7">
                      <div className="flex h-10 items-center gap-3">
                        <Label className="text-sm">
                          Next invoice will be created *
                        </Label>
                        <div className="relative pt-3">
                          <FloatingLabelInput
                            id="inv_days_cycle"
                            type="number"
                            min={1}
                            className="w-16"
                            {...register("inv_days_cycle", {
                              valueAsNumber: true,
                              required: watcher.auto_renewal && "Required",
                            })}
                            error={errors.inv_days_cycle?.message}
                          />
                        </div>
                        <Label className="text-xs text-black/60">
                          days before contracts runs out.
                        </Label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetDescription>
          </form>
        </FormProvider>
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
                  <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                    Would you like to autofill this user's basic information?
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

export default MemberForm;
