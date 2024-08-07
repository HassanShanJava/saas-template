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
  useAddMemberMutation,
  useUpdateMemberMutation,
  useGetMemberByIdQuery,
} from "@/services/memberAPi";

import {
  useGetCoachListQuery,

} from '@/services/coachApi'
import { useGetMembershipsQuery } from "@/services/membershipsApi";
import { useParams } from "react-router-dom";
import { UploadCognitoImage } from "@/utils/lib/s3Service";
enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}

const coachsSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const MemberForm: React.FC = () => {
  const { id } = useParams();
  console.log({ id });
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const initialState: MemberInputTypes = {
    profile_img: "",
    own_member_id: "",
    first_name: "",
    last_name: "",
    gender: genderEnum.male,
    dob: "",
    email: "",
    phone: "",
    mobile_number: "",
    notes: "",
    source_id: undefined,
    is_business: false,
    business_id: undefined,
    country_id: undefined,
    city: "",
    zipcode: "",
    address_1: "",
    address_2: "",
    org_id: orgId,
    coach_id: [] as z.infer<typeof coachsSchema>[],
    membership_plan_id: undefined,
    send_invitation: true,
    status: "pending",
    client_since: new Date().toISOString().split("T")[0],
    auto_renewal: false,
    prolongation_period: undefined,
    auto_renew_days: undefined,
    inv_days_cycle: undefined,
  };

  const navigate = useNavigate();
  const [counter, setCounter] = React.useState(0);
  const [initialValues, setInitialValues] =
    React.useState<MemberInputTypes>(initialState);

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);

  const FormSchema = z
    .object({
      profile_img: z.string().trim().default("").optional(),
      own_member_id: z.string({
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
        required_error: "Required",
      }),
      dob: z.coerce.string({
        required_error: "Required",
      }),
      email: z
        .string()
        .email({ message: "Invalid email" })
        .min(4, { message: "Required" }),
      phone: z.string().trim().optional(),
      mobile_number: z.string().trim().optional(),
      notes: z.string().optional(),
      source_id: z.number({
        required_error: "Required",
      }),
      is_business: z.boolean().default(false),
      business_id: z.coerce.number().optional(),
      country_id: z
        .number({
          required_error: "Required",
        })
        .refine((val) => val !== 0, {
          message: "Required",
        }),
      city: z.string().trim().optional(),
      zipcode: z.string().trim().optional(),
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      org_id: z
        .number({
          required_error: "Required",
        })
        .default(orgId),
      coach_id: z.array(z.any()).nonempty({
        message: "Required",
      }),
      membership_plan_id: z.number({
        required_error: "Required",
      }),
      send_invitation: z.boolean().default(true).optional(),
      auto_renewal: z.boolean().default(false).optional(),
      status: z.string().default("pending"),
      client_since: z
        .string()
        .date()
        .default(new Date().toISOString().split("T")[0]),
      prolongation_period: z.coerce.number().optional(),
      auto_renew_days: z.coerce.number().optional(),
      inv_days_cycle: z.coerce.number().optional(),
    })
    .refine(
      (input) => {
        if (
          input.auto_renewal == true &&
          (input.prolongation_period == undefined ||
            input.auto_renew_days == undefined ||
            input.inv_days_cycle == undefined)
        ) {
          return false;
        }

        if (input.is_business == false && input.business_id == undefined) {
          return false;
        }

        return true;
      },
      {
        message: "All required fields must be filled correctly.",
        path: ["auto_renewal", "is_business"],
      }
    );

  // conditional fetching
  const { data: memberCountData } = useGetMemberCountQuery(orgId, {
    skip: id !== undefined,
  });
  const { data: memberData } = useGetMemberByIdQuery(Number(id), {
    skip: isNaN(Number(id)),
  });
  const { data: countries } = useGetCountriesQuery();
  const { data: business } = useGetAllBusinessesQuery(orgId);
  const { data: coachesData } = useGetCoachListQuery(orgId);
  const { data: sources } = useGetAllSourceQuery();
  const { data: membershipPlans } = useGetMembershipsQuery({
    org_id: orgId,
    query: "",
  });
  const [addMember, { isLoading: memberLoading }] = useAddMemberMutation();
  const [editMember, { isLoading: editLoading, isError }] =
    useUpdateMemberMutation();

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
    defaultValues: initialValues,
    mode: "onChange",
  });

  const watcher = form.watch();
  const memberError = form.formState.errors;

  React.useEffect(() => {
    console.log({ memberData }, "jh");
    if (!memberData) {
      if (orgName) {
        const total = memberCountData?.total_members as number;
        if (total >= 0) {
          form.setValue("own_member_id", `${orgName.slice(0, 2)}-${total + 1}`);
        }
      }
    } else {
      const initialValue = { ...memberData };
      const data = membershipPlans?.filter(
        (item) => item.id == memberData.membership_plan_id
      )[0];
      const renewalDetails = data?.renewal_details as renewalData;
      initialValue.auto_renewal = data?.auto_renewal ?? false;
      if (initialValue?.auto_renewal) {
        initialValue.prolongation_period =
          (renewalDetails?.prolongation_period as number | undefined) ??
          undefined;
        initialValue.auto_renew_days =
          (renewalDetails?.days_before as number | undefined) ?? undefined;
        initialValue.inv_days_cycle =
          (renewalDetails?.next_invoice as number | undefined) ?? undefined;
      }
      setInitialValues(initialValue as MemberInputTypes);
      form.reset(initialValue);
      setAvatar(initialValue.profile_img as string);
    }
  }, [memberData, memberCountData, orgName]);

  // set auto_renewal
  const handleMembershipPlanChange = (value: number) => {
    form.setValue("membership_plan_id", value);
    const data = membershipPlans?.filter((item) => item.id == value)[0];
    const renewalDetails = data?.renewal_details as renewalData;
    form.setValue("auto_renewal", data?.auto_renewal);
    if (data?.auto_renewal) {
      form.setValue(
        "prolongation_period",
        renewalDetails?.prolongation_period ?? undefined
      );
      form.setValue(
        "auto_renew_days",
        renewalDetails?.days_before ?? undefined
      );
      form.setValue(
        "inv_days_cycle",
        renewalDetails?.next_invoice ?? undefined
      );
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
      coach_id: data.coach_id.map((coach) => coach.id),
    };

    if (selectedImage) {
      try {
        const getUrl = await UploadCognitoImage(selectedImage);
        updatedData = {
          ...updatedData,
          profile_img: getUrl?.location as string,
        };
      } catch (error) {
        console.error("Upload failed:", error);
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
      if (id == undefined || id == null) {
        console.log({ updatedData }, "add");
        const resp = await addMember(updatedData).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Added Successfully ",
          });
          navigate("/admin/members");
        }
      } else {
        console.log({ updatedData, id: +id }, "update");
        const resp = await editMember({
          ...updatedData,
          id: Number(id),
        }).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title: "Updated Successfully ",
          });
          navigate("/admin/members");
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
    }
  }

  function gotoMember() {
    navigate("/admin/members");
  }

  console.log({ watcher, memberError });

  console.log("selected image", selectedImage);
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
                      onClick={gotoMember}
                      className="gap-2 bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                      loading={form.formState.isSubmitting}
                      disabled={form.formState.isSubmitting}
                    >
                      {!form.formState.isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Member Data</h1>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 justify-between items-center">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="own_member_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_member_id"
                          label="Member Id"
                          className=""
                        />
                        {watcher.own_member_id ? <></> : <FormMessage />}
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
                          className=""
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
                          className=""
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
                              <SelectValue
                                placeholder="Select Gender"
                                className=""
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="">
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
                                        "w-full pl-3 text-left font-normal ",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "dd-MM-yyyy")
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
                                  selected={new Date(field.value)}
                                  defaultMonth={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
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
                          className=""
                          label="Email Address*"
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
                          className=""
                        />
                        {watcher.phone ? <></> : <FormMessage />}
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
                          className=""
                        />
                        {watcher.mobile_number ? <></> : <FormMessage />}
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
                          className=""
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
                          value={field.value?.toString()} // Set default to "0" for the placeholder
                        >
                          <FormControl>
                            <SelectTrigger
                              className={"font-medium text-gray-400 "}
                            >
                              <SelectValue
                                className=""
                                placeholder="Select Source*"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sources && sources.length > 0 ? (
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
                    name="coach_id"
                    render={({ field }) => (
                      <FormItem>
                        <MultiSelector
                          onValuesChange={(values) => field.onChange(values)}
                          values={field.value}
                        >
                          <MultiSelectorTrigger className="border-[1px] border-gray-300">
                            <MultiSelectorInput
                              className="font-medium  "
                              placeholder={
                                field.value.length == 0 ? `Select Coaches*` : ""
                              }
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent className="">
                            <MultiSelectorList>
                              {coachesData &&
                                coachesData.map((user: any) => (
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
                        {watcher.coach_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative ">
                  <div className="justify-start items-center flex">
                    <FormField
                      control={form.control}
                      name="is_business"
                      render={({ field }) => (
                        <FormItem className="flex flex-row gap-3 items-center justify-between ">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Business :
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div
                  className={`relative  ${watcher.is_business ? "hidden" : ""}`}
                >
                  <FormField
                    control={form.control}
                    name="business_id"
                    // rules={{
                    //   validate: (value) => {
                    //     // Ensure value is treated as a number for comparison
                    //     return Number(value) !== 0;
                    //   },
                    // }}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("business_id", Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="font-medium text-gray-400">
                              <SelectValue placeholder="Select Business*" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <Button
                              variant={"link"}
                              className="gap-2 text-black"
                            >
                              <PlusIcon className="text-black w-5 h-5" /> Add
                              New business
                            </Button>
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
                          className=""
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
                          className=""
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
                          className=""
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
                                  "justify-between ",
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
                          label="City"
                          className=""
                        />
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
              <div>
                <h1 className="font-bold text-base">
                  Membership and Auto Renewal
                </h1>
              </div>
              <div className="grid grid-cols-12 gap-3">
                <div className="relative col-span-4">
                  <FormField
                    control={form.control}
                    name="membership_plan_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            handleMembershipPlanChange(Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`font-medium text-gray-400`}
                            >
                              <SelectValue
                                className="text-gray-400"
                                placeholder="Select membership plan*"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {membershipPlans && membershipPlans?.length ? (
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className="h-full relative col-span-2">
                  <FormField
                    control={form.control}
                    name="auto_renewal"
                    render={({ field }) => (
                      <FormItem className="h-10 flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Auto renewal?</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {watcher.auto_renewal && (
                  <>
                    <div className="relative col-span-6">
                      <FormField
                        control={form.control}
                        name="prolongation_period"
                        render={({ field }) => {
                          console.log(form.formState.errors);
                          return (
                            <FormItem className="flex h-10 items-center gap-3">
                              <FormLabel className="text-base">
                                Prolongation period*
                              </FormLabel>
                              <FloatingLabelInput
                                {...field}
                                id="prolongation_period"
                                type="number"
                                min={1}
                                name="min_limit"
                                className=" w-16"
                              />
                              {watcher.prolongation_period ? (
                                <></>
                              ) : (
                                <FormMessage />
                              )}
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="relative col-span-5">
                      <FormField
                        control={form.control}
                        name="auto_renew_days"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex h-10 items-center gap-3">
                              <FormLabel className="text-sm">
                                Auto renewal takes place*
                              </FormLabel>
                              <FloatingLabelInput
                                {...field}
                                id="auto_renew_days"
                                type="number"
                                min={1}
                                name="min_limit"
                                className="w-16"
                              />
                              {watcher.auto_renew_days ? (
                                <></>
                              ) : (
                                <FormMessage />
                              )}
                              <Label className="text-xs text-black/60">
                                days before contracts runs out.
                              </Label>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="relative col-span-7">
                      <FormField
                        control={form.control}
                        name="inv_days_cycle"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex h-10 items-center gap-3">
                              <FormLabel className="text-sm">
                                Next invoice will be created *
                              </FormLabel>
                              <FloatingLabelInput
                                {...field}
                                id="inv_days_cycle"
                                type="number"
                                min={1}
                                name="min_limit"
                                className="w-16"
                              />
                              {watcher.inv_days_cycle ? <></> : <FormMessage />}
                              <Label className="text-xs text-black/60">
                                days before contracts runs out.
                              </Label>
                            </FormItem>
                          );
                        }}
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

export default MemberForm;
