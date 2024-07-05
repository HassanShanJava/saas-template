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
import { useGetAllSourceQuery } from "@/services/clientAPi";
import { ErrorType, sourceTypes, staffType } from "@/app/types";
import { useGetAllStaffQuery } from "@/services/leadsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useAddLeadMutation } from "@/services/leadsApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
const LeadForm: React.FC = () => {
 const orgId =useSelector((state: RootState) => state.auth.userInfo?.org_id) || 0;
  const [addLead,{isLoading}] = useAddLeadMutation();

  const FormSchema = z
    .object({
      // lead information
      first_name: z
        .string({
          required_error: "First Name Is Required",
        })
        .min(4, { message: "First Name is Required" }),
      last_name: z
        .string({
          required_error: "Last Name is Required",
        })
        .min(4, { message: "Last Name is Required" }),

      staff_id: z.number().optional(),
      mobile: z.string().optional(),
      status: z.string({
        required_error: "Lead status is Required",
      }),
      // lead Settings
      source_id: z.number().optional(),

      lead_since: z.date({
        required_error: "Lead Since Data is Required",
      }),
      //contact Details
      phone: z.string().optional(),
      email: z
        .string()
        .email({ message: "Invalid email" })
        .min(4, { message: "Email is Required" }),
      notes: z.string().optional(),
      org_id: z
        .number({
          required_error: "Org id is required",
        })
        .default(orgId),
      created_by: z.number().default(0),
      updated_by: z.number().default(0),
    })
    .refine((data) => data.email || data.phone || data.mobile, {
      message: "Either Email or Home Number or Mobile Number must be provided",
      path: ["email"],
    });

  const { data: sources } = useGetAllSourceQuery();
  const {data:staff}=useGetAllStaffQuery(orgId); 
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedData = {
      ...data,
      lead_since: format(new Date(data.lead_since!), "yyyy-MM-dd"),
    };

    console.log({updatedData});

    try {
      let resp = await addLead(updatedData)
        .unwrap()
        .then((payload) => console.log("Fullfilled", payload));
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        mobile: "",
        source_id: undefined,
        status: "",
        staff_id: undefined,
        lead_since: undefined,
        notes: "",
      });
      toast({
        variant: "success",
        title: "Lead Added Successfully",
      });
      navigate("/admin/leads")
    } catch (error) {
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
                      <RxCross2 className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                  <div>
                    {isLoading ? (
                      <LoadingButton
                        loading
                        className="gap-2 text-black hover:opacity-90 hover:text-white"
                      >
                        {" "}
                        Save
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
                <h1 className="font-medium text-base pt-4">
                  {" "}
                  Lead information
                </h1>
              </div>
              <div className="w-full flex justify-between items-center gap-3 pt-3">
                <div className="relative w-1/3">
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
                <div className="relative w-1/3">
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
                <div className="relative w-1/3"></div>
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
                <div className="w-full flex justify-between items-center gap-3">
                  <div className="relative w-1/3">
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
                  <div className="relative w-1/3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="phone"
                            label="Home Number"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-1/3">
                    <FormField
                      control={form.control}
                      name="mobile"
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
                <div className="w-full flex justify-between gap-3 items-start mt-3">
                  <div className="relative w-1/3">
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
                              <SelectTrigger>
                                <SelectValue placeholder="Source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sources && sources?.length ? (
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
                  <div className="relative w-1/3">
                    <FormField
                      control={form.control}
                      name="status"
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
                  <div className="relative w-1/3">
                    <FormField
                      control={form.control}
                      name="staff_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Lead Owner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {staff && staff?.length ? (
                                staff.map((sourceval: staffType, i: any) => (
                                  <SelectItem
                                    value={sourceval.id?.toString()}
                                    key={i}
                                  >
                                    {sourceval.first_name}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <p className="p-2"> No Staff Added</p>
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
                <div className="w-full flex flex-col justify-between items-start pt-4">
                  <div className="w-full flex justify-between gap-3 items-center">
                    <div className="relative w-1/3">
                      <TooltipProvider>
                        <Tooltip>
                          <FormField
                            control={form.control}
                            name="lead_since"
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
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Lead Since</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </TooltipTrigger>
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
                          <TooltipContent>
                            <p>Lead Since</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative w-2/3">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FloatingLabelInput
                              {...field}
                              id="notes"
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
