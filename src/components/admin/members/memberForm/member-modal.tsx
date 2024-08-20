import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { RootState } from "@/app/store";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";

interface MemberData {
  member_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  landlinenumber?: string;
  phone?: string;
  notes?: string;
  dob:string;
  [key: string]: any;
}

interface MemberModalFormProps {
  isOpen: boolean;
  setOpen: any;
  action?: string;
  refetch?: any;
  data?: MemberData | undefined;
}

const memberinfo = [
  {
    type: "text",
    name: "member_id",
    label: "Member Gym Id*",
    required: true,
  },
  {
    type: "text",
    name: "first_name",
    label: "First Name*",
    required: true,
  },
  {
    type: "text",
    name: "last_name",
    label: "Last Name*",
    required: true,
  },
  {
    type: "select",
    label: "Gender*",
    name: "gender",
    required: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    type:"date",
    label:"Date of Birth*",
    name:"dob",
    required: true
 },{
    type:"email",
    label:"Email*",
    name:"email",
    required:true
 },
  {
    type: "text",
    name: "landlinenumber",
    label: "Landline Number",
    required: false,
  },
  {
    type: "text",
    name: "phone",
    label: "Mobile Number",
    required: false,
  },
  {
    type: "text",
    name: "notes",
    label: "Notes",
    required: false,
  },
];

const initialValue: MemberData = {
  member_id: "",
  first_name: "",
  last_name: "",
  gender: "",
  landlinenumber: "",
  phone: "",
  notes: "",
  dob:""
};

const MemberModalForm = ({ isOpen, setOpen, action, data, refetch }: MemberModalFormProps) => {
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();
  const [showMore, setShowMore] = useState(false);
  
  const form = useForm<MemberData>({
    mode: "all",
    defaultValues: initialValue,
  });

  const { control, watch, handleSubmit, setError, reset, formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (action === "add") {
      reset(initialValue);
    } else if (data) {
      reset(data);
    }
  }, [action, data]);

  const handleClose = () => {
    reset(initialValue);
    setShowMore(false);
    setOpen(false);
  };

  const onSubmit = async (formData: MemberData) => {
    const payload = { org_id: orgId, ...formData };
    try {
      if (action === "add") {
        // Call create member API here
        toast({ variant: "success", title: "Member Created Successfully" });
        refetch();
      } else if (action === "edit") {
        // Call update member API here
        toast({ variant: "success", title: "Member Updated Successfully" });
        refetch();
      }
      handleClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Error in form submission" });
      reset(initialValue);
    }
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent hideCloseButton className="!max-w-[1050px] py-0 custom-scrollbar h-screen">
        <SheetHeader className="sticky top-0 z-40 py-4 bg-white">
          <SheetTitle>
            <div className="flex justify-between gap-5 items-start bg-white">
              <div>
                <p className="font-semibold">Members</p>
                <div className="text-sm">
                  <span className="text-gray-400 pr-1 font-semibold">Dashboard</span>
                  <span className="text-gray-400 font-semibold">/</span>
                  <span className="pl-1 text-primary font-semibold">Add Member</span>
                </div>
              </div>
              <div className="flex space-x-[20px]">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <LoadingButton onClick={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting}>
                  Save
                </LoadingButton>
              </div>
            </div>
          </SheetTitle>
          <Separator className="h-[1px] rounded-full my-2" />
        </SheetHeader>

        <div className="pb-0">
          <h1 className="font-semibold text-xl py-3">Member Data</h1>
          <div className="grid grid-cols-3 gap-3 p-1">
            {memberinfo.map((item) => {
              if (item.type === "text") {
                return (
                  <div key={item.name} className="relative">
                    <FloatingLabelInput
                      id={item.name}
                      label={item.label}
                      {...form.register(item.name, { required: item.required && "Required" })}
                    />
                   {errors[item.name as keyof MemberData]?.message && (
                        <p className="text-red-500 text-xs">{String(errors[item.name as keyof MemberData]?.message)}</p>
                        )}
                  </div>
                );
              }

              if (item.type === "email") {
                return (
                    <div key={item.name} className="relative">
                      <FloatingLabelInput
                        id={item.name}
                        label={item.label}
                        type={item.type} // Set the input type dynamically
                        {...form.register(item.name, {
                          required: item.required && "Required",
                          minLength: {
                            value: 7,
                            message:""
                          },
                          pattern: item.type === "email" ? {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          } : undefined,
                        })}
                      />
                      {errors[item.name as keyof MemberData]?.message && (
                        <p className="text-red-500 text-xs">
                          {String(errors[item.name as keyof MemberData]?.message)}
                        </p>
                      )}
                    </div>
                  );
                }
              
              if (item.type === "date") {
                return (
                  <div key={item.name} className="relative">
                    <Controller
                      name={item.name}
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "dd-MM-yyyy")
                                ) : (
                                  <span className="font-medium text-gray-400">
                                    {item.label}
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="center">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value ? new Date(field.value) : undefined}
                              defaultMonth={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date)}
                              fromYear={1960}
                              toYear={2030}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors[item.name as keyof MemberData]?.message && (
                      <p className="text-red-500 text-xs">{String(errors[item.name as keyof MemberData]?.message)}</p>
                    )}
                  </div>
                );
              }
              if (item.type === "select") {
                return (
                  <div key={item.name} className="relative">
                    <Controller
                      name={item.name}
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger floatingLabel={item.label}>
                            <SelectValue placeholder={`Select ${item.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options?.map((option, index) => (
                              <SelectItem key={index} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors[item.name as keyof MemberData]?.message && (
                        <p className="text-red-500 text-xs">{String(errors[item.name as keyof MemberData]?.message)}</p>
                        )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MemberModalForm;
