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
import { PhoneNumberUtil } from "google-libphonenumber";

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
import "react-international-phone/style.css"; // Import the default styles for the phone input

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
import { PhoneInput } from "react-international-phone";
import { formatNIC } from "@/utils/helper";
import { Input } from "@/components/ui/input";
const { VITE_VIEW_S3_URL } = import.meta.env;

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
const coachsSchema = z.object({
  id: z.number(),
  name: z.string(),
});

interface membership_planids {
  membership_plan_id?: number | undefined;
  auto_renewal?: boolean;
  prolongation_period?: number;
  auto_renew_days?: number;
  inv_days_cycle?: number;
}

const initialValues: MemberInputTypes = {
  own_member_id: "",
  profile_img: "",
  first_name: "",
  last_name: "",
  gender: genderEnum.male,
  dob: "",
  email: "",
  phone: "",
  mobile_number: "",
  notes: "",
  source_id: null,
  is_business: false,
  business_id: null,
  country_id: null,
  client_status: "pending",
  city: "",
  zipcode: "",
  address_1: "",
  address_2: "",
  coach_ids: [] as z.infer<typeof coachsSchema>[],
  send_invitation: true,
  membership_plans: undefined,
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
  const [country, setCountry] = useState(false);
  const [dob, setDob] = useState(false);

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
  const phoneUtil = PhoneNumberUtil.getInstance();

  const validatePhone = (value: string | undefined) => {
    if (!value) {
      return true; // If value is empty, validation passes (based on requirements)
    }

    if (value.length > 20) {
      return "Phone number cannot exceed 20 digits";
    }

    if (value.length <= 4) {
      return true; // Pass validation if length is 5 or fewer
    }

    try {
      // Parse the phone number with the default country code (can be adjusted)
      const parsedNumber = phoneUtil.parseAndKeepRawInput(value);

      // Check if the parsed number is a valid phone number
      if (!phoneUtil.isValidNumber(parsedNumber)) {
        return "Invalid phone number";
      }

      return true; // Return true if validation passes
    } catch (error) {
      // Catch parsing errors and return an appropriate message
      return "Invalid phone number format";
    }
  };

  const { data: countries } = useGetCountriesQuery();
  const { data: business } = useGetAllBusinessesQuery(orgId);
  const { data: coachesData } = useGetCoachListQuery(orgId);
  const { data: sources } = useGetAllSourceQuery();
  const { data: membershipPlans } = useGetMembershipListQuery(orgId);
  const [addMember] = useAddMemberMutation();
  const [editMember] = useUpdateMemberMutation();
  const [membershipPlansdata, setMembershipPlansdata] = useState<
    membership_planids[]
  >([
    {
      membership_plan_id: undefined,
      auto_renewal: false,
      prolongation_period: undefined,
      auto_renew_days: undefined,
      inv_days_cycle: undefined,
    },
  ]);

  const handleAddPlan = () => {
    setMembershipPlansdata([
      ...membershipPlansdata,
      {
        membership_plan_id: undefined,
        auto_renewal: false,
        prolongation_period: undefined,
        auto_renew_days: undefined,
        inv_days_cycle: undefined,
      },
    ]);
  };

  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...membershipPlansdata]; // Create a shallow copy
    updatedPlans.splice(index, 1); // Remove the exact item
    console.log("After removal:", updatedPlans);

    if (updatedPlans.length === 0) {
      setMembershipPlansdata([
        {
          membership_plan_id: undefined,
          auto_renewal: false,
          prolongation_period: undefined,
          auto_renew_days: undefined,
          inv_days_cycle: undefined,
        },
      ]);
    } else {
      setMembershipPlansdata(updatedPlans); // Update the state
    }
  };

  const handleMembershipPlanChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedPlans = [...membershipPlansdata];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };

    if (field === "membership_plan_id") {
      const selectedPlan = membershipPlans.find(
        (item: any) => item.id === value
      );

      if (selectedPlan) {
        const renewalDetails = selectedPlan?.renewal_details as renewalData;
        // Set the auto_renewal and related fields based on the selected plan
        updatedPlans[index] = {
          ...updatedPlans[index],
          auto_renewal: selectedPlan?.auto_renewal,
          prolongation_period: renewalDetails?.prolongation_period || undefined,
          auto_renew_days: renewalDetails?.days_before || undefined,
          inv_days_cycle: renewalDetails?.next_invoice || undefined,
        };
      }
    }

    if (field === "auto_renewal") {
      if (!value) {
        updatedPlans[index] = {
          ...updatedPlans[index],
          auto_renewal: false,
          // prolongation_period: undefined,
          // auto_renew_days: undefined,
          // inv_days_cycle: undefined,
        };
      } else {
        const selectedPlan = membershipPlans.find(
          (item: any) => item.id === updatedPlans[index].membership_plan_id
        );

        if (selectedPlan) {
          const renewalDetails = selectedPlan?.renewal_details as renewalData;
          // Set the auto_renewal and related fields based on the selected plan
          updatedPlans[index] = {
            ...updatedPlans[index],
            auto_renewal: true,
            prolongation_period:
              renewalDetails?.prolongation_period || undefined,
            auto_renew_days: renewalDetails?.days_before || undefined,
            inv_days_cycle: renewalDetails?.next_invoice || undefined,
          };
        }
      }
    }

    setMembershipPlansdata(updatedPlans);
  };

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
      memberpayload.coach_ids = memberData?.coaches.every(
        (item) => item.id === 0 && item.name?.trim() === ""
      )
        ? []
        : memberData?.coaches
            .filter((item) => item.id !== 0 && item.name?.trim() !== "") // Filter out invalid entries
            .map((item) => item.id);

      if (
        memberpayload?.mobile_number &&
        [0, 2, 3, 4].includes(memberpayload.mobile_number?.length)
      ) {
        memberpayload.mobile_number = `+1`;
      }
      setMembershipPlansdata(memberpayload?.membership_plans || []);

      reset(memberpayload);
      // setAvatar(memberpayload.profile_img as string);
    } else {
      const total = memberCountData?.total_members as number;
      if (total >= 0 && action == "add") {
        initialValues.own_member_id = `${orgName?.slice(0, 2)}-${total + 1}`;
      }
      reset(initialValues);
    }
  }, [open, action]);

  useEffect(() => {
    if (!open) return;
    const total = memberCountData?.total_members as number;
    if (total >= 0 && action === "add") {
      form.setValue("own_member_id", `${orgName?.slice(0, 2)}-${total + 1}`);
      form.clearErrors();
      setMembershipPlansdata([
        {
          membership_plan_id: undefined,
          auto_renewal: false,
          prolongation_period: undefined,
          auto_renew_days: undefined,
          inv_days_cycle: undefined,
        },
      ]);
    }
  }, [open, memberCountData]);

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

  function handleClose() {
    setAvatar(null);
    setSelectedImage(null);
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
      business_id: data.is_business ? null : data.business_id,
    };

    // if (!updatedData.auto_renew_days) {
    //   setValue("prolongation_period", undefined);
    //   setValue("auto_renew_days", undefined);
    //   setValue("inv_days_cycle", undefined);
    // }

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
        const validMembershipPlans = membershipPlansdata.filter(
          (plan) =>
            plan.membership_plan_id !== undefined &&
            plan.membership_plan_id !== null
        );

        const payload = {
          ...updatedData,
          membership_plans:
            validMembershipPlans.length > 0 ? validMembershipPlans : [],
        };
        console.log({ payload }, "add");

        const resp = await addMember(payload).unwrap();
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
        const validMembershipPlans = membershipPlansdata.filter(
          (plan) =>
            plan.membership_plan_id !== undefined &&
            plan.membership_plan_id !== null
        );
        console.log(
          {
            ...updatedData,
            id: memberData?.id as number,
            membership_plans: membershipPlansdata,
          },
          "update"
        );
        const payload = {
          ...updatedData,
          membership_plans:
            validMembershipPlans.length > 0 ? validMembershipPlans : [],
        };
        console.log("Payload as final", payload);
        const resp = await editMember({
          ...payload,
          id: memberData?.id as number,
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Member Updated Successfully ",
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
      refecthCount();
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
      payload.is_business = false;
      payload.business_id = null;
      payload.client_status = "pending";
      reset(payload);
    }
  };

  console.log("Updated data watcher", watcher, membershipPlansdata);
  return (
    <Sheet open={open}>
      <SheetContent
        hideCloseButton
        className="w-full !max-w-[1120px] py-0 custom-scrollbar"
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
                    <p className="font-semibold">
                      {action == "add" ? "Add" : "Edit"} Member
                    </p>
                    <div className="text-sm">
                      <span className="text-gray-400 pr-1 font-semibold">
                        Dashboard
                      </span>{" "}
                      <span className="text-gray-400 font-semibold">/</span>
                      <span className="pl-1 text-primary font-semibold ">
                        {action == "add" ? "Add" : "Edit"} Member
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
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {!isSubmitting && (
                          <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                        )}
                        {action === "edit" ? "Update" : "Save"}
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
                            ? watcher.profile_img.includes(VITE_VIEW_S3_URL)
                              ? watcher.profile_img
                              : `${VITE_VIEW_S3_URL}/${watcher.profile_img}`
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
                  {action == "add" ||
                  (action == "edit" && watcher.client_status == "pending") ? (
                    <FloatingLabelInput
                      id="email"
                      className=""
                      type="email"
                      label="Email Address*"
                      {...register("email", {
                        required: "Required",
                        setValueAs: (value) => value.toLowerCase(),
                        maxLength: {
                          value: 50,
                          message: "Should be 50 characters or less",
                        },
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                          message: "Incorrect email format",
                        },
                      })}
                      error={errors.email?.message}
                    />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FloatingLabelInput
                            id="email"
                            className=""
                            type="email"
                            label="Email Address*"
                            disabled={
                              action == "edit" &&
                              watcher.client_status != "pending"
                            }
                            {...register("email", {
                              required: "Required",
                              maxLength: {
                                value: 50,
                                message: "Should be 50 characters or less",
                              },
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                                message: "Incorrect email format",
                              },
                            })}
                            error={errors.email?.message}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          You cannot update the email address once the member is
                          active
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="first_name"
                    label="First Name*"
                    {...register("first_name", {
                      required: "Required",
                      setValueAs: (value) => value.toLowerCase(),
                      maxLength: {
                        value: 40,
                        message: "Should be 40 characters or less",
                      },
                    })}
                    error={
                      errors?.first_name?.message as keyof MemberInputTypes
                    }
                    className="capitalize"
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="last_name"
                    label="Last Name*"
                    {...register("last_name", {
                      required: "Required",
                      setValueAs: (value) => value.toLowerCase(),
                      maxLength: {
                        value: 40,
                        message: "Should be 40 characters or less",
                      },
                    })}
                    error={errors?.last_name?.message as keyof MemberInputTypes}
                    className="capitalize"
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
                  <Controller
                    name={"dob" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Popover open={dob} onOpenChange={setDob}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute p-0 text-xs left-2 -top-1.5 px-1 bg-white">
                                Date of brith*
                              </span>
                              <Button
                                variant={"outline"}
                                type="button"
                                className={cn(
                                  "w-full pl-3 text-gray-800 text-left font-normal hover:bg-transparent border-[1px]"
                                )}
                              >
                                {(value as Date) ? (
                                  format(value as Date, "dd-MM-yyyy")
                                ) : (
                                  <span>Select date of birth</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                              {errors.dob?.message && (
                                <span className="text-red-500 text-xs mt-[5px]">
                                  {errors.dob?.message}
                                </span>
                              )}
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="center">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={value as Date}
                            defaultMonth={
                              (value as Date) ? (value as Date) : undefined
                            }
                            onSelect={(value) => {
                              onChange(value);
                              setDob(false);
                            }}
                            fromYear={1960}
                            toYear={new Date().getFullYear()}
                            disabled={(date: any) =>
                              date > new Date() || date < new Date("1960-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <div className="relative ">
                  <FloatingLabelInput
                    type="tel"
                    id="phone"
                    label="Landline Number"
                    className=""
                    {...register("phone", {
                      pattern: {
                        value: /^\d{1,15}$/,
                        message: "Must be a number between 1 and 15 digits",
                      },
                    })}
                    error={errors.phone?.message}
                  />
                </div>
                <div className="relative ">
                  <Controller
                    name="mobile_number"
                    control={control}
                    defaultValue=""
                    rules={{ validate: validatePhone }}
                    render={({ field: { onChange, value } }) => (
                      <div className="relative ">
                        <span className="absolute p-0 text-xs left-12 -top-2 px-1 bg-white z-10">
                          Phone Number
                        </span>
                        <PhoneInput
                          defaultCountry="us"
                          value={value}
                          onChange={onChange}
                          // forceDialCode={true}
                          inputClassName="w-full"
                        />
                      </div>
                    )}
                  />
                  {errors.mobile_number && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.mobile_number.message}
                    </span>
                  )}
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="notes"
                    label="Notes"
                    {...register("notes", {
                      maxLength: {
                        value: 200,
                        message: "Notes should not exceed 200 characters",
                      },
                    })}
                    error={errors.notes?.message}
                  />
                </div>

                <div className="relative ">
                  <Controller
                    name={"client_status" as keyof MemberInputTypes}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        onValueChange={(value: statusEnum) =>
                          setValue("client_status", value)
                        }
                        value={value as statusEnum}
                        disabled={value === "pending"}
                      >
                        <SelectTrigger
                          floatingLabel="Status*"
                          className={`text-black`}
                        >
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem
                            value="pending"
                            className={`${action == "edit" && "hidden"}`}
                          >
                            Pending
                          </SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.client_status?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.client_status?.message}
                    </span>
                  )}
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
                        <SelectTrigger className="font-normal capitalize text-gray-800">
                          <SelectValue placeholder="Select Source*" />
                        </SelectTrigger>
                        <SelectContent className="capitalize max-h-52">
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
                    name={"coach_ids" as keyof MemberInputTypes}
                    // rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <MultiSelect
                        floatingLabel={"Assign Coaches"}
                        options={
                          coachesData as { value: number; label: string }[]
                        }
                        defaultValue={watch("coach_ids") || []} // Ensure defaultValue is always an array
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
                  {errors.coach_ids?.message && (
                    <span className="text-red-500 text-xs mt-[5px]">
                      {errors.coach_ids?.message}
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
                        <SelectTrigger className="capitalize  font-normal text-gray-800">
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          className="capitalize max-h-52"
                        >
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
                                  {sourceval.full_name}
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
                <div className="relative">
                  <Controller
                    name={"nic" as keyof MemberInputTypes}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\d{5}-\d{7}-\d$/,
                        message: "NIC format should be #####-#######-#",
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FloatingLabelInput
                        label="nic"
                        type="text"
                        value={String(value ?? "")} // Convert to string explicitly
                        onChange={(e) => onChange(formatNIC(e.target.value))}
                      />
                    )}
                  />
                  {errors.nic && (
                    <p className="text-red-500 text-xs pt-2">
                      {errors.nic.message}
                    </p>
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
                    {...register("address_1", {
                      maxLength: {
                        value: 50,
                        message: "Address should be less than 50 characters",
                      },
                    })}
                    error={errors.address_1?.message}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="address_2"
                    label="Extra Address"
                    {...register("address_2", {
                      maxLength: {
                        value: 50,
                        message: "Address should be less than 50 characters",
                      },
                    })}
                    error={errors.address_2?.message}
                  />
                </div>
                <div className="relative ">
                  <FloatingLabelInput
                    id="zipcode"
                    label="Zip Code"
                    {...register("zipcode", {
                      maxLength: {
                        value: 15,
                        message: "Zip code should be less than 15 characters",
                      },
                    })}
                    error={errors.zipcode?.message}
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
                        <Popover open={country} onOpenChange={setCountry}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "font-normal text-gray-800 border-[1px] justify-between hover:bg-transparent hover:text-gray-800",
                                  !value && "  focus:border-primary "
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
                                          setCountry(false);
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
                    {...register("city", {
                      maxLength: {
                        value: 50,
                        message: "City should be less than 50 characters",
                      },
                    })}
                    error={errors?.city?.message as keyof MemberInputTypes}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg my-2 text-gray-900">
                  Membership and Auto Renewal
                </h1>
              </div>
              <div className="flex gap-2 flex-col">
                {membershipPlansdata?.map(
                  (plan: membership_planids, index: number) => (
                    <>
                      {membershipPlansdata?.length > 1 && index > 0 && (
                        <div className="pt-2">
                          <Separator />
                        </div>
                      )}

                      <div className="font-semibold text-base pt-1 text-black pb-3">
                        Membership Plan {index + 1}
                      </div>
                      <div className="grid grid-cols-12 gap-3" key={index}>
                        <div className="relative col-span-4">
                          <Select
                            onValueChange={(value) =>
                              handleMembershipPlanChange(
                                index,
                                "membership_plan_id",
                                Number(value)
                              )
                            }
                            value={
                              plan.membership_plan_id
                                ? plan.membership_plan_id.toString()
                                : ""
                            }
                          >
                            <FormControl>
                              <SelectTrigger
                                className={`font-normal capitalize text-gray-800`}
                              >
                                <SelectValue placeholder="Select membership plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="capitalize max-h-52">
                              {membershipPlans && membershipPlans.length > 0 ? (
                                membershipPlans.map(
                                  (sourceval: membeshipsTableType) => (
                                    <SelectItem
                                      key={sourceval.id}
                                      value={sourceval.id?.toString()}
                                    >
                                      {sourceval.name}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <p>No Membership plan found</p>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="relative col-span-2 flex justify-center items-center gap-2">
                          <Switch
                            id="airplane-mode"
                            checked={plan.auto_renewal}
                            onCheckedChange={(value) =>
                              handleMembershipPlanChange(
                                index,
                                "auto_renewal",
                                value
                              )
                            }
                            disabled={!plan.membership_plan_id}
                          />
                          <Label className="!mt-0">Auto renewal</Label>
                        </div>

                        {plan.auto_renewal && (
                          <>
                            {/* Row for Prolongation Period */}
                            <div className="relative col-span-6 flex items-center gap-3">
                              <Label className="text-base">
                                Prolongation period*
                              </Label>
                              <FloatingLabelInput
                                id="prolongation_period"
                                type="number"
                                min={1}
                                max={12}
                                className="w-16"
                                value={plan.prolongation_period}
                                onChange={(e) =>
                                  handleMembershipPlanChange(
                                    index,
                                    "prolongation_period",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Row for Auto Renewal Days */}
                            <div className="relative col-span-6 flex items-center gap-3">
                              <Label className="text-base">
                                Auto renewal takes place*
                              </Label>
                              <FloatingLabelInput
                                id="auto_renew_days"
                                type="number"
                                min={1}
                                max={15}
                                className="w-16"
                                value={plan.auto_renew_days}
                                onChange={(e) =>
                                  handleMembershipPlanChange(
                                    index,
                                    "auto_renew_days",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-sm text-black/60">
                                days before contract runs out.
                              </span>
                            </div>

                            {/* Row for Next Invoice */}
                            <div className="relative col-span-6 flex items-center gap-3">
                              <Label className="text-base pr-4">
                                Next invoice will be <br />
                                created*
                              </Label>
                              <FloatingLabelInput
                                id="inv_days_cycle"
                                type="number"
                                min={1}
                                max={15}
                                className="w-16"
                                value={plan.inv_days_cycle}
                                onChange={(e) =>
                                  handleMembershipPlanChange(
                                    index,
                                    "inv_days_cycle",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-sm text-black/60">
                                days before contract runs out.
                              </span>
                              {membershipPlansdata?.length && (
                                <Button
                                  type="button"
                                  className="text-red-500"
                                  variant={"ghost"}
                                  disabled={
                                    membershipPlansdata.length === 0 ||
                                    membershipPlansdata.some(
                                      (plan) =>
                                        plan.membership_plan_id === undefined ||
                                        plan.membership_plan_id === null
                                    )
                                  }
                                  onClick={() => handleRemovePlan(index)}
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <i className="fa-solid fa-trash"></i>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Delete Membership plan
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </Button>
                              )}
                            </div>
                          </>
                        )}

                        {!plan.auto_renewal && membershipPlansdata?.length && (
                          <Button
                            type="button"
                            className="text-red-500"
                            variant={"ghost"}
                            disabled={
                              membershipPlansdata.length === 0 ||
                              membershipPlansdata.some(
                                (plan) =>
                                  plan.membership_plan_id === undefined ||
                                  plan.membership_plan_id === null
                              )
                            }
                            onClick={() => handleRemovePlan(index)}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <i className="fa-solid fa-trash"></i>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Delete Membership plan
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        )}
                      </div>
                    </>
                  )
                )}

                <div>
                  <Button
                    type="button"
                    onClick={handleAddPlan}
                    variant={"ghost"}
                    disabled={
                      membershipPlansdata.length === 0 ||
                      membershipPlansdata.some(
                        (plan) =>
                          plan.membership_plan_id === undefined ||
                          plan.membership_plan_id === null
                      )
                    }
                    className="text-primary !hover:bg-none !hover:text-primary"
                  >
                    + Assign more Membership
                  </Button>
                </div>
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
                  <AlertDialogTitle className="text-lg font-medium w-full text-center">
                    The email is already registered in the system.
                    <br />
                    <span className="">
                      Would you like to auto-fill the details?
                    </span>
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
