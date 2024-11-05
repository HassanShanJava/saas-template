
import { StepperFormValues } from "@/types/hook-stepper";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./basic-info-form";
import PriceDiscountTaxForm from "./prices-form";
import AutoRenewalForm from "./renewal-form";
import { useToast } from "@/components/ui/use-toast";
import FacilityDetailsForm from "./facilites-details-form";
import {
  useCreateMembershipsMutation,
  useUpdateMembershipsMutation,
} from "@/services/membershipsApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";

import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { ErrorType, LimitedAccessTime, membeshipsTableType } from "@/app/types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cleanLimitedAccessTime, replaceNullWithDefaults } from "@/utils/helper";

// import { motion, AnimatePresence } from 'framer-motion';

interface membershipFormTypes {
  isOpen: boolean;
  setIsOpen: any;
  setAction: any;
  data?: membeshipsTableType;
  refetch: any;
  setData: any;
  action: "add" | "edit";
}
interface limitedAccessDaysTypes {
  id: number;
  day: string;
  from: string;
  to: string;
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
  FacilityDetailsForm, // Step 4
];

const getStepContent = (step: number) => {
  const Component = stepContentComponents[step - 1];
  return Component ? <Component /> : null;
};

const infoLabels = [
  { label: "Basic Information and Scope", key: 1 },
  { label: "Price, Discounts, and Tax Details", key: 2 },
  { label: "Renewal and Billing Cycle", key: 3 },
  { label: "Facility details", key: 4 },
];

