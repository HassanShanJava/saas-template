import { format } from "date-fns";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MdEdit } from "react-icons/md";
import {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusIcon, CameraIcon, Webcam, Edit } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
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
  leadsince: z.date({
    required_error: "A date is required.",
  }),
  email: z
    .string({
      required_error: "Email is Required",
    })
    .email(),
  homenumber: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "Owner Member ID is required." }),
  mobilenumber: z
    .string({
      required_error: "Required",
    })
    .min(2, { message: "MobileNois required." }),
  writeanote: z.string().optional(),
  leadStatus: z.string({
    required_error: "Required",
  }),
  source: z.string({
    required_error: "Required",
  }),
  leadowner: z.string({
    required_error: "Required",
  }),
  dob: z.date(),
  time: z.string(),
  sendInvitation: z.boolean(),
  type: z.enum(["male", "female", "other"], {
    required_error: "You need to select a gender type.",
  }),
});

const EventForm: React.FC = () => {
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
  function gotoEvents() {
    navigate("/admin/events");
  }

  return (
    <div className="p-6 bg-bgbackground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-7 px-4">
            <CardContent>
              <div className="flex justify-between items-center gap-3">
                <div className="flex flex-row gap-4 items-center">
                  <h1 className="font-bold text-xl text-black">New event</h1>
                  <div className="w-[32%]">
                    <Select>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      {/* <SelectContent>
                <SelectGroup> */}
                      {/* <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem> */}
                      {/* </SelectGroup>
              </SelectContent> */}
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Button
                      type={"button"}
                      onClick={gotoEvents}
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
              <div className="w-full flex justify-between items-center gap-4 pt-3">
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
                              <SelectValue placeholder="Activity" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
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
                              <SelectValue placeholder="Instructor" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
                        </Select>
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
                          label="Max Participants"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
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
                                  <span>Date</span>
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
                  <TooltipProvider>
                    <Tooltip>
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <TooltipTrigger asChild>
                              <Input
                                placeholder="start time"
                                type="time"
                                {...field}
                                value={field.value}
                                onChange={field.onChange}
                                id="time"
                                aria-label="Choose time"
                                className="w-full flex text-end"
                              />
                            </TooltipTrigger>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <TooltipContent>
                        <p>Start Time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="relative w-[33%]">
                  <TooltipProvider>
                    <Tooltip>
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <TooltipTrigger asChild>
                              <Input
                                placeholder="end time"
                                type="time"
                                {...field}
                                value={field.value}
                                onChange={field.onChange}
                                id="time"
                                aria-label="Choose time"
                                className="w-full flex text-end"
                              />
                            </TooltipTrigger>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <TooltipContent>
                        <p>End Time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
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
                              <SelectValue placeholder="Location" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
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
                              <SelectValue placeholder="Recurrency" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <div className="flex gap-2 justify-center items-center">
                    <h1 className="text-sm text-black font-bold">
                      Bookable in advance:{" "}
                    </h1>
                    <div className="flex gap-2">
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
                                  <SelectValue placeholder="1" />
                                </SelectTrigger>
                              </FormControl>
                              {/* <SelectContent>
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
                          </SelectContent> */}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                  <SelectValue placeholder="Days" />
                                </SelectTrigger>
                              </FormControl>
                              {/* <SelectContent>
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
                          </SelectContent> */}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
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
                              <SelectValue placeholder="Cancel Activity if no participants" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
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
                              <SelectValue placeholder="Free cancellation period" />
                            </SelectTrigger>
                          </FormControl>
                          {/* <SelectContent>
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
                          </SelectContent> */}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]">
                  <div className="flex gap-2 justify-center items-center">
                    <h1 className="text-sm text-black font-bold">
                      Credit type:{" "}
                    </h1>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem className="flex">
                            <input
                              placeholder="No Credit"
                              className="text-gray-200 text-sm"
                            />
                            {/* <MdEdit className="w-4 h-4 text-gray-400" /> */}

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Note to Employees"
                          className="h-24"
                        />
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
                          label="Description"
                          className="h-24"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative w-[33%]"></div>
              </div>
              <div className="pt-3">
                <Separator className="" />
              </div>

              <div className="w-full flex justify-between items-center gap-4 pt-3">
                <div className="relative w-[33%]">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="email"
                          label="Link"
                        />
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
                          label="Text to display"
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
                        <FormLabel>Show link before booking</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="pt-3">
                <Separator className="" />
              </div>
              <div className="w-full flex justify-between items-center gap-4 pt-3">
                <FormField
                  control={form.control}
                  name="type"
                  defaultValue="male"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex justify-start items-center mb-4">
                        <FormControl>
                          <ButtonGroup
                            onValueChange={field.onChange}
                            defaultValue="male"
                            className="flex flex-row xl:gap-2 lg:gap-1"
                          >
                            <ButtonGroupItem
                              value="male"
                              label="Enable online booking"
                              className="xl:w-60"
                            />
                            <ButtonGroupItem
                              value="female"
                              label="Enable booking through third-party"
                              className="xl:w-72"
                            />
                            <ButtonGroupItem
                              value="other"
                              label="Ask covid-19 triage questions"
                              className="xl:w-60"
                            />
                          </ButtonGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
