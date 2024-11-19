import { RootState } from "@/app/store";
import { ErrorType } from "@/app/types";
import { CounterDataType, CreateCounter } from "@/app/types/pos/counter";
import { useGetStaffListQuery } from "@/services/staffsApi";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import {
  FloatingInput,
  FloatingLabelInput,
} from "@/components/ui/floatinglable/floating";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  useCreateCountersMutation,
  useUpdateCountersMutation,
} from "@/services/counterApi";

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
];

interface counterForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch?: any;
  setData?: any;
  data: CounterDataType | undefined;
}

const initialValues = {
  name: undefined,
  status: "active",
  staff_ids: [],
};

const CounterForm = ({
  isOpen,
  setOpen,
  action,
  setAction,
  refetch,
  data,
  setData,
}: counterForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: staffOptions } = useGetStaffListQuery(orgId);

  const [createCounter] = useCreateCountersMutation();
  const [updateCounter] = useUpdateCountersMutation();

  const form = useForm<CreateCounter>({
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
    formState: { isSubmitting, errors },
  } = form;
  const watcher = watch();

  useEffect(() => {
    if (action == "edit" && data) {
      const payload = { ...data };
      payload.staff_ids = payload.staff.map((staff: any) => staff.id);
      reset(payload as CreateCounter);
    } else if (action == "add") {
      reset(initialValues, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [action, data, reset]);

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const onSubmit = async (payload: CreateCounter) => {
    try {
      console.log({ payload, action }, "submit");
      if (action == "add") {
        const resp = await createCounter(payload);
        if (!resp.error) {
          console.log({ resp });
          toast({
            variant: "success",
            title: "Counter created successfully",
          });
          refetch();
        } else {
          throw resp.error;
        }
      } else if (action == "edit") {
        delete payload.is_open;
        delete payload.staff_id;
        const resp = await updateCounter({
          ...payload,
          id: data?.id as number,
        }).unwrap();

        if (!resp.error) {
          toast({
            variant: "success",
            title: "Counter updated successfully",
          });
          refetch();
        } else {
          throw resp.error;
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail || typedError.data?.message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };

  const handleClose = () => {
    clearErrors();
    reset();
    setData(undefined);
    // setShowMore(false);
    setOpen(false);
  };

  console.log({ data, watcher, action });

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {action == "add" ? "Create" : "Edit"} Counter
            </SheetTitle>
            <SheetDescription>
              <Separator className=" h-[1px] font-thin rounded-full" />

              <FormProvider {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit, onError)}
                  className="flex flex-col py-4 gap-4"
                  noValidate
                >
                  <div className="relative ">
                    <FloatingLabelInput
                      id="name"
                      label="Counter Name"
                      text="*"
                      className="capitalize"
                      {...register("name", {
                        maxLength: {
                          value: 50,
                          message: "Name should not exceed 50 characters",
                        },
                        required: "Required",
                        setValueAs: (value) => value.toLowerCase(),
                      })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div className="relative ">
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
                          >
                            <SelectTrigger floatingLabel="Status" text="*">
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
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                  </div>

                  <div className="relative ">
                    <Controller
                      name={"staff_ids" as keyof CreateCounter}
                      // rules={{ required: "Required" }}
                      control={control}
                      render={({
                        field: { onChange, value, onBlur },
                        fieldState: { invalid, error },
                      }) => (
                        <MultiSelect
                          floatingLabel={"Assign Cashiers"}
                          options={
                            staffOptions as {
                              value: number;
                              label: string;
                            }[]
                          }
                          defaultValue={watch("staff_ids") || []} // Ensure defaultValue is always an array
                          onValueChange={(selectedValues) => {
                            console.log("Selected Values: ", selectedValues); // Debugging step
                            onChange(selectedValues); // Pass selected values to state handler
                          }}
                          placeholder={"Select cashiers"}
                          variant="inverted"
                          maxCount={1}
                          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
                        />
                      )}
                    />
                    {errors.staff_ids?.message && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {errors.staff_ids?.message}
                      </span>
                    )}
                  </div>

                  <LoadingButton
                    type="submit"
                    className="bg-primary  text-black gap-1 font-semibold"
                    loading={isSubmitting}
                  >
                    {!isSubmitting && (
                      <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    )}
                    Save
                  </LoadingButton>
                </form>
              </FormProvider>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CounterForm;