const defaultValue = {
  name: "",
  group_id: null,
  description: "",
  status: "active",
  access_type: "no_restriction",
  limited_access_time: {},
  duration_period: "",
  duration: null,
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
  prolongation_period: undefined,
  days_before: undefined,
  next_invoice: undefined,
  renewal_details: {},
  facilities: [],
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
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const watcher = watch();

  const access_type = getValues("access_type");

  useEffect(() => {
    if (action == "edit" && data != undefined) {
      const updatedObject = {
        ...data,
        ...data?.renewal_details,
        limited_access_time:replaceNullWithDefaults(data?.limited_access_time)
      };


      console.log({ updatedObject }, "edit");
      reset(updatedObject as StepperFormValues);
    } else {
      console.log({ defaultValue }, "add");
      reset(defaultValue, { keepIsSubmitted: false, keepSubmitCount: false });
    }
  }, [data, action, reset]);

  const onSubmit = async (formData: StepperFormValues) => {
    const payload = formData;

    // make renewal data,
    convertStringNumbersToObject(payload);
    payload.org_id = orgId;
    payload.created_by = userId;
    payload.renewal_details = {};



    if (payload.access_type == "no_restriction") {
      payload.limited_access_time = {};
    } else {
      payload.limited_access_time = cleanLimitedAccessTime(payload?.limited_access_time as LimitedAccessTime)
    }

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
      const validate: { check: boolean; reason: string } = {
        check: false,
        reason: "",
      };

      payload.facilities.forEach((item) => {
        if (item.credit_type === "amount" && item.validity.type === "contract_duration") {
          item.validity.duration = 0;
        }

        if (
          item.credit_type === "amount" &&
          (item.validity.duration == undefined ||
            item.validity.duration == null)
        ) {
          validate.check = true;
          validate.reason = "Validity is required";
        }

        if (item.credit_type === "amount" && item.validity.type == undefined) {
          validate.check = true;
          validate.reason = "Validity is required";
        }

        if (
          item.credit_type === "amount" &&
          item.validity.type !== null &&
          item.validity.type !== "" &&
          item.validity.duration !== null
        ) {
          if (
            getDaysCheck(
              payload.duration as number,
              payload.duration_period as string,
              item.validity.duration as number,
              item.validity.type as string
            )
          ) {
            validate.check = true;
            validate.reason = "Validity cannot be greater than duration";
          }
        }
      });

      if (validate.check) {
        toast({
          variant: "destructive",
          title: validate.reason,
        });
        return;
      }
    } else {
      console.log({ payload }, "check credits");

      toast({
        variant: "destructive",
        title: "Select at least one credit detail",
      });
      return;
    }
    console.log({ payload }, action);

    if (action == "add") {
      delete payload?.id;
    }

    try {
      if (action == "add") {
        const resp = await createMemberships(payload).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Membership added successfully.",
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
            title: "Membership updated successfully.",
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
    const limitedAccessData = getValues("limited_access_time") as LimitedAccessTime;

    if (activeStep === 1 && access_type === "limited-access") {
      console.log("inside step 1");

      // Check for time conflicts within each day
      const hasTimeConflicts = Object.keys(limitedAccessData).some((day) => {
        const slots = limitedAccessData[day];
        return slots.some((currentSlot, index) => {
          // Check each slot against the subsequent slots in the same day
          return slots.slice(index + 1).some((otherSlot) =>
            isTimeOverlap(currentSlot.from_time, currentSlot.to_time, otherSlot.from_time, otherSlot.to_time)
          );
        });
      });

      if (hasTimeConflicts) {
        toast({
          variant: "destructive",
          title: "Time slots overlap on the same day",
        });
        return;
      }

      // Check for missing or incomplete time entries
      const hasCompleteSlot = Object.values(limitedAccessData).some((slots) =>
        slots.some((slot) => slot.from_time !== "" && slot.to_time !== "")
      );

      const hasMissingFrom = Object.values(limitedAccessData).some((slots) =>
        slots.some((slot) => slot.from_time === "" && slot.to_time !== "")
      );

      const hasMissingTo = Object.values(limitedAccessData).some((slots) =>
        slots.some((slot) => slot.from_time !== "" && slot.to_time === "")
      );

      if (hasMissingFrom) {
        toast({
          variant: "destructive",
          title: "Missing 'from' time in a time slot",
        });
        return;
      }

      if (hasMissingTo) {
        toast({
          variant: "destructive",
          title: "Missing 'to' time in a time slot",
        });
        return;
      }

      if (!hasCompleteSlot) {
        toast({
          variant: "destructive",
          title: "At least one day needs a complete time slot",
        });
        return;
      }
    }

    // Proceed to the next step if validation passes
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

  console.log({ watcher, errors });


  return (
    <Sheet open={isOpen}>
      <SheetContent
        className={`w-full !max-w-[1050px] flex flex-col custom-scrollbar py-0`}
        hideCloseButton
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <SheetHeader className="sticky top-0 z-40 py-4  bg-white">
          <div className="flex justify-between gap-5 items-start  ">
            <div>
              <p className="font-semibold">Membership</p>
              <div className="text-sm">
                <span className="text-gray-400 pr-1 font-semibold">
                  System Setting
                </span>{" "}
                <span className="text-gray-400 font-semibold">/</span>
                <span className="pl-1 text-primary font-semibold ">
                  Membership
                </span>
              </div>
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

          <Separator className=" h-[1px] font-thin rounded-full" />
        </SheetHeader>

        <FormProvider {...methods}>
          <div className="flex justify-start  px-8 pb-8">
            <StepperIndicator
              activeStep={activeStep}
              labels={infoLabels}
              lastKey={4}
            />
          </div>
          <form noValidate className="pb-4">
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

// for validation

function getDays(durationNo: number, durationType: string): number {
  console.log({ durationType, durationNo });
  switch (durationType) {
    case "weekly":
      return durationNo * 7; // 7 days per week
    case "monthly":
      return durationNo * 30; // Approximate average days in a month
    case "quarterly":
      return durationNo * 120; // Approximate average days in 4 months
    case "yearly":
      return durationNo * 365; // Approximate days in a year
    case "bi_annually":
      return durationNo * 182; // Approximate days in 6 months
    case "contract_duration":
      return durationNo * 0; // Approximate days in 6 months
    default:
      return 0;
  }
}

function getDaysCheck(
  durationNo: number,
  durationType: string,
  itemdurationNo: number,
  itemdurationType: string
): boolean {
  const memberShipDays: number = getDays(durationNo, durationType);
  const creditsDays: number = getDays(itemdurationNo, itemdurationType);

  console.log({ creditsDays, memberShipDays });
  return memberShipDays < creditsDays;
}

function isTimeOverlap(
  from1: string,
  to1: string,
  from2: string,
  to2: string
): boolean {
  const [f1, t1] = [
    new Date(`1970-01-01T${from1}:00Z`),
    new Date(`1970-01-01T${to1}:00Z`),
  ];
  const [f2, t2] = [
    new Date(`1970-01-01T${from2}:00Z`),
    new Date(`1970-01-01T${to2}:00Z`),
  ];
  return f1 < t2 && f2 < t1;
}
