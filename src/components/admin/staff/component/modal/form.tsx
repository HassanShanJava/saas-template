import {
  useCreateStaffMutation,
  useGetStaffListQuery,
  useUpdateStaffMutation,
} from "@/services/staffsApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Staff } from "@/app/types/staff";
import { Gender, Status, UserStatus } from "@/app/shared_enums/enums";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import PhoneInputField from "@/components/ui/common/phone-input-field";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetRolesQuery } from "@/services/rolesApi";
import { Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { ErrorType } from "@/app/types";

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-red-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
];

interface StaffFormProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: "add" | "edit";
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<Staff | undefined>>;
  data: Staff | undefined;
}

const initialValues = {
  status: UserStatus.Pending,
  first_name: '',
  last_name: '',
  email: '',
  date_of_birth: '',
  phone_num: '',
  gender: Gender.Male,
  role_id: 0,
};

const StaffForm = ({
  isOpen,
  setOpen,
  action,
  setAction,
  refetch,
  data,
  setData,
}: StaffFormProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [dob, setDob] = useState(false);
  const {
    data: roleOptions,
    isLoading: rolesLoading,
    refetch: rolesRefetch,
    error: rolesError,
    isSuccess,
  } = useGetRolesQuery();

  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();

  const form = useForm<Staff>({
    mode: "all",
    defaultValues: initialValues,
  });

  const {
    control,
    watch,
    register,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();

  const phoneUtil = PhoneNumberUtil.getInstance();

  const validatePhone = (value: string | undefined | null) => {
    value = "+" + value;
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

  useEffect(() => {
    if (action == "edit") {
      const payload = { ...data };
      reset(payload);
    } else if (action == "add") {
      reset(initialValues, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [action, reset]);

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const onSubmit = async (payload: Staff) => {
    try {
      if (action === "add") {
        payload.phone_num = "+" + payload.phone_num;
        const resp = await createStaff(payload)
          .unwrap()
          .then((res) => {
            toast({
              variant: "success",
              title: "Staff created successfully",
            });
            refetch();
            handleClose();
          })
          .catch((err) => {
            toast({
              variant: "destructive",
              title: `${err?.data?.detail || err?.data?.message}`,
            });
          });
      } else if (action === "edit") {
        const resp = await updateStaff(payload)
          .unwrap()
          .then((res) => {
            toast({
              variant: "success",
              title: "Staff updated successfully",
            });
            refetch();
            handleClose();
          })
          .catch((err) => {
            toast({
              variant: "destructive",
              title: `${err?.data?.detail || err?.data?.message}`,
            });
          });
      }
    } catch (error: unknown) {
      console.error("Error", { error });
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as ErrorType).data?.detail ||
          (error as ErrorType).data?.message
          : "Something Went Wrong.";
      toast({
        variant: "destructive",
        title: "Error in form Submission",
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    clearErrors();
    reset();
    setAction("add");
    setData(undefined);
    setOpen(false);
  };

  console.log({ watcher, errors, action });
  return (
    <Sheet open={isOpen}>
      <SheetContent
        hideCloseButton
        className="!max-w-[1050px] p-0 custom-scrollbar  sm:w-[90%] sm:max-w-2xl "
      >
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col  gap-4 bg-gray-100 h-screen"
            noValidate
          >
            <SheetHeader className="sticky top-0 z-40 px-4 py-3 bg-white border-2 border-transparent border-b-gray-200">
              <SheetTitle>
                <div className="flex justify-between gap-5 items-center  bg-white">
                  <p className="font-semibold">
                    {action === "add" ? "Create" : "Edit"} Staff
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type={"button"}
                      onClick={handleClose}
                      className="w-[100px] gap-2  bg-transparent border border-primary text-black hover:border-primary hover:bg-muted"
                    >
                      <i className="fa-regular fa-x  text-xs font-semibold "></i>
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="p-4 mx-4 bg-white rounded-lg">
              <h2 className="font-medium text-lg">
                Staff Details{" "}
                <span className="text-gray-500 text-sm font-normal">
                  {action == "edit" ? `Staff ID: ${watcher.id}` : ""}
                </span>
              </h2>
              <Separator className=" h-[1px] rounded-full my-2" />

              <div className="grid grid-cols-2 slg:grid-cols-3 gap-4 pt-2">
                <FloatingLabelInput
                  id="first_name"
                  label="First Name"
                  className="capitalize"
                  text="*"
                  {...register("first_name", {
                    required: "Required",
                    setValueAs: (value) => value.toLowerCase(),
                    maxLength: {
                      value: 50,
                      message: "Should be 50 characters or less",
                    },
                    pattern: {
                      value: /^[A-Za-z\-\s]+$/, // Adjust this regex based on your needs
                      message:
                        "Only alphabets, hyphen (-) and spaces are allowed",
                    },
                  })}
                  error={errors.first_name?.message}
                />
                <FloatingLabelInput
                  id="last_name"
                  label="Last Name"
                  className="capitalize"
                  text="*"
                  {...register("last_name", {
                    required: "Required",
                    setValueAs: (value) => value.toLowerCase(),
                    maxLength: {
                      value: 50,
                      message: "Should be 50 characters or less",
                    },
                    pattern: {
                      value: /^[A-Za-z\-\s]+$/, // Adjust this regex based on your needs
                      message:
                        "Only alphabets, hyphen (-) and spaces are allowed",
                    },
                  })}
                  error={errors.last_name?.message}
                />
                <FloatingLabelInput
                  id="email"
                  label="Email"
                  type="email"
                  text="*"
                  {...register("email", {
                    required: "Required",
                    setValueAs: (value) => value.toLowerCase(),
                    maxLength: {
                      value: 50,
                      message: "Should be 50 characters or less",
                    },
                    pattern: {
                      value:
                        /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                      message: "Incorrect email format",
                    },
                  })}
                  error={errors.email?.message}
                />

                <Controller
                  name={"date_of_birth"}
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
                            <span className="absolute p-0 text-xs text-black left-2 -top-1.5 px-1 bg-white z-10">
                              Date of brith
                              <span className="text-red-500">*</span>
                            </span>
                            <Button
                              type="button"
                              className={
                                "w-full  text-gray-800 text-left font-normal hover:bg-white bg-white border-[1px] hover:scale-100 transform-none border-checkboxborder"
                              }
                            >
                              {value ? (
                                format(value, "dd-MM-yyyy")
                              ) : (
                                <span>Select date of birth</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            {errors.date_of_birth?.message && (
                              <span className="text-red-500 text-xs mt-[5px]">
                                {errors.date_of_birth?.message}
                              </span>
                            )}
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="center">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={new Date(value)}
                          defaultMonth={value ? new Date(value) : undefined}
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              const today = new Date();
                              const oneYearAgo = new Date();
                              oneYearAgo.setFullYear(today.getFullYear() - 18);

                              // Check if the selected date is at least 1 year old
                              if (selectedDate <= oneYearAgo) {
                                onChange(format(selectedDate, "yyyy-MM-dd"));
                                setDob(false);
                              } else {
                                toast({
                                  variant: "destructive",
                                  description:
                                    "Date of birth must be at least 18 year old.",
                                });
                              }
                            }
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

                <div className="relative">
                  <Controller
                    name={"gender"}
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        onValueChange={(value: Gender) =>
                          setValue("gender", value)
                        }
                        value={value as Gender}
                      >
                        <SelectTrigger
                          floatingLabel="Gender"
                          text="*"
                          className={`text-black w-full`}
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="capitalize">
                          <SelectItem value={"male"}>Male</SelectItem>
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
                    name={"phone_num"}
                    rules={{ required: "Required", validate: validatePhone }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <PhoneInputField
                        value={value as string}
                        onChange={onChange}
                        error={errors.phone_num?.message as string}
                        placeholder={"Enter phone number"}
                      />
                    )}
                  />
                </div>

                <div className="relative">
                  <Controller
                    name="role_id"
                    rules={{ required: "Required", validate: (value) => value !== 0 || "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                    }) => (
                      <div className="relative w-full">
                        <span className="absolute p-0 text-xs font-light text-gray-900 left-3 -top-1.5  px-1 bg-white z-10">
                          Role Name <span className="text-red-500">*</span>
                        </span>
                        <FormItem className=" w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  role="combobox"
                                  className="capitalize w-full scale-100 shadow-sm border-checkboxborder border-[1px] bg-white text-gray-600 hover:bg-white"
                                  disabled={userInfo?.id == watcher.id}
                                >
                                  <span className="w-full text-left font-normal">
                                    {value
                                      ? roleOptions?.find(
                                        (role) => role.id === value
                                      )?.name
                                      : "Select Role"}
                                  </span>
                                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0 relative "
                              side="bottom"
                            >
                              <Command className="w-full ">
                                <CommandList>
                                  <CommandInput placeholder="Select Role" />
                                  <CommandEmpty>No Role found.</CommandEmpty>
                                  <CommandGroup className="">
                                    {roleOptions &&
                                      roleOptions
                                        .filter(
                                          (role) =>
                                            role.name != "admin" &&
                                            (role?.status as unknown as Status) !=
                                            Status.Inactive
                                        )
                                        .map((role: any) => (
                                          <CommandItem
                                            value={role.id}
                                            key={role.id}
                                            className="capitalize"
                                            onSelect={() => {
                                              setValue("role_id", role.id);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4 rounded-full border-2 border-green-500",
                                                role.id == value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {role.name}
                                          </CommandItem>
                                        ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {errors.role_id?.message && (
                            <span className="text-destructive font-poppins block !mt-[5px] text-xs">
                              {errors.role_id?.message}
                            </span>
                          )}
                        </FormItem>
                      </div>
                    )}
                  />
                </div>

                <div className="relative w-full ">
                  <Controller
                    name="status"
                    rules={{ required: "Required" }}
                    control={control}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => {
                      const statusLabel = status.filter(
                        (r) => r.value == value
                      )[0];
                      return (
                        <Select
                          onValueChange={(value) => onChange(value)}
                          defaultValue={value}
                          disabled={value === UserStatus.Pending}

                        >
                          <SelectTrigger
                            className="capitalize w-full"
                            floatingLabel="Status"
                            disabled={value === UserStatus.Pending}
                            text="*"
                          >
                            <SelectValue
                              placeholder="Select status"
                              className="text-gray-400"
                            >
                              <span className="flex gap-2 items-center">
                                <span
                                  className={`${statusLabel?.color} rounded-[50%] w-4 h-4`}
                                ></span>
                                <span>{statusLabel?.label}</span>
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                                className={`${value != UserStatus.Pending && item.value == UserStatus.Pending && "hidden"}`}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              </div>
            </SheetDescription>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default StaffForm;
