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
  CoachTypes,
  CountryTypes,
  ErrorType,
  membershipplanTypes,
  membeshipsTableType,
  sourceTypes,
} from "@/app/types";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Label } from "@/components/ui/label";
import {
	useGetAllBusinessesQuery,
	useGetAllSourceQuery,
	useGetCountriesQuery,
	useGetCoachesQuery,
	useGetMemberCountQuery,
	useAddMemberMutation
} from "@/services/memberAPi";

import { useGetMembershipsQuery } from "@/services/membershipsApi";

const AddMemberForm: React.FC = () => {
  const [counter, setCounter] = React.useState(0);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const FormSchema = z.object({
    profile_img: z
      .string()
      .trim()
      .default(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      )
      .optional(),
    own_member_id: z.string({
      required_error: "Own Member Id Required.",
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
    gender: z.enum(["male", "female", "other"], {
      required_error: "You need to select a gender type.",
    }),
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    email: z
    .string()
    .email({ message: "Invalid email" })
    .min(4, { message: "Email is Required" }),
    phone: z.string().trim().optional(),
    mobile_number: z.string().trim().optional(),
    notes: z.string().optional(),
    source_id: z
      .number({
        required_error: "Source Required.",
      })
      .refine((val) => val !== 0, {
        message: "Source is required",
      }),
    is_business: z.boolean().default(false).optional(),
    business_id: z.number().optional(),
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
    zipcode: z.string().trim().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    org_id: z
      .number({
        required_error: "Org id is required",
      })
      .default(orgId),
    coach_id: z.number().optional(),
    membership_id: z
      .number({
        required_error: "Membership plan is required.",
      })
      .refine((val) => val !== 0, {
        message: "membership plan is required",
      }),
    send_invitation: z.boolean().default(true).optional(),
    status: z.string().default("pending"),
    client_since: z
      .string()
      .date()
      .default(new Date().toISOString().split("T")[0]),
		prolongation_period: z.coerce.number(),
		auto_renew_days: z.coerce.number(),
		inv_days_cycle: z.coerce.number(),
  });
  // Example of handling async data fetching before form initialization

  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const {
    data: memberCountData,
    isLoading,
    refetch,
  } = useGetMemberCountQuery(orgId);

  const { data: countries } = useGetCountriesQuery();

  const { data: business } = useGetAllBusinessesQuery(orgId);

  const { data: coaches } = useGetCoachesQuery(orgId);

  const { data: sources } = useGetAllSourceQuery();
  const { data: membershipPlans } = useGetMembershipsQuery(orgId);

  const [loading, setLoading] = React.useState(true);

  const [addMember, { isLoading: memberLoading }] = useAddMemberMutation();
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
      is_business: false,
      own_member_id: "",
      prolongation_period: 1,
    },
    mode: "onChange",
  });

  const watcher = form.watch();

  const refreshComponent = () => {
    // Update state to trigger re-render
    setCounter(counter + 1); // Incrementing state to force a re-render
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedData = {
      ...data,
      dob: format(new Date(data.dob!), "yyyy-MM-dd"),
    };

    console.log("Updated data with only date:", updatedData);
    console.log("only once", data);
    // form.reset();
    //    form.reset({
    //      profile_img: "",
    //      own_member_id:`${orgName?.slice(0, 2)! as string}-${memberCountData?.total_clients! + 1}` as string,
    //      first_name: "",
    //      last_name: "",
    //      gender: "male",
    //      dob: undefined,
    //      email: "",
    //      phone: "",
    //      mobile_number: "",
    //      notes: "",
    //      source_id: 0,
    //      is_business: false,
    //      business_id: 0,
    //      country_id: undefined,
    //      city: "",
    //      zipcode: "",
    //      address_1: "",
    //      address_2: "",
    //      org_id: orgId,
    //      coach_id: NaN,
    //      membership_id: 0,
    //      send_invitation: true,
    //      status: "pending",
    //      client_since: new Date().toISOString().split("T")[0],
    //    });

    try {
      let resp = await addMember(updatedData).unwrap();
      refetch();
      //   console.log(resp);
      //   form.reset({
      //     profile_img: "",
      //     own_member_id: "",
      //     first_name: "",
      //     last_name: "",
      //     gender: "male",
      //     dob: undefined,
      //     email: "",
      //     phone: "",
      //     mobile_number: "",
      //     notes: "",
      //     source_id: undefined,
      //     is_business: false,
      //     business_id: undefined,
      //     country_id: undefined,
      //     city: "",
      //     zipcode: "",
      //     address_1: "",
      //     address_2: "",
      //     org_id: orgId,
      //     coach_id: undefined,
      //     membership_id: undefined,
      //     send_invitation: true,
      //     status: "pending",
      //     client_since: new Date().toISOString().split("T")[0],
      //   });
      toast({
        variant: "success",
        title: "Member Added Successfully ",
      });
      navigate("/admin/members");
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

  function gotoMember() {
    navigate("/admin/members");
  }

  React.useEffect(() => {
    if (orgName) {
      const total = memberCountData?.total_clients!;
      form.setValue("own_member_id", `${orgName.slice(0, 2)}-${total + 1}`);
    }
  }, [memberCountData, orgName]);

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
                      className="gap-2 bg-transparent border border-primary text-black hover:bg-red-300 hover:text-white"
                    >
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    {memberLoading ? (
                      <LoadingButton
                        loading
                        className="gap-2 text-black hover:opacity-90 hover:text-white"
                      >
                        {" "}
                        adding Member
                      </LoadingButton>
                    ) : (
                      <Button
                        type="submit"
                        className="gap-2 text-black hover:opacity-90 hover:text-white"
                      >
                        <PlusIcon className="h-4 w-4 hover:text-white" /> Add
                      </Button>
                    )}
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
                    rules={{
                      validate: (value) => {
                        // Ensure value is treated as a number for comparison
                        return Number(value) !== 0 || "Source is required";
                      },
                    }}
                    name="own_member_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_member_id"
                          label="Member Id"
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
													defaultValue="male"
                          onValueChange={(value: "male" | "female" | "other") => form.setValue("gender", value)}
                        >
                          <FormControl>
                            <SelectTrigger
															floatingLabel="Gender"
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
                        {watcher.source_id ? <></> : <FormMessage />}
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
                              className={`${watcher.source_id ? "text-black" : ""}`}
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
                            <SelectItem value="0">Select Source*</SelectItem>{" "}
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
                    name="coach_id"
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
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString() || "0"}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.coach_id ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-black"
                                placeholder="Select Coach"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Coach</SelectItem>
                            {coaches && coaches.length > 0 ? (
                              coaches?.map((sourceval: CoachTypes) => {
                                // console.log(field.value);
                                return (
                                  <SelectItem
                                    key={sourceval.id}
                                    value={sourceval.id?.toString()}
                                  >
                                    {sourceval.coach_name}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <>
                                <p className="p-2"> No Coach Found</p>
                              </>
                            )}
                          </SelectContent>
                        </Select>
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
                        <FormItem className="flex flex-row gap-3 items-center justify-between">
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
                <div className={`relative  ${watcher.is_business ? "hidden" : ""}`} >
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
                          onValueChange={(value) => form.setValue("country_id", Number(value))}
                          defaultValue={field.value?.toString() || "0"}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.business_id ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-gray-400"
                                placeholder="Select Business*"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Select Business*</SelectItem>{" "}
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
																	!field.value && "text-muted-foreground focus:border-primary "
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
								<h1 className="font-bold text-base">Membership and Auto Renewal</h1>
							</div>
							<div className="grid grid-cols-10 gap-3">
								<div className="relative col-span-4">
									<FormField
									control={form.control}
									name="membership_id"
									rules={{
										validate: (value) => {
										// Ensure value is treated as a number for comparison
										return (
											Number(value) !== 0 || "Memberhip Plan is Required"
										);
										},
									}}
									render={({ field }) => (
										<FormItem>
										<Select
											onValueChange={(value) =>
											field.onChange(Number(value))
											}

										>
											<FormControl>
											<SelectTrigger
												className={`${watcher.membership_id ? "text-black" : ""}`}
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
										{watcher.membership_id ? <></> : <FormMessage />}
										</FormItem>
									)}
									/>
								</div>
								<div className="h-full relative col-span-2">
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
												<FormLabel className="!mt-0">Auto renewal?</FormLabel>
											</FormItem>
										)}
									/>
								</div>
								<div className="relative col-span-4">
									<FormField
									control={form.control}
									name="prolongation_period"
									rules={{
										validate: (value) => {
										// Ensure value is treated as a number for comparison
										return (
											Number(value) !== 0 || "Memberhip Plan is Required"
										);
										},
									}}
									render={({ field }) => {
										console.log(form.formState.errors)
										return <FormItem className="flex h-10 items-center gap-3">
											<FormLabel className="text-base">Prolongation period*</FormLabel>
											<FloatingLabelInput
												{...field}
												id="min_limit"
												type="number"
												min={1}
												name="min_limit"
												className="number-input w-10"
											/>
											{watcher.prolongation_period ? <></> : <FormMessage />}
										</FormItem>
										}}
									/>
								</div>
								<div className="relative col-span-5">
									<FormField
									control={form.control}
									name="auto_renew_days"
									rules={{
										validate: (value) => {
										// Ensure value is treated as a number for comparison
										return (
											Number(value) !== 0 || "Memberhip Plan is Required"
										);
										},
									}}
									render={({ field }) => {
										console.log(form.formState.errors)
										return <FormItem className="flex h-10 items-center gap-3">
											<FormLabel className="text-sm">Auto renewal takes place*</FormLabel>
											<FloatingLabelInput
												{...field}
												id="min_limit"
												type="number"
												min={1}
												name="min_limit"
												className="number-input w-10"
											/>
											{watcher.auto_renew_days ? <></> : <FormMessage />}
										<Label className="text-xs text-black/20">days before contracts runs out.</Label>
										</FormItem>
										}}
									/>
								</div>
								<div className="relative col-span-5">
									<FormField
									control={form.control}
									name="inv_days_cycle"
									rules={{
										validate: (value) => {
										// Ensure value is treated as a number for comparison
										return (
											Number(value) !== 0 || "Memberhip Plan is Required"
										);
										},
									}}
									render={({ field }) => {
										console.log(form.formState.errors)
										return <FormItem className="flex h-10 items-center gap-3">
											<FormLabel className="text-sm">Next invoice will be created *</FormLabel>
											<FloatingLabelInput
												{...field}
												id="min_limit"
												type="number"
												min={1}
												name="min_limit"
												className="number-input w-10"
											/>
											{watcher.inv_days_cycle ? <></> : <FormMessage />}
										<Label className="text-xs text-black/20">days before contracts runs out.</Label>
										</FormItem>
										}}
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

export default AddMemberForm;
