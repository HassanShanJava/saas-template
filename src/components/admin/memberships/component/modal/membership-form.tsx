import { Dialog, DialogContent } from "@/components/ui/dialog";

import { StepperFormKeysType, StepperFormValues } from "@/types/hook-stepper";
import { StepperFormKeys } from "@/lib/constants/hook-stepper-constants";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./basic-info-form";
import PriceDiscountTaxForm from "./prices-form";
import AutoRenewalForm from "./renewal-form";
import { useToast } from "@/components/ui/use-toast";
import CreditDetailsForm from "./credit-details-form";
import { useCreateMembershipsMutation } from "@/services/membershipsApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";

import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { ErrorType } from "@/app/types";

// import { motion, AnimatePresence } from 'framer-motion';

interface membershipFormTypes {
  isOpen: boolean;
  setIsOpen: any;
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

const MembershipForm = ({ isOpen, setIsOpen }: membershipFormTypes) => {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const userId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.id) || 0;

  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState("");
  const methods = useForm<StepperFormValues>({ mode: "all" });

  const [createMemberships] = useCreateMembershipsMutation();

  const {
    trigger,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors,"membership form")

  const onSubmit = async (formData: StepperFormValues) => {
    const payload = formData;
    // make renewal data,
    convertStringNumbersToObject(payload)
    payload.org_id = orgId;
    payload.created_by = userId;
    payload.renewal_details = {};

    payload.access_time={
      access_type: payload.access_type,
      duration_no: payload.duration_no,
      duration_type: payload.duration_type,
      limited_access_data: (payload.limited_access_data).length>0?payload.limited_access_data:[]
    }

    if (payload.auto_renewal) {
      payload.renewal_details = {
        days_before: formData.days_before,
        next_invoice: formData.next_invoice,
        prolongation_period: formData.prolongation_period,
      };
    }

    if(payload.facilities.length>0){
      const check=payload.facilities.some(item=>item.validity.duration_no==undefined||item.validity.duration_type==undefined)
      if(check){
        toast({
          variant: "destructive",
          title: "Validity is required",
        });
      }
    }

    console.log({ payload });

    try {
      const resp = await createMemberships(payload).unwrap();
      if (resp) {
        console.log({ resp });
        // refetch();
        toast({
          variant: "success",
          title: "Created Successfully",
        });
        handleClose()
      }
    } catch (error: unknown) {
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
  };

  const handleNext = async () => {
    const isStepValid = await trigger(undefined, { shouldFocus: true });
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    clearErrors();
    setIsOpen(false);
  };

  const infoLabels = [
    { label: "Basic Information and Scope", key: 1 },
    { label: "Price, Discounts, and Tax Details", key: 2 },
    { label: "Renewal and Billing Cycle", key: 3 },
    { label: "Credit details", key: 4 },
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="w-full max-w-[1050px] h-fit flex flex-col"
        hideCloseButton
      >
        <FormProvider {...methods}>
          <div className="flex justify-between gap-5 items-start h-[82px] pl-8 ">
            <StepperIndicator activeStep={activeStep} labels={infoLabels} />
            <div className="flex justify-center space-x-[20px]">
              <Button
                type="button"
                className="w-[100px] text-center flex items-center gap-2"
                variant={"outline"}
                onClick={handleClose}
              >
                <i className="fa fa-xmark "></i>
                Cancel
              </Button>

              {activeStep > 1 && (
                <Button
                  className="w-[100px] px-2 text-center flex items-center gap-2"
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
      </DialogContent>
    </Dialog>
  );
};

export default MembershipForm;



function convertStringNumbersToObject(obj: any): void {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key!] === 'string' && !isNaN(obj[key!]) && obj[key!].trim() !== '') {
      obj[key!] = Number(obj[key!]);
    } else if (typeof obj[key!] === 'object' && obj[key!] !== null) {
      convertStringNumbersToObject(obj[key!]);
    }
  });
}