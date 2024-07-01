import { format } from "date-fns";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import { PlusIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";


const FormSchema = z.object({
  // lead information
  firstname: z
    .string({
      required_error: "First Name Is Required",
    })
    .min(2, { message: "First Name Is Required" }),
  lastname: z
    .string({
      required_error: "Last Name isRequired",
    })
    .min(2, { message: "Last Name Is Required" }),
  //contact Details
  email: z.string().email().optional(),

  homenumber: z.string().optional(),

  mobilenumber: z.string().optional(),

  // lead Settings
  source: z.string().optional(),
  
  leadStatus: z.string({
    required_error: "Lead status is Required",
  }),
  
  leadowner: z.string().optional(),
  
  leadsince: z.date().optional(),
  
  writeanote: z.string().optional(),


});

const LeadForm: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
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
  function gotoLeads() {
    navigate("/admin/leads");
  }

  return (
    <div className="p-6 bg-bgbackground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-7 px-4">
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <h1 className="font-bold text-lg"> Lead Data</h1>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Button
                      type={"button"}
                      onClick={gotoLeads}
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
                <h1 className="font-medium text-base pt-4">
                  {" "}
                  Lead information
                </h1>
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
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
                <div className="relative w-[33%]"></div>
              </div>

              <div className="w-full flex flex-col justify-between items-start pb-5">
                <div>
                  <h1 className="font-medium text-base pt-4">
                    Contact Details *
                  </h1>
                  <h1 className="font-normal text-base pt-3">
                    Please fill at least one of the required fields.
                  </h1>
                </div>
              </div>
              <div className="w-full flex flex-col justify-between items-start ">
                <div className="w-full flex justify-between items-center">
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="email"
                            label="Email"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-[33%]">
                    <FormField
                      control={form.control}
                      name="homenumber"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="homenumber"
                            label="Home Number"
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
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col justify-between items-start pb-5">
                <div>
                  <h1 className="font-medium text-base pt-4">Lead Settings</h1>
                </div>
                <div className="w-full flex justify-between items-start mt-3">
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
                                <SelectValue placeholder="Source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unknown">Unknown</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="facebookAd">
                                Facebook Ad
                              </SelectItem>
                              <SelectItem value="instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="itsemail">
                                ITS Email
                              </SelectItem>
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
                      name="leadStatus"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Lead Status"
                                  className="text-gray-400"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">
                                Contacted
                              </SelectItem>
                              <SelectItem value="in contact">
                                In Contact
                              </SelectItem>
                              <SelectItem value="appointment made">
                                Appointement Made
                              </SelectItem>
                              <SelectItem value="appointment hold">
                                Appointement Hold
                              </SelectItem>
                              <SelectItem value="free trial">
                                freetrail
                              </SelectItem>
                              <SelectItem value="sign up scheduled">
                                Sign up Scheduled
                              </SelectItem>
                              <SelectItem value="no show">No Show</SelectItem>

                              <SelectItem value="closed refused">
                                Closed Refused
                              </SelectItem>
                              <SelectItem value="closed lost contact">
                                Closed lost contact
                              </SelectItem>
                              <SelectItem value="closed disqualified">
                                Closed disqualified
                              </SelectItem>
                              <SelectItem value="closed thirdparty aggregator">
                                Closed ThirdParty Aggregators
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
                      name="leadowner"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Lead Owner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unassign">Unassign</SelectItem>
                              <SelectItem value="waqar">Waqar</SelectItem>
                              <SelectItem value="Waqas">Waqar</SelectItem>
                              <SelectItem value="Usman">Usman</SelectItem>
                              <SelectItem value="Fahad">Fahad</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between items-start pt-4">
                  <div className="w-full flex justify-between items-center">
                    <div className="relative w-[33%]">
                      <FormField
                        control={form.control}
                        name="leadsince"
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
                                      <span>Lead Since</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                    <div className="relative w-[66%]">
                      <FormField
                        control={form.control}
                        name="writeanote"
                        render={({ field }) => (
                          <FormItem>
                            <FloatingLabelInput
                              {...field}
                              id="writeanote"
                              label="Write A Note"
                            />
                            <FormMessage className="" />
                          </FormItem>
                        )}
                      />
                    </div>
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

export default LeadForm;
