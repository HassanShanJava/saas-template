import { ErrorType } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { toast } from "@/components/ui/use-toast";
import { useSendResetEmailMutation } from "@/services/resetPassApi";
import { useForm, FormProvider } from "react-hook-form";

interface forgotPaswordType {
  open: boolean;
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgotPasword = ({ open, setOpen }: forgotPaswordType) => {
  const [sendRestEmail] = useSendResetEmailMutation();
  const form = useForm<{ email: string }>({
    mode: "all",
    defaultValues: {
      email: "",
    },
  });
  const {
    handleSubmit,
    register,
    watch,
    reset,
    clearErrors,
    formState: { isSubmitting, isSubmitted, errors },
  } = form;
  const onSubmit = async (data: { email: string }) => {
    console.log(data);
    try {
      await sendRestEmail(data).unwrap();
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
  };
  console.log({ errors });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        clearErrors();
        reset();
        setOpen(false);
      }}
    >
      <DialogContent
        whiteClose
        className="bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg px-4 py-4"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-100">Forgot Password</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 "
          >
            <div>
              <Input
                id="email"
                placeholder="Email"
                className="text-textgray bg-transparent placeholder:text-textgray "
                {...register("email", {
                  required: isSubmitted && "Required",
                  maxLength: {
                    value: 40,
                    message: "Should be 40 characters or less",
                  },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Incorrect email format",
                  },
                })}
              />
              {errors.email?.message && (
                <span className="text-red-500 text-xs mt-[5px]">
                  {errors.email?.message}
                </span>
              )}
            </div>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              className="w-full text-black bg-primary focus-within:border-transparent"
            >
              Send
            </LoadingButton>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasword;
