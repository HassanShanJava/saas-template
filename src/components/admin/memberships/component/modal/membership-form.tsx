import { Dialog, DialogContent } from "@/components/ui/dialog";

import { StepperFormValues } from "@/types/hook-stepper";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./basic-info-form";
import PriceDiscountTaxForm from "./prices-form";
import AutoRenewalForm from "./renewal-form";
import { useToast } from "@/components/ui/use-toast";
import CreditDetailsForm from "./credit-details-form";
import {
  useCreateMembershipsMutation,
  useUpdateMembershipsMutation,
} from "@/services/membershipsApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";

import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { ErrorType, membeshipsTableType } from "@/app/types";
import { DialogTitle } from "@radix-ui/react-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


// import { motion, AnimatePresence } from 'framer-motion';

interface membershipFormTypes {
  isOpen: boolean;
  setIsOpen: any;
  setAction: any;
  setData: any;
  data?: membeshipsTableType;
  refetch: any;
  action: "add" | "edit";
}

interface membershipFromTypes {
  membership_name: string;
  membership_group: string;
  description: string;
  status: boolean;
  access: string;
  duration: string;
}

const stepContentComponents = [
  BasicInfoForm, // Step 1
  PriceDiscountTaxForm, // Step 2
  AutoRenewalForm, // Step 3
  CreditDetailsForm, // Step 4
];

const getStepContent = (step: number) => {
  const Component = stepContentComponents[step - 1];
  return Component ? <Component /> : null;
};

const infoLabels = [
  { label: "Basic Information and Scope", key: 1 },
  { label: "Price, Discounts, and Tax Details", key: 2 },
  { label: "Renewal and Billing Cycle", key: 3 },
  { label: "Credit details", key: 4 },
];

const defaultValue = {
  name: "",
  group_id: null,
  description: "",
  status: "true",
  access_type: "no-restriction",
  limited_access_data: [],
  duration_type: "",
  duration_no: null,
  org_id: null,
  created_by: null,
  net_price: null,
  discount: null,
  income_category_id: undefined,
  tax_rate: null,
  tax_amount: null,
  total_price: null,
  payment_method: "",
  reg_fee: null,
  billing_cycle: "",
  auto_renewal: false,
  prolongation_period: null,
  days_before: null,
  next_invoice: null,
  renewal_details: {},
  facilities: [],
  id: null,
};

