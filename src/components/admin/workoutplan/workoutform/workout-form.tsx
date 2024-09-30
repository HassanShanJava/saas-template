import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useLocation } from "react-router-dom"; // Import useLocation

import { useEffect, useState } from "react";
import { useRef } from "react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
import { FiUpload } from "react-icons/fi";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { ErrorType, Workout, WorkoutDatabyId } from "@/app/types";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useForm, UseFormHandleSubmit, UseFormReturn } from "react-hook-form";
import {
  useAddWorkoutMutation,
  useUpdateWorkoutMutation,
  useDeleteWorkoutMutation,
} from "@/services/workoutService";
import { processAndUploadImages } from "@/constants/workout";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetWorkoutByIdQuery,
  useVerifyWorkoutCreationMutation,
} from "@/services/workoutService";
import { initialValue } from "@/constants/workout/index";
export type ContextProps = { form: UseFormReturn<Workout> };
const WorkoutPlanForm = () => {
  const location = useLocation(); // Use useLocation to get the current location

  const { workoutId } = useParams<{ workoutId: string }>(); // Extract workoutId
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const navigate = useNavigate();
  const LAST_STEP = 2;
  const [activeStep, setActiveStep] = useState<number>(
    +parseInt(location.pathname.split("/").slice(-2, -1)[0])
  );
  const [deleteWorkout, { isLoading: isDeleting }] = useDeleteWorkoutMutation();
  const [
    verifyWorkout,
    { isLoading: isVerifyLoading, isError: isVerifyError },
  ] = useVerifyWorkoutCreationMutation();

  // Extract mode from query parameters
  // Extract mode from query parameters
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "add";
  const [formMode, setFormMode] = useState(mode);
  const {
    data: workoutdataStep1,
    error: workoutError,
    isLoading: workoutidDataLoading,
  } = useGetWorkoutByIdQuery(
    {
      workoutId,
      include_days: true,
      include_days_and_exercises: true,
    },
    {
      skip: workoutId == undefined,
    }
  );

  const form = useForm<Workout>({
    defaultValues: {},
    mode: "all",
  });

  const {
    control,
    watch,
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors, isSubmitted },
  } = form;

  const watcher = watch();

  const [workoutIdState, setWorkoutIdState] = useState<number | null>(
    workoutId ? parseInt(workoutId) : null
  );

  useEffect(() => {
    console.log(
      "activeStep useEffect",
      activeStep,
      +location.pathname[location.pathname.length - 1],
      +location.pathname[location.pathname.length - 2],
      parseInt(location.pathname.split("/").slice(-2, -1)[0]),
      form.formState.isSubmitting,
      form.formState.isSubmitted
    );

    if (
      isNaN(activeStep) ||
      (activeStep === 2 && !isSubmitted && !isSubmitting)
    ) {
      setActiveStep(1);
      navigate(`/admin/workoutplans/add/step/1?${queryParams.toString()}`);
    } else {
      // Navigate to the current step, including workoutId if it exists
      const workoutIdPart = workoutIdState ? `/${workoutIdState}` : "";
      navigate(
        `/admin/workoutplans/add/step/${activeStep}${workoutIdPart}?${queryParams.toString()}`
      );
    }

    if (workoutdataStep1 && !isSubmitted) {
      if (workoutIdState) {
        const transformedData = {
          workout_name: workoutdataStep1.workout_name || "",
          org_id: workoutdataStep1.org_id || 0,
          description: workoutdataStep1.description || "",
          visible_for: workoutdataStep1.visible_for,
          goals: workoutdataStep1.goals,
          level: workoutdataStep1.level,
          weeks: workoutdataStep1.weeks,
          img_url: workoutdataStep1.img_url || undefined,
          members: workoutdataStep1.members.map(
            (member: { member_id: number }) => member.member_id
          ),
          file: undefined, // Adjust according to how files are managed
        };
        // Set the transformed data to the form
        console.log("formadata", transformedData);
        reset(transformedData);
      } else {
        reset(initialValue);
      }
    }
  }, [activeStep, workoutdataStep1, isSubmitting, isSubmitted, workoutIdState]);
  const [isSubmittedcode, setIsSubmitting] = useState(false);

  const [createWorkout, { isLoading: AddworkoutLoading, isError }] =
    useAddWorkoutMutation();

  const [
    updateWorkout,
    { isLoading: updateLoading, isError: workoutUpdateError },
  ] = useUpdateWorkoutMutation();

  const onSubmitworkout = async (formData: WorkoutDatabyId) => {
    setIsSubmitting(true);

    if (formData?.days) {
      const daysWithExercises = formData.days.filter(
        (day) => day.exercises && day.exercises.length > 0
      );

      if (daysWithExercises.length === 0) {
        toast({
          variant: "destructive",
          description: `The workout must have at least one day with one exercise.`,
        });
      } else if (
        formData.days.length > 1 &&
        daysWithExercises.length !== formData.days.length
      ) {
        toast({
          variant: "destructive",
          description: `If there are multiple days, each day must have at least one exercise.`,
        });
      } else {
        try {
          toast({
            variant: "success",
            description: `Workout saved successfully!`,
          });
        } catch (error) {
          console.error("Failed to save workout:", error);
          toast({
            variant: "destructive",
            description: `Failed to save workout. Please try again.`,
          });
        }
      }
    } else {
      toast({
        variant: "destructive",
        description: `Workout data is not available. Please try again.`,
      });
    }

    setIsSubmitting(false);
  };
  async function onSubmit(data: Workout) {
    if (isSubmittedcode) return;
    setIsSubmitting(true);
    try {
      const fileInputObject = {
        file: form.getValues("file"),
      };
      const ExistingImages = {
        file: data.img_url,
      };

      console.log(
        "New Image",
        fileInputObject.file,
        "existing one url",
        ExistingImages.file
      );
      const result = await processAndUploadImages(
        fileInputObject,
        ExistingImages
      );
      console.log("data, data", data, "Image Url getting", result.img_url);
      const payload = {
        ...data,
        img_url: result.img_url,
        org_id: orgId,
        workout_name: data.workout_name.toLowerCase(),
      };
      delete payload.file;

      let resp;
      if (workoutIdState) {
        resp = await updateWorkout({ id: workoutIdState, ...payload }).unwrap();
        console.log("updated data", { payload });
        if (resp && resp.workout_id) {
          setWorkoutIdState(resp.workout_id);
          const newActiveStep = 2;
          console.log("resp id", resp.workout_id, workoutIdState, workoutId);
          navigate(
            `/admin/workoutplans/add/step/${newActiveStep}/${resp.workout_id}?${queryParams.toString()}`
          );
        } else {
          toast({
            variant: "destructive",
            description: `Failed to create workout`,
          });
        }
      } else {
        // Create new workout
        resp = await createWorkout(payload).unwrap();
        if (resp && resp.id) {
          setWorkoutIdState(resp.id);
          const newActiveStep = 2;
          console.log("resp id", resp.id, workoutIdState, workoutId);
          navigate(
            `/admin/workoutplans/add/step/${newActiveStep}/${resp.id}?${queryParams.toString()}`
          );
        } else {
          toast({
            variant: "destructive",
            description: `Failed to create workout`,
          });
        }
      }
    } catch (error: unknown) {
      console.error("Error", { error });
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
    } finally {
      setIsSubmitting(false);
    }
  }
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };

  const handleClose = async () => {
    if (formMode === "add" && workoutIdState) {
      try {
        await deleteWorkout(workoutIdState).unwrap();
        navigate("/admin/workoutplans");
      } catch (error) {
        console.error("Failed to delete workout:", error);
      }
    }
  };

  console.log(
    "WorkOutId step 1 data to populate",
    { workoutdataStep1 },
    { watcher },
    { workoutIdState }
  );
  // console.log(, "edit");
  useEffect(() => {
    if (workoutError) {
      // Check if the error is due to the workout not existing
      if ("status" in workoutError && workoutError.status === 404) {
        toast({
          variant: "destructive",
          title: "Workout Not Found",
          description: "The requested workout does not exist.",
        });
        // Close the form and navigate back to the workout plans list
        navigate("/admin/workoutplans");
      } else {
        // Handle other types of errors
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while fetching the workout data.",
        });
      }
    }
  }, [workoutError, navigate]);

  const navigateToStep = (step: number) => {
    const newUrl = `/admin/workoutplans/add/step/${step}/${workoutIdState}?${queryParams.toString()}`;
    setActiveStep(step);
    navigate(newUrl);
  };

  const handleVerifyWorkout = async () => {
    try {
      if (workoutIdState) {
        const payload = {
          id: workoutIdState,
        };
        const verifyData = await verifyWorkout(payload).unwrap();
        console.log(verifyData?.status, verifyData?.status === 200);
        if (verifyData?.status === 200) {
          toast({
            variant: "success",
            description: "Workout saved successfully!",
          });
          navigate("/admin/workoutplans"); // Navigate to admin/workoutplans on success
        } else {
          toast({
            variant: "destructive",
            description:
              "Each day must have at least one exercise and one day.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description: "Failed to verify workout.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          description:
            typedError.data?.detail ||
            "An error occurred during verification. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          description:
            "An error occurred during verification. Please try again.",
        });
      }
    }
  };
  return (
    <Sheet open={true}>
      <SheetContent
        className="!max-w-full lg:w-[1150px] custom-scrollbar py-0"
        hideCloseButton
      >
        <SheetHeader className="sticky z-40 top-0 py-4 bg-white">
          <SheetTitle>
            <div className="flex justify-between gap-5 items-start ">
              <div>
                <p className="font-semibold">Workout Plans</p>
              </div>
              <div className="flex justify-center space-x-[20px]">
                <LoadingButton
                  type="button"
                  className="w-[100px] text-center flex items-center gap-2 border-primary"
                  variant={"outline"}
                  onClick={handleClose}
                  loading={isDeleting}
                >
                  <i className="fa fa-xmark "></i>
                  Cancel
                </LoadingButton>

                {activeStep !== 1 && (
                  <Button
                    className="w-[100px] px-2 text-center flex items-center gap-2 border-primary"
                    type="button"
                    variant={"outline"}
                    onClick={() => navigateToStep(activeStep - 1)}
                  >
                    <i className="fa fa-arrow-left-long "></i>
                    Previous
                  </Button>
                )}

                {activeStep === LAST_STEP ? (
                  <LoadingButton
                    type="submit"
                    className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                    onClick={handleVerifyWorkout}
                    loading={isVerifyLoading}
                    disabled={isSubmitting || workoutidDataLoading}
                  >
                    {!isVerifyLoading && (
                      <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    )}
                    Save
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    type="button"
                    className="w-[200px] bg-primary text-black text-center flex items-center gap-2"
                    onClick={() => {
                      form.handleSubmit(async (data) => {
                        await onSubmit(data);
                        console.log("Step of action active", activeStep, data);
                        const newActive = activeStep + 1;
                        // setActiveStep(newActive);
                        navigateToStep(activeStep + 1);
                      }, onError)();
                    }}
                    loading={
                      isSubmittedcode || AddworkoutLoading || updateLoading
                    }
                    disabled={
                      isSubmittedcode || AddworkoutLoading || updateLoading
                    }
                  >
                    {!(isSubmitting || AddworkoutLoading || updateLoading) && (
                      <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    )}
                    <i className="fa fa-arrow-right-long "></i>
                    Save & Next
                  </LoadingButton>
                )}
              </div>
            </div>
          </SheetTitle>
          <Separator className="h-[1px] rounded-full my-2" />
        </SheetHeader>
        <div className="flex justify-center mt-5">
          <div className="w-1/2 flex justify-center">
            <StepperIndicator
              activeStep={activeStep}
              labels={[
                { key: 1, label: "Plan Information" },
                { key: 2, label: "Training & Exercise" },
              ]}
              lastKey={LAST_STEP}
            />
          </div>
        </div>
        <Outlet context={{ form } satisfies ContextProps} />
      </SheetContent>
    </Sheet>
  );
};

export default WorkoutPlanForm;
