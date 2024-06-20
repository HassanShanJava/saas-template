import { format } from "date-fns";
import countries from "./countries.json";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  ownermemberid: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "Owner Member ID is required." }),
  firstname: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "First Name Is Required" }),
  lastname: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "Last Name Is Required" }),
  type: z.enum(["male", "female", "other"], {
    required_error: "You need to select a gender type.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  clientsince: z.date({
    required_error: "Required.",
  }),
  email: z
    .string({
      required_error: "Email is Required",
    })
    .email(),
  landlinenumber: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "Owner Member ID is required." }),
  mobilenumber: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "MobileNois required." }),
  subscription: z.string({
    required_error: "Subscription is Required",
  }),
  source: z.string({
    required_error: "Required",
  }),
  language: z.string({
    required_error: "Required",
  }),
  business: z.enum(["yes", "no"], {
    required_error: "Required",
  }),
  bankAccount: z.string({
    required_error: "Acc No Required",
  }),
  swiftCode: z.string({
    required_error: "Required",
  }),
  accholdername: z.string({
    required_error: "Required",
  }),
  bankName: z.string({
    required_error: "Required",
  }),
  sendInvitation: z.boolean().default(true).optional(),
  city: z.string({
    required_error: "Required",
  }),
  zipcode: z.string({
    required_error: "Required",
  }),
  streetaddress: z.string({
    required_error: "Required",
  }),
  country:z.string({
    required_error:"Required"
  }).min(1,"Country is Required.")
  ,
  phoneNumber:z.string({
    required_error:"Required"
  }).refine((val) => {
  return /^\+?[1-9]\d{1,14}$/.test(val);
}, {
  message: "Invalid phone number format",
})
});

const AddClientForm: React.FC = () => {
    const navigate = useNavigate();

  const [countrydata,setCountry]=React.useState(countries);
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
   },
 });

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
 console.log("countries", countrydata);
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
                    className="px-4 py-2 bg-transparent gap-2 text-black rounded hover:bg-primary hover:text-white"
                  >
                    <Webcam className="h-4 w-4" />
                    WebCam Snapshot
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
                    name="ownermemberid"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="ownermemberid"
                          label="Owner Member ID"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="firstname"
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
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="lastname"
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
                    name="type"
                    defaultValue="male"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex justify-start items-center mb-4">
                          <FormLabel className="mr-4">Select :</FormLabel>
                          <FormControl>
                            <ButtonGroup
                              onValueChange={field.onChange}
                              defaultValue="male"
                              className="flex flex-row gap-2"
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
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
                    name="landlinenumber"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="landlinenumber"
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
                    name="mobilenumber"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="mobilenumber"
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
                    name="clientsince"
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
                              selected={field.value}
                              onSelect={field.onChange}
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
              </div>
              <div className="w-full flex justify-between items-start mt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="subscription"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Subscription reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unknown">Unknown</SelectItem>
                            <SelectItem value="mistakenlyinactivated">
                              Mistakenly Inactivated
                            </SelectItem>
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
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unknown">Unknown</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="facebookAd">
                              Facebook Ad
                            </SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="itsemail">ITS Email</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="walkin">Walk In</SelectItem>
                            <SelectItem value="walkin">Website</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
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
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Dutch">Dutch</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="Portuguese">
                              Portuguese
                            </SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Russian">Russian</SelectItem>
                            <SelectItem value="Turkish">Turkish</SelectItem>
                            <SelectItem value="Polish">Polish</SelectItem>
                            <SelectItem value="Greek">Greek</SelectItem>
                            <SelectItem value="Lithuanian">
                              Lithuanian
                            </SelectItem>
                            <SelectItem value="Latvian">Latvian</SelectItem>
                            <SelectItem value="Norsk">Norsk</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="business"
                    defaultValue="no"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex justify-start items-center mb-4">
                          <FormLabel className="mr-4">Business :</FormLabel>
                          <FormControl>
                            <ButtonGroup
                              onValueChange={field.onChange}
                              defaultValue="no"
                              className="flex flex-row gap-2"
                            >
                              <ButtonGroupItem value="yes" label="Yes" />
                              <ButtonGroupItem value="no" label="No" />
                            </ButtonGroup>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col justify-between items-start pb-5">
                <div>
                  <h1 className="font-bold text-base"> Address data</h1>
                </div>
                <div className="w-full flex justify-between items-center pt-3">
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
                                    ? countrydata.countries.find(
                                        (country: any) =>
                                          country === field.value
                                      )
                                    : "Select country"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandList>
                                  <CommandInput placeholder="Search country" />
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup>
                                    {countrydata.countries.map(
                                      (country: any) => (
                                        <CommandItem
                                          value={country}
                                          key={country}
                                          onSelect={() => {
                                            form.setValue("country", country);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                              country === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {country}
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
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
                </div>
              </div>
              <div className="w-full flex flex-col justify-between items-start ">
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
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddClientForm;