const MembershipForm = ({
  isOpen,
  setIsOpen,
  data,
  action,
  setAction,
  setData,
  refetch,
}: membershipFormTypes) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const userId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.id) || 0;

  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState("");
  const methods = useForm<StepperFormValues>({
    mode: "all",
    defaultValues: defaultValue,
  });

  const [createMemberships] = useCreateMembershipsMutation();
  const [updateMemberships] = useUpdateMembershipsMutation();

  const {
    trigger,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors, "membership form");

  const access_type = getValues("access_type");
  const limited_access_data = getValues("limited_access_data");

  useEffect(() => {
    if (action == "edit" && data != undefined) {
      const updatedObject = {
        ...data,
        ...data?.access_time,
        ...data?.renewal_details,
      };
      reset(updatedObject);
    } else {
      reset(defaultValue, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [data, action]);

  const onSubmit = async (formData: StepperFormValues) => {
    const payload = formData;

    // make renewal data,
    convertStringNumbersToObject(payload);
    payload.org_id = orgId;
    payload.created_by = userId;
    payload.renewal_details = {};

    payload.access_time = {
      access_type: payload.access_type,
      duration_no: payload.duration_no,
      duration_type: payload.duration_type,
      limited_access_data:
        payload.limited_access_data.length > 0
          ? payload.limited_access_data
          : [],
    };

    if (payload.auto_renewal) {
      payload.renewal_details = {
        days_before: formData.days_before,
        next_invoice: formData.next_invoice,
        prolongation_period: formData.prolongation_period,
      };
    } else {
      payload.renewal_details = {};
    }

    if (payload.facilities.length > 0) {
      let check = false;

      payload.facilities.forEach((item) => {
        if (item.validity.duration_type === "contract_duration") {
          item.validity.duration_no = 0;
        }

        if (
          item.validity.duration_no == undefined ||
          item.validity.duration_type == undefined
        ) {
          check = true;
        }
      });

      if (check) {
        toast({
          variant: "destructive",
          title: "Validity is required",
        });
        return;
      }
    }else{
      toast({
        variant: "destructive",
        title: "Select at least one credit detail",
      });
      return;
    }

    console.log({ payload }, action);

    try {
      if (action == "add") {
        const resp = await createMemberships(payload).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Created Successfully",
          });
          reset(defaultValue, {
            keepIsSubmitted: false,
            keepSubmitCount: false,
          });

          setData(undefined);
          handleClose();
          setActiveStep(1);
        }
      } else {
        const resp = await updateMemberships(payload).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Updated Successfully",
          });
          reset(defaultValue, {
            keepIsSubmitted: false,
            keepSubmitCount: false,
          });

          setData(undefined);
          handleClose();
          setActiveStep(1);
        }
      }
    } catch (error: unknown) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
      handleClose();
      setData(undefined);
      setActiveStep(1);
    }
  };

  const handleNext = async () => {
    const isStepValid = await trigger(undefined, { shouldFocus: true });
    // for check on limited_Access_Data after submiting

    if (activeStep == 1 && access_type == "limited-access") {
      const check = limited_access_data.some(
        (day: any) => day?.from != "" && day?.to != ""
      );
      const checkFrom = limited_access_data.some(
        (day: any) => day?.from != "" && day?.to == ""
      );
      const checkTo = limited_access_data.some(
        (day: any) => day?.from == "" && day?.to != ""
      );
      console.log({ check, limited_access_data });
      if (checkFrom) {
        toast({
          variant: "destructive",
          title: "Missing from time",
        });
        return;
      }

      if (checkTo) {
        toast({
          variant: "destructive",
          title: "Missing till to time",
        });
        return;
      }

      if (!check) {
        toast({
          variant: "destructive",
          title: "At least one day needs a time slot",
        });
        return;
      }
    }
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    reset(defaultValue, { keepIsSubmitted: false, keepSubmitCount: false });
    clearErrors();
    setAction("add");
    setActiveStep(1);
    setData(undefined);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        className={`w-full max-w-[1050px] flex flex-col !py-3`}
      >
        <SheetTitle className="absolute  !display-none"></SheetTitle>
        <FormProvider {...methods}>
          <div className="flex justify-between gap-5 items-start h-[82px] pl-8  ">
            <StepperIndicator
              activeStep={activeStep}
              labels={infoLabels}
              lastKey={4}
            />
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

              {activeStep > 1 && (
                <Button
                  className="w-[100px] px-2 text-center flex items-center gap-2 border-primary"
                  type="button"
                  variant={"outline"}
                  onClick={handleBack}
                >
                  <i className="fa fa-arrow-left-long "></i>
                  Previous
                </Button>
              )}

              {activeStep === 4 ? (
                <LoadingButton
                  type="submit"
                  className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                  onClick={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && (
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                  )}
                  Save
                </LoadingButton>
              ) : (
                <Button
                  type="button"
                  className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                  onClick={handleNext}
                >
                  <i className="fa fa-arrow-right-long "></i>
                  Next
                </Button>
              )}
            </div>
          </div>
          <form noValidate className="">
            {/* <AnimatePresence>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              > */}
            {getStepContent(activeStep)}
            {/* </motion.div>
            </AnimatePresence> */}
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MembershipForm;

function convertStringNumbersToObject(obj: any): void {
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key!] === "string" &&
      !isNaN(obj[key!]) &&
      obj[key!].trim() !== ""
    ) {
      obj[key!] = Number(obj[key!]);
    } else if (typeof obj[key!] === "object" && obj[key!] !== null) {
      convertStringNumbersToObject(obj[key!]);
    }
  });
}
