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
import CustomCollapsible from "@/components/ui/collapsibleCard/collapsible-card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetCreditsQuery } from "@/services/creditsApi";
import {
  HardwareIntegrationInput,
  HardwareIntegrationRow,
} from "@/app/types/hardware-integration";

import {
  initialHardwareIntegrationInput,
  validateHardwareSettings,
} from "@/constants/hardware_integration/index";
import HardwareDetailsSection from "./hardware-detail";
import HardwareCheckInSection from "./hardware-checkIn-Info";
import HardwareCheckInControlSection from "./hardware-checkIn-control";
import {
  useAddHardwareMutation,
  useUpdateHardwareMutation,
} from "@/services/hardwareApi";
import { ErrorType } from "@/app/types";

interface HarwareIntegrationForm {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  refetch: any;
  editModeData: HardwareIntegrationRow;
}

const HardwareIntegrationForm = ({
  isOpen,
  setOpen,
  action,
  editModeData,
  setAction,
  refetch,
}: HarwareIntegrationForm) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();

  const form = useForm<HardwareIntegrationInput>({
    mode: "all",
    defaultValues: initialHardwareIntegrationInput,
  });
  const [
    addHardware,
    {
      isLoading: addHardwareloading,
      error: hardwareAddError,
      isError: hardwareAddErrorbool,
    },
  ] = useAddHardwareMutation();
  const [
    updateHardware,
    {
      isLoading: updateHardwareloading,
      error: hardwareUpdateError,
      isError: hardwareUpdateErrorbool,
    },
  ] = useUpdateHardwareMutation();
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
      reset(initialHardwareIntegrationInput, {
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
    reset(initialHardwareIntegrationInput, {
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDirtyValues: false,
      keepDefaultValues: true,
    });
    setOpen(false);
  };
  useEffect(() => {
    if (action == "edit" && editModeData) {
      console.log({ editModeData }, "edit");
      reset(editModeData as HardwareIntegrationInput);
    } else if (action == "add" && editModeData == undefined) {
      console.log({ initialHardwareIntegrationInput }, "add");
      reset(initialHardwareIntegrationInput, {
        keepIsSubmitted: false,
        keepSubmitCount: false,
      });
    }
  }, [action, editModeData, reset]);

  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const onSubmit = async (data: HardwareIntegrationInput) => {
    if (validateHardwareSettings(data.settings)) {
      toast({
        variant: "destructive",
        description: "Please Enable atleaset one toggle in Check-In Control",
      });
      return;
    }
    let payload: HardwareIntegrationInput;
    if (orgId) {
      payload = {
        ...data,
        name: data.name.toLowerCase(),
        description:
          data?.description?.trim() === ""
            ? ""
            : data?.description?.toLowerCase(),
        org_id: orgId as number,
        facility_id: data.use_facility ? data.facility_id : null,
      };
      try {
        if (action === "add") {
          const resp = await addHardware(payload).unwrap();
          if (resp) {
            toast({
              variant: "success",
              title: "Hardware Integration saved successfully",
            });
            refetch();
            handleClose();
          }
        } else if (action === "edit") {
          const resp = await updateHardware({
            ...payload,
            id: editModeData.id,
            name: data.name.toLowerCase(),
            description: data?.description?.toLowerCase(),
          }).unwrap();

          if (resp) {
            toast({
              variant: "success",
              title: "Hardware Integration updated successfully",
            });
            refetch();
            handleClose();
          }
        }
      } catch (error) {
        console.error("Error", { error });
        if (error && typeof error === "object" && "data" in error) {
          const typedError = error as ErrorType;
          toast({
            variant: "destructive",
            title: "Error in Submission",
            // description: `${typedError.data?.detail ?? "Internal Server Error"}`,
            description: typedError.data?.detail || typedError.data?.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error in Submission",
            description: `${error}||Something Went Wrong.`,
          });
        }
        handleClose();
      }
    }
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
              onSubmit={handleSubmit(onSubmit, onError)} // need to add on submit here
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
                        className="w-[120px] bg-primary text-black text-center flex items-center gap-2"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {!isSubmitting && (
                          <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                        )}
                        {editModeData ? "Update" : "Save"}
                      </LoadingButton>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="h-[100%] mt-6 flex flex-col justify-center items-center gap-4 ">
                <HardwareDetailsSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
                <HardwareCheckInSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
                <HardwareCheckInControlSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
              </div>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HardwareIntegrationForm;
