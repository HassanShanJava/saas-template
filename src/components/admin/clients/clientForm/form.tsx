import { format } from "date-fns";
import { Check, ChevronDownIcon} from "lucide-react";
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
import { getFormData, SubmitForm } from "@/services/ClientService";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import { PlusIcon, CameraIcon, Webcam } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormMessage,FormLabel,FormControl } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/buttonGroup/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBusinessesQuery,
  useGetAllMembershipsQuery,
  useGetAllSourceQuery,
  useGetClientCountQuery,
  useGetCountriesQuery,
  useGetCoachesQuery,
  useAddClientMutation
} from "@/services/clientAPi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { BusinessTypes, CoachTypes, CountryTypes, membershipplanTypes, sourceTypes } from "@/app/types";
// import {FormSchema} from "@/schema/formSchema"

const AddClientForm: React.FC = () => {
  // Function to generate client ID string
  // const generateClientId = (orgName: string, clientId: number | undefined) => {
  //   // Ensure clientId is defined by defaulting to 0 if it's undefined
  //   let incrementedClientId = (clientId || 0) + 1;
  //   let clientIdString = `${orgName.slice(0, 2)}-${incrementedClientId}`;
  //   return clientIdString;
  // };
const orgId =
  useSelector((state: RootState) => state.auth.userInfo?.org_id) || 0;
  const FormSchema = z.object({
    profile_img: z
      .string()
      .trim()
      .default(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      ),
    own_member_id: z.string({
      required_error: "Own Member Id Required.",
    }),
    first_name: z
      .string({
        required_error: "Firstname Required.",
      })
      .trim()
      .min(4, { message: "First Name Is Required." }),
    last_name: z
      .string({
        required_error: "Lastname Required.",
      })
      .trim()
      .min(4, { message: "Last Name Is Required" }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "You need to select a gender type.",
    }),
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    email: z
      .string({
        required_error: "Email is Required.",
      })
      .email()
      .trim(),
    phone: z.string().trim().optional(),
    mobile_number: z.string().trim().optional(),
    notes: z.string().optional(),
    source_id: z.number({
      required_error: "Source Required.",
    }),
    is_business: z.boolean().default(false).optional(),
    business_id: z.number().optional(),
    country_id: z.number({
      required_error: "Country Required.",
    }),
    city: z
      .string({
        required_error: "City Required.",
      })
      .trim(),
    zipcode: z.string().trim().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    org_id: z
      .number({
        required_error: "Org id is required",
      })
      .default(orgId),
    coach_id: z.number().optional(),
    membership_id: z.number({
      required_error: "Membership plan is required.",
    }),
    send_invitation: z.boolean().default(true).optional(),
    status: z.string().default("pending"),
    client_since: z
      .string()
      .date()
      .default(new Date().toISOString().split("T")[0]),
  });
  // Example of handling async data fetching before form initialization
  
  const orgName =useSelector((state: RootState) => state.auth.userInfo?.org_name);
  const { data: clientCountData, isLoading } = useGetClientCountQuery(orgId);


  const { data: countries } = useGetCountriesQuery();

  const { data: business } = useGetAllBusinessesQuery(orgId);

  const { data: coaches } = useGetCoachesQuery(orgId);

  const { data: sources } = useGetAllSourceQuery();
  const { data: membershipPlans } = useGetAllMembershipsQuery(orgId);

  const [loading, setLoading] = React.useState(true);

  const [addClient]=useAddClientMutation();
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
      own_member_id:""
    },
    mode: "onChange",
  });

  const watcher = form.watch();
  



 async function onSubmit(data: z.infer<typeof FormSchema>) {
     const updatedData = {
       ...data,
       dob: format(new Date(data.dob), "yyyy-MM-dd"),
     };

    console.log("Updated data with only date:", updatedData);
    // console.log("only once",data);
    try{
      let resp=await addClient(updatedData).unwrap();
      console.log(resp);
      form.reset();
    }catch(error){
      console.log("Error",error);
    }
    // event?.preventDefault();
    // SubmitForm(data);
    // const id = formData.newClientId && formData.newClientId;
    //       console.log(
    //         "Member id",
    //         formData.newClientId && formData.newClientId
    //       );
    // form.reset(
    //   {
    //     own_member_id:id
    //   }
    // );
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 1)}</code>
    //     </pre>
    //   ),
    // });
  }

  function gotoClient() {
    navigate("/admin/client");
  }

  React.useEffect(()=>{
    if(orgName){
      const total = clientCountData?.total_clients!;
      form.setValue("own_member_id", `${orgName.slice(0, 2)}-${total+1}`);
    }
  },[clientCountData,orgName])
  //  console.log(typeof newClientId?.total_clients); // Check the type of org_name\
  // console.log("client id", clientCountData?.total_clients);

  //  console.log("Name of the org", org_name, orgId);
 
  // console.log(
  //   "starting return state to check own member id",
  //   form.getValues().own_member_id
  // );

  return (
    <div className="p-6 bg-bgbackground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-7 px-4">
            <CardContent>
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
                      onClick={gotoClient}
                      className="gap-2 bg-transparent border border-primary text-black hover:bg-red-300 hover:text-white"
                    >
                      <RxCross2 className="w-4 h-4" /> cancel
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="gap-2 text-black hover:opacity-90 hover:text-white"
                    >
                      <PlusIcon className="h-4 w-4 hover:text-white" /> Add
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base"> Client Data</h1>
              </div>
              <div className="w-full flex justify-between items-center pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="own_member_id"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_member_id"
                          label="Own_Member_Id"
                        />
                        {watcher.own_member_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="first_name"
                          label="First Name"
                        />
                        {watcher.first_name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="last_name"
                          label="Last Name"
                        />
                        {watcher.last_name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="gender"
                    defaultValue="male"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex justify-start items-center mb-4">
                          <FormLabel className="xl:mr-4 lg:mr-1 xl:text-base lg:text-xs">
                            Select :
                          </FormLabel>
                          <FormControl>
                            <ButtonGroup
                              onValueChange={field.onChange}
                              defaultValue="male"
                              className="flex flex-row xl:gap-2 lg:gap-1"
                            >
                              <ButtonGroupItem value="male" label="Male" />
                              <ButtonGroupItem value="female" label="Female" />
                              <ButtonGroupItem value="other" label="Other" />
                            </ButtonGroup>
                          </FormControl>
                        </div>
                        {watcher.gender ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
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
                                  <span>Date of Birth</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="center">
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
                </div>

                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Email Address"
                        />
                        {watcher.email ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-1">
                <div className="relative w-[33%]">
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

                <div className="relative w-[33%]">
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
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="coach_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.coach_id ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-black"
                                placeholder="Coach_id"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
              </div>
              <div className="w-full flex justify-between items-start mt-3">
                <div className="relative w-[33%]">
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
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="source_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.source_id ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sources && sources?.length ? (
                              sources.map((sourceval: sourceTypes, i: any) => (
                                <SelectItem
                                  value={sourceval.id?.toString()}
                                  key={i}
                                >
                                  {sourceval.source}
                                </SelectItem>
                              ))
                            ) : (
                              <>
                                <p className="p-2"> No Sources Found</p>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        {watcher.source_id ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="membership_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.membership_id ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-gray-400"
                                placeholder="Membership Plan"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {membershipPlans && membershipPlans?.length ? (
                              membershipPlans.map(
                                (sourceval: membershipplanTypes) => {
                                  // console.log(field.value);
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
              </div>
              <div className="w-full flex justify-between items-start pt-3">
                <div className="relative w-[33%]"></div>
                <div className="relative w-[33%]"></div>
                <div className="relative w-[33%]"></div>
              </div>
              <div className="w-full flex justify-between items-start pt-1.5">
                <div className="relative w-[33%]">
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
                <div
                  className={`relative w-[33%] ${watcher.is_business ? "hidden" : ""}`}
                >
                  <FormField
                    control={form.control}
                    name="business_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.business_id ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-gray-400"
                                placeholder="Business"
                              />
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
                            {business?.length ? (
                              business.map((sourceval: BusinessTypes) => {
                                // console.log(sourceval.name);
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

                            {business &&
                              business.map((sourceval: BusinessTypes) => {
                                // console.log(field.value);
                                return (
                                  <SelectItem
                                    value={sourceval.id?.toString()}
                                    key={sourceval.id}
                                  >
                                    {sourceval.first_name}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]"></div>
              </div>

              <div className="w-full flex flex-col justify-between items-start pb-5 pt-3">
                <div>
                  <h1 className="font-bold text-base"> Address data</h1>
                </div>
                <div className="w-full flex justify-between items-center pt-3">
                  <div className="relative w-[33%]">
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
                  <div className="relative w-[33%]">
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
                  <div className="relative w-[33%]">
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
                </div>
                <div className="w-full flex justify-start gap-2 items-center pt-3">
                  <div className="relative w-[33%]">
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
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
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
                                          value={country.id?.toString()}
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
                  <div className="relative w-[33%]">
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
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="send_invitation"
                      defaultValue={true}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Send invitation</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddClientForm;
