import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { initialValue } from "@/utils/helper";
import CustomCollapsible from "@/components/ui/collapsibleCard/collapsible-card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetCreditsQuery } from "@/services/creditsApi";
interface HarwareIntegrationForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
  data: any;
}

const HardwareIntegrationForm = ({
  isOpen,
  setOpen,
  action,
  data,
  setAction,
  refetch,
}: HarwareIntegrationForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();
  const {
    data: facilitiesData,
    isLoading,
    refetch: refetchforcredits,
  } = useGetCreditsQuery({ org_id: orgId, query: "" });
  const form = useForm<any>({
    mode: "all",
    // defaultValues: initialValue,
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

  useEffect(() => {
    if (action == "edit") {
    } else if (action == "add") {
      // need to add initial value here
      reset({
        keepIsSubmitted: false,
        keepSubmitCount: false,
        keepDirtyValues: false,
        keepDefaultValues: true,
      });
    }
  }, [action, reset]);

  const handleClose = () => {
    clearErrors();
    setAction("add");
    reset({
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDirtyValues: false,
      keepDefaultValues: true,
    });
    setOpen(false);
  };

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  return (
    <>
      <Sheet open={isOpen}>
        <SheetContent
          hideCloseButton
          className="lg:!max-w-[1100px] py-0 p-0 custom-scrollbar h-full bg-[#F8F9FA] w-[85%] sm:w-full sm:max-w-3xl"
        >
          <FormProvider {...form}>
            <form
              noValidate
              className="pb-4 w-full"
              onSubmit={handleSubmit(onError)} // need to add on submit here
              key={action}
            >
              <SheetHeader className="sticky top-0 z-40 pt-4 bg-white border-b shadow-md w-full p-2">
                <SheetTitle>
                  <div className="flex justify-between gap-5 items-center  bg-white">
                    <div className="text-lg font-semibold flex justify-center items-center">
                      <div className="w-[20px]"></div>
                      <span className="text-black pr-1 font-semibold">
                        HardWare Integration{" "}
                      </span>
                    </div>

                    <div className="flex justify-center space-x-[20px]">
                      <Button
                        type="button"
                        className="w-[100px] text-center flex items-center gap-2 border-primary"
                        variant={"outline"}
                        onClick={handleClose}
                      >
                        <i className="fa fa-xmark "></i>
                        Cancel
                      </Button>

                      <LoadingButton
                        type="submit"
                        className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
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
              <div className="h-[100%] mt-6 flex flex-col justify-center items-center gap-4 ">
                <div className="h-[30%] w-[95%] rounded-2xl bg-white">
                  <CustomCollapsible title="Hardware Details">
                    <div className="flex flex-row gap-5 justify-start items-center">
                      {/* Name Field */}
                      <div className="w-[30%]">
                        <p className="text-base font-normal">
                          Name <span className="text-red-500">*</span>
                        </p>
                        <Controller
                          control={control}
                          name="name"
                          rules={{
                            required: "Name is required",
                            maxLength: {
                              value: 40,
                              message: "Name cannot exceed 40 characters",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              className="w-full"
                              placeholder="Enter Name"
                              {...field}
                            />
                          )}
                        />
                        {errors.name?.message && (
                          <p className="text-red-500 text-xs mt-[5px] ">
                            {errors.name.message.toString()}
                          </p>
                        )}
                      </div>

                      {/* Connection Key Field */}
                      <div className="w-[45%]">
                        <p className="text-base font-normal">
                          Connection Key <span className="text-red-500">*</span>
                        </p>
                        <Controller
                          control={control}
                          name="connectionKey"
                          rules={{
                            required: "Connection Key is required",
                            maxLength: {
                              value: 100,
                              message:
                                "Connection Key cannot exceed 100 characters",
                            },
                          }}
                          render={({ field }) => (
                            <div className="w-full gap-5 flex flex-row justify-center items-center">
                              <Input
                                className="w-full"
                                placeholder="Enter Connection Key"
                                {...field}
                              />
                              <Controller
                                control={control}
                                name="facilty_select"
                                render={({ field }) => (
                                  <div className="flex gap-2 h-full">
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <span className="text-nowrap">
                                      Use Facility
                                    </span>
                                  </div>
                                )}
                              />
                            </div>
                          )}
                        />

                        {errors.connectionKey?.message && (
                          <p className=" text-red-500 text-xs mt-[5px]">
                            {errors.connectionKey.message.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-row gap-3">
                      <div className="w-[50%]">
                        <div>
                          <p className="text-base font-normal">Description</p>
                        </div>
                        <Controller
                          control={control}
                          name="description"
                          rules={{
                            maxLength: {
                              value: 200,
                              message:
                                "Description cannot exceed 200 characters",
                            },
                          }}
                          render={({ field }) => (
                            <Textarea
                              placeholder="Type your Description here"
                              className="resize-none"
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="w-[30%]">
                        <Controller
                          name="facility"
                          rules={{ required: "Facility is required" }}
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <div>
                                <div>
                                  <p className="text-base font-normal">
                                    Facility{" "}
                                    {watcher.facilty_select && (
                                      <span className="text-red-500">*</span>
                                    )}
                                  </p>
                                </div>
                                <Select
                                  onValueChange={(value) => onChange(value)}
                                  defaultValue={
                                    value ? value.toString() : undefined
                                  }
                                  disabled={watcher.facilty_select === false}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Facility" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {facilitiesData?.data?.map(
                                      (facility: {
                                        id: number;
                                        name: string;
                                      }) => (
                                        <SelectItem
                                          key={facility.id}
                                          value={String(facility.id)}
                                        >
                                          {facility.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              {error && (
                                <span className="text-red-500 text-xs mt-[5px]">
                                  {error.message}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </CustomCollapsible>
                </div>
                <div className="h-[30%] w-[95%] rounded-2xl bg-white">
                  <CustomCollapsible
                    title="Show Information"
                    isOpenDefault={false}
                  >
                    <div className="flex flex-col gap-5">
                      <div className="shadow-sm rounded-md p-4 border flex flex-col justify-between items-center">
                        <div className="flex flex-row justify-between items-center w-full">
                          {" "}
                          <span>Show remaining credits</span>
                          <Controller
                            control={control}
                            name="credit_name"
                            render={({ field }) => (
                              <div className="flex gap-2 h-full">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </div>
                            )}
                          />
                        </div>
                        {watcher.credit_name && (
                          <div className="w-full mt-3 ">
                            <div className="flex justify-start items-center gap-3 p-2 border-t">
                              <span className="text-nowrap">
                                when member has less than
                              </span>
                              <Controller
                                control={control}
                                name="credits_less"
                                disabled={watcher.less_credits === false}
                                rules={{
                                  required: "Name is required",
                                  maxLength: {
                                    value: 40,
                                    message: "Name cannot exceed 40 characters",
                                  },
                                }}
                                render={({ field }) => (
                                  <Input className="w-[10%]" {...field} />
                                )}
                              />
                              {errors.name?.message && (
                                <p className="text-red-500">
                                  {errors.name.message.toString()}
                                </p>
                              )}
                              credits left
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <span>Show outstanding invoices</span>
                        <Controller
                          control={control}
                          name="outstanding_invoice"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <span>Show end of contract</span>
                        <Controller
                          control={control}
                          name="end_of_contract"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </CustomCollapsible>
                </div>
                <div className="h-[30%] w-[95%] rounded-2xl bg-white">
                  <CustomCollapsible
                    title="Access Control"
                    isOpenDefault={false}
                  >
                    <div className="flex flex-col gap-5">
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <span>Member has no active membership</span>
                        <Controller
                          control={control}
                          name="active_membership"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <span>Member does not have required credits</span>
                        <Controller
                          control={control}
                          name="required_credits"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <div className="flex justify-start items-center gap-3 ">
                          <span className="text-nowrap">Member has </span>
                          <Controller
                            control={control}
                            name="credits_less"
                            disabled={watcher.less_credits === false}
                            rules={{
                              required: "Name is required",
                              maxLength: {
                                value: 40,
                                message: "Name cannot exceed 40 characters",
                              },
                            }}
                            render={({ field }) => (
                              <Input className="w-[20%]" {...field} />
                            )}
                          />
                          {errors.name?.message && (
                            <p className="text-red-500">
                              {errors.name.message.toString()}
                            </p>
                          )}
                          credits or less
                        </div>
                        <Controller
                          control={control}
                          name="less_credits"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <div className="flex justify-start items-center gap-3 ">
                          <span className="text-nowrap">
                            Member has outstanding invoices older than{" "}
                          </span>
                          <Controller
                            control={control}
                            name="older_than"
                            disabled={watcher.old_invoice === false}
                            rules={{
                              required: "Name is required",
                              maxLength: {
                                value: 40,
                                message: "Name cannot exceed 40 characters",
                              },
                            }}
                            render={({ field }) => (
                              <Input className="w-[20%]" {...field} />
                            )}
                          />
                          {errors.name?.message && (
                            <p className="text-red-500">
                              {errors.name.message.toString()}
                            </p>
                          )}
                          days
                        </div>
                        <Controller
                          control={control}
                          name="old_invoice"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="shadow-sm rounded-md p-4 border flex flex-row justify-between items-center">
                        <div className="flex justify-start items-center gap-3 ">
                          <span className="text-nowrap">
                            Member has membership that ends in less than{" "}
                          </span>
                          <Controller
                            control={control}
                            name="membershipless"
                            disabled={watcher.less_than === false}
                            rules={{
                              required: "Name is required",
                              maxLength: {
                                value: 40,
                                message: "Name cannot exceed 40 characters",
                              },
                            }}
                            render={({ field }) => (
                              <Input className="w-[20%]" {...field} />
                            )}
                          />
                          {errors.name?.message && (
                            <p className="text-red-500">
                              {errors.name.message.toString()}
                            </p>
                          )}
                          days
                        </div>
                        <Controller
                          control={control}
                          name="less_than"
                          render={({ field }) => (
                            <div className="flex gap-2 h-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </CustomCollapsible>
                </div>
              </div>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HardwareIntegrationForm;
