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
import { ErrorType, Workout } from "@/app/types";
import { Outlet, useNavigate ,useParams} from "react-router-dom";
import StepperIndicator from "@/components/ui/stepper-indicator";
import { useForm, UseFormHandleSubmit, UseFormReturn } from "react-hook-form";
import { useAddWorkoutMutation } from "@/services/workoutService";
import { processAndUploadImages } from "@/constants/workout";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
export type ContextProps = { form: UseFormReturn<Workout> };
const WorkoutPlanForm = () => {
  const { workoutId } = useParams<{ workoutId: string }>(); // Extract workoutId
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const navigate = useNavigate();
  const LAST_STEP = 2;
  const [activeStep, setActiveStep] = useState<number>(
    +location.pathname[location.pathname.length - 1]
  );
  const form = useForm<Workout>({
    defaultValues: {},
    mode: "all",
  });
  const {
    formState: { isSubmitted, isSubmitting },
  } = form;

  const [workoutIdState, setWorkoutIdState] = useState<number | null>(workoutId ? parseInt(workoutId) : null);


  // useEffect(() => {
  //   console.log(
  //     "activeStep useChipack",
  //     activeStep,
  //     +location.pathname[location.pathname.length - 1],
  //     form.formState.isSubmitting,
  //     form.formState.isSubmitted
  //   );
  //   if (
  //     isNaN(activeStep) ||
  //     (activeStep === 2 && !isSubmitted && !isSubmitting)
  //   ) {
  //     setActiveStep(1);
  //     navigate("/admin/workoutplans/add/step/1");
  //   } else {
  //     navigate(`/admin/workoutplans/add/step/${activeStep}`);
  //   }
  // }, [activeStep, isSubmitted]);

  useEffect(() => {
    console.log(
      "activeStep useEffect",
      activeStep,
      +location.pathname[location.pathname.length - 1],
      form.formState.isSubmitting,
      form.formState.isSubmitted
    );
  
    if (isNaN(activeStep) || (activeStep === 2 && !isSubmitted && !isSubmitting)) {
      setActiveStep(1);
      navigate("/admin/workoutplans/add/step/1");
    } else {
      // Navigate to the current step, including workoutId if it exists
      const workoutIdPart = workoutIdState ? `/${workoutIdState}` : '';
      navigate(`/admin/workoutplans/add/step/${activeStep}${workoutIdPart}`);
    }
  }, [activeStep, isSubmitted, workoutIdState]);
  
  console.log(
    "activeStep",
    activeStep,
    +location.pathname[location.pathname.length - 1],
    form.formState.isSubmitting,
    form.formState.isSubmitted,
    location.pathname
  );

  const [createWorkout,{isLoading:AddworkoutLoading,isError}] = useAddWorkoutMutation();
  async function onSubmit(data: Workout) {
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
      // console.log("final Payload", payload);
      // const resp=await createWorkout(payload).unwrap();
      // if (resp) {
      //   console.log({ resp });
      // }

      let resp;
      if (workoutIdState) {
        // Update existing workout
        // resp = await updateWorkout({ id: workoutIdState, ...payload }).unwrap(); // Use your update mutation here

        console.log("updated data",{payload})
      } else {
        // Create new workout
        resp = await createWorkout(payload).unwrap();
      }
  
      if (resp) {
        setWorkoutIdState(resp.id); // Set the workout ID
        const newActiveStep = 2;
        navigate(`/admin/workoutplans/add/step/${newActiveStep}/${resp.id}`); // Navigate to step 2 with ID
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
    }
  }
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  const handleClose = () => {
    navigate("/admin/workoutplans");
  };

  return (
    <Sheet open={true}>
      <SheetContent
        className="!max-w-full lg:w-[1150px] custom-scrollbar py-0"
        hideCloseButton
      >
        <SheetHeader className="sticky z-50 top-0 py-4 bg-white">
          <SheetTitle>
            <div className="flex justify-between gap-5 items-start ">
              <div>
                <p className="font-semibold">Workout Plans</p>
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

                {activeStep !== 1 && (
                  <Button
                    className="w-[100px] px-2 text-center flex items-center gap-2 border-primary"
                    type="button"
                    variant={"outline"}
                    onClick={() => {
                      const newActive = activeStep - 1;
                      setActiveStep(newActive);
                      navigate(`/admin/workoutplans/add/step/${newActive}/${workoutIdState}`);
                    }}
                  >
                    <i className="fa fa-arrow-left-long "></i>
                    Previous
                  </Button>
                )}

                {activeStep === LAST_STEP ? (
                  <LoadingButton
                    type="submit"
                    className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
                    // onClick={handleSubmit(onSubmit)}
                    // loading={isSubmitting}
                    // disabled={isSubmitting}
                  >
                    {/* {!isSubmitting && ( */}
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    {/* )} */}
                    Save
                  </LoadingButton>
                ) : (
                  <Button
                    type="button"
                    className="w-[120px] bg-primary text-black text-center flex items-center gap-2"
                    onClick={() => {
                      form.handleSubmit(async (data) => {
                        await onSubmit(data);
                        console.log("Step of action active", activeStep, data);
                        const newActive = activeStep + 1;
                        setActiveStep(newActive);
                      }, onError)();
                    }}
                    disabled={AddworkoutLoading}
                  >
                    {!form.formState.isSubmitting && (
                          <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                        )}
                    <i className="fa fa-arrow-right-long "></i>
                    Next
                  </Button>
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
                { key: 1, label: "Plan Information & Details" },
                { key: 2, label: "Training & Exercise Details" },
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
