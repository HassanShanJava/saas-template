import { format } from "date-fns";
import { Check, ChevronsUpDown ,CheckCircle, ChevronDownIcon} from "lucide-react";
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
import { getFormData } from "@/services/ClientService";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import { PlusIcon, CameraIcon, Webcam } from "lucide-react";

import { RxCross2 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormMessage,FormLabel,FormControl,FormDescription } from "@/components/ui/form";
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

const FormSchema = z.object({
  profile_url: z
    .string()
    .trim()
    .default(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    ),
  own_member_id: z
    .string({
      required_error: "Id is Required",
    })
    .trim()
    .min(2, { message: "Gym Member ID is required." })
    .optional(),
  first_name: z
    .string({
      required_error: "Firstname Required.",
    })
    .trim()
    .min(2, { message: "First Name Is Required." }),
  last_name: z
    .string({
      required_error: "Lastname Required.",
    })
    .trim()
    .min(2, { message: "Last Name Is Required" }),
  sex: z.enum(["male", "female", "other"], {
    required_error: "You need to select a gender type.",
  }),
  date_of_birth: z.date({
    required_error: "A date of birth is required.",
  }),
  email_address: z
    .string({
      required_error: "Email is Required.",
    })
    .email()
    .trim(),
  landline_number: z.string().trim().optional(),
  mobile_number: z.string().trim().optional(),
  notes: z.string().optional(),
  source: z.string({
    required_error: "Source Required.",
  }),

  coach: z.string().trim().optional(),
  membership: z.string({
    required_error: "Membership plan is required.",
  }),
  is_business: z.boolean().default(false).optional(),
  businessInput: z.string().optional(),
  sendInvitation: z.boolean().default(true).optional(),
  city: z
    .string({
      required_error: "City Required.",
    })
    .trim(),
  zip_code: z.string().trim().optional(),
  streetaddress: z.string().optional(),
  country: z
    .string({
      required_error: "Country Required.",
    })
    .min(1, "Country is Required.")
    .trim(),
  extraAddress: z.string().optional(),
});

const AddClientForm: React.FC = () => {
  const [formData, setFormData] = React.useState<any>({
    coaches: null,
    business: null,
    membershipPlans: null,
    countries:null,
    clientCount:null,
    sources: null
  });

  const [loading, setLoading] = React.useState(true); // Optional loading state

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
      },
    });
  const watcher = form.watch();
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function gotoClient() {
    navigate("/admin/client");
  }

  console.log("countries", formData.clientCount && formData.clientCount.total_clients);

  React.useEffect(() => {
  if (formData.clientCount) {
    console.log(formData.clientCount);
    const totalClients = formData.clientCount.total_clients;
    const newClientId = `ext-${totalClients + 1}`;
    form.setValue("own_member_id", newClientId);
  } else {
    toast({
        variant:"destructive",
        title: `Cannot generate Auto gym member Id`,
        description: "Error from server could get data.",
      });
  }
}, [formData.clientCount!==null]);

  React.useEffect(() => {
   const fetchData = async () => {
     try {
       const data = await getFormData(4);
      //  console.log(data.sources)
       setFormData(data);
       setLoading(false); // Set loading to false after data is fetched
     } catch (error) {
      toast({
        variant:"destructive",
        title: `${error}`,
        description: "Need to Reload the form",
      });
       console.error("Error fetching data:", error);
       // Handle error or set appropriate error state
     }
   };

   fetchData();
  }, []);

  console.log("Form Data", formData.sources);
  console.log("All Form Data", formData);

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
                    disabled={true}
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="own_member_id"
                          label="Gym Member ID"
                        />
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="sex"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="date_of_birth"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="email_address"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email_address"
                          label="Email Address"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-1">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="landline_number"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="landline_number"
                          label="Landline Number"
                        />
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="coach"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.coach ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-black"
                                placeholder="Coach"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formData.coaches?.length > 0 ? (
                              formData.coaches.map((sourceval: any) => {
                                console.log(field.value);
                                return (
                                  <SelectItem
                                    key={sourceval.id}
                                    value={sourceval.id.toString()}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="client_since"
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
                                  <span>Client Since</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
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
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.source ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formData.sources?.length ? (
                              formData.sources.map((sourceval: any, i: any) => (
                                <SelectItem
                                  value={sourceval.id.toString()}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="membership"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.membership ? "text-black" : ""}`}
                            >
                              <SelectValue
                                className="text-gray-400"
                                placeholder="Membership Plan"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formData.membershipPlans?.length ? (
                              formData.membershipPlans.map((sourceval: any) => {
                                console.log(field.value);
                                return (
                                  <SelectItem
                                    key={sourceval.id}
                                    value={sourceval.id.toString()}
                                  >
                                    {sourceval.name}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <>
                                <p className="2">No Membership plan found</p>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.language ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {langs.map((sourceval: any, i: any) => (
                              <SelectItem value={sourceval} key={i}>
                                {sourceval}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-3">
                {/* <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="invoicetemplate"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.invoicetemplate ? "text-black" : ""}`}
                            >
                              <SelectValue placeholder="Invoice Template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default template">
                              Default Template
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}

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
                    name="businessInput"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${watcher.businessInput ? "text-black" : ""}`}
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
                            {formData.business?.length ? (
                              formData.business.map((sourceval: any) => {
                                console.log(sourceval.name);
                                return (
                                  <SelectItem
                                    value={sourceval.id}
                                    key={sourceval.id.toString()}
                                  >
                                    {sourceval.name}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <>
                                <p className="p-2"> No details found</p>
                              </>
                            )}

                            {formData.business &&
                              formData.business.map((sourceval: any) => {
                                console.log(field.value);
                                return (
                                  <SelectItem
                                    value={sourceval.id.toString()}
                                    key={sourceval.id}
                                  >
                                    {sourceval.name}
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
                      name="streetaddress"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="streetaddress"
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
                      name="extraAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="extraAddress"
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
                      name="zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="zip_code"
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
                      name="country"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    " justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? formData.countries.find(
                                        (country: any) =>
                                          country.country === field.value
                                      )?.country // Access the property you want to render
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
                                    {formData.countries &&
                                      formData.countries.map((country: any) => (
                                        <CommandItem
                                          value={country.country}
                                          key={country.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "country",
                                              country.country
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                              country.country === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {country.country}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {watcher.country ? <></> : <FormMessage />}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="sendInvitation"
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
              {/* <div className="w-full flex flex-col justify-between items-start ">
                <div>
                  <h1 className="font-bold text-base"> Bank Details</h1>
                </div>

                <div className="w-full flex justify-between items-center pt-3">
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="bankAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="bankAccount"
                            label="Bank Account Number"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="swiftCode"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="swiftCode"
                            label="BIC/Swift Code"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="accholdername"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="accholdername"
                            label="Bank Account Holder Name"
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
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="bankName"
                            label="Bank Name"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sendInvitation"
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
              </div> */}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddClientForm;
