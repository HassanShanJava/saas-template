import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Button } from "react-day-picker";
import { useForm, FormProvider } from "react-hook-form";

interface forgotPaswordType {
  open: boolean;
  setOpen: any;
}

const ForgotPasword = ({ open, setOpen }: forgotPaswordType) => {
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
