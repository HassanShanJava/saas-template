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
          className="!max-w-[1300px] py-0 custom-scrollbar p-0 bg-[#F8F9FA]"
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
                <div className="h-[30%] w-[95%] rounded-md bg-green-200">
                  <CustomCollapsible title="Section 1">
                    <p>
                      This is the content of Section 1. It can include any JSX.
                    </p>
                  </CustomCollapsible>
                </div>
                <div className="h-[30%] w-[95%] rounded-md bg-green-200">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
                </div>
                <div className="h-[30%] w-[95%] rounded-md bg-green-200">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
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
