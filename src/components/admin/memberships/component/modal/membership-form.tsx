import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { StepperFormKeysType, StepperFormValues } from "@/types/hook-stepper";
import { StepperFormKeys } from "@/lib/constants/hook-stepper-constants";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./basic-info-form";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

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
  // Add other form components for steps 2, 3, 4...
];

const getStepContent = (step: number) => {
  const Component = stepContentComponents[step - 1];
  return Component ? <Component /> : null;
};

const MembershipForm = ({ isOpen, setIsOpen }: membershipFormTypes) => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState("");
  const methods = useForm<StepperFormValues>({ mode: "all" });

  const {
    trigger,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  // focus errored input on submit
  useEffect(() => {
    const erroredInputElement =
      document.getElementsByName(erroredInputName)?.[0];
    if (erroredInputElement instanceof HTMLInputElement) {
      erroredInputElement.focus();
      setErroredInputName("");
    }
  }, [erroredInputName]);

  const onSubmit = async (formData: StepperFormValues) => {
    console.log({ formData });

    // simulate api call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          message: "There was an error submitting form",
        });
      }, 2000);
    })
      .catch(({ message: errorMessage, errorKey }) => {
        if (
          errorKey &&
          Object.values(StepperFormKeys)
            .flatMap((fieldNames) => fieldNames)
            .includes(errorKey)
        ) {
          let erroredStep: number;
          for (const [key, value] of Object.entries(StepperFormKeys)) {
            if (value.includes(errorKey as never)) {
              erroredStep = Number(key);
            }
          }
          setActiveStep(erroredStep);
          setError(errorKey as StepperFormKeysType, {
            message: errorMessage,
          });
          setErroredInputName(errorKey);
        } else {
          setError("root.formError", {
            message: errorMessage,
          });
        }
      });
  };

  const handleNext = async () => {
    const isStepValid = await trigger(undefined, { shouldFocus: true });
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const infoLabels = [
    { label: "Basic Information and Scope", key: 1 },
    { label: "Price, Discounts, and Tax Details", key: 2 },
    { label: "Renewal and Billing Cycle", key: 3 },
    { label: "Credit details", key: 4 },
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-full max-w-[1050px] h-[500px] flex flex-col" hideCloseButton>
        <FormProvider {...methods}>
          <div className="flex justify-between gap-5 items-start h-[100px] pl-8 mb-0">
            <StepperIndicator activeStep={activeStep} labels={infoLabels} />
            <div className="flex justify-center space-x-[20px]">
              <Button
                type="button"
                className="w-[100px] text-center flex items-center gap-2"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
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
                  disabled={isSubmitting}
                >
                  <i className="fa fa-arrow-left-long "></i>
                  Previous
                </Button>
              )}

              {activeStep === 4 ? (
                <Button
                  className="w-[100px] bg-primary"
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
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
          <form noValidate>
            <AnimatePresence>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                {getStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipForm;
