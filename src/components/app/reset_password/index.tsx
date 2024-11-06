import { useNavigate, useParams } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import logomainsvg from "@/assets/logo-main.svg";
import PasswordStrengthIndicator from "./password-strength-indicator.tsx";
import { isStrongPassword, ValidatePassword } from "./password-strength.ts";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useResetPasswordMutation,
  useVerifyTokenQuery,
} from "@/services/resetPassApi.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { ErrorType } from "@/app/types.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const ResetPassword = () => {
  const { token } = useParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const toggleVisibility = (
    setState: React.Dispatch<SetStateAction<boolean>>
  ) => setState((prev) => !prev);
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  const {
    data: verifyToken,
    error,
    isLoading,
  } = useVerifyTokenQuery(token as string);
  const [resetPassword] = useResetPasswordMutation();

  const form = useForm<{
    new_password: string;
    confirm_password: string;
    id: number;
    org_id: number;
  }>({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      new_password: undefined,
      confirm_password: undefined,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        variant: "success",
        title: `Please loggout first`,
      });
      navigate("/")
      return;
    }

    if (verifyToken !== undefined && !error) {
      form.reset({
        id: verifyToken.id,
        org_id: verifyToken.org_id,
        new_password: "",
        confirm_password: "",
      });
    } else if (error && typeof error === "object" && "data" in error) {
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
  }, [verifyToken, error, isAuthenticated]);

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = form;
  const watcher = watch();
  const password = watch("new_password");
  const passwordStrength = useMemo(
    () => ValidatePassword(password),
    [password]
  );

  console.log({ watcher, errors });

  const onSubmit = useCallback(
    async (data: {
      new_password: string;
      confirm_password: string;
      id: number;
      org_id: number;
    }) => {
      const payload = {
        token: token as string,
        ...data,
      };
      console.log("input payload", { data });
      try {
        console.log({ payload });
        const resp = await resetPassword(payload).unwrap();
        if (resp) {
          toast({
            variant: "success",
            title:
              "Your password has been reset successfully. You can now log in with your new password",
          });
          navigate("/");
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
    }, []);

  return (
    <div className="loginpage-image">
      <div className="max-w-[1800px] mx-auto">
        {isLoading ? ( // Replace with your loading state condition
          <div className="grid grid-cols-5 mx-16 justify-between items-center h-dvh">
            <div className="col-span-3"></div>
            <Card className="col-span-2 w-full mx-auto bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-start items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <div></div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        ) : verifyToken !== undefined && !error ? (
          <div className="grid grid-cols-3 mx-16 justify-between items-center h-dvh ">
            <div className="col-span-1 xlg:col-span-2"></div>
            <Card className="col-span-2 xlg:col-span-1 mx-auto bg-transparent bg-opacity-10  backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-center items-center">
                    <div>
                      <img
                        src={logomainsvg}
                        height={70}
                        width={70}
                        alt="Main logo"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-textwhite leading-5 italic font-semibold text-[1.43rem]">
                        Reset Your Password.
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <FormProvider {...form}>
                  <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                      <input
                        id="new_password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="New Password"
                        className="w-full  bg-transparent border-checkboxborder text-textgray outline-none"
                        {...register("new_password", {
                          required: "New Password is required.",
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~\[\]\|?]).{8,}$/,
                            message: "Follow the password structure.",
                          },
                          maxLength: 50,
                        })}
                      />
                      <FontAwesomeIcon
                        icon={isPasswordVisible ? faEyeSlash : faEye}
                        color="gray"
                        className="pr-2"
                        onClick={() => toggleVisibility(setIsPasswordVisible)}
                      />
                    </div>
                    {errors.new_password?.type == "required" && (
                      <span className="text-xs text-red-400 font-poppins ">
                        {errors.new_password?.message}
                      </span>
                    )}

                    {errors.new_password?.type == "maxLength" && (
                      <span className="text-xs text-red-400 font-poppins ">
                        Max length exceeded
                      </span>
                    )}

                    <PasswordStrengthIndicator
                      passwordStrength={passwordStrength}
                    />

                    <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                      <input
                        id="confirm_password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                        {...register("confirm_password", {
                          required: "Confirm Password is required.",
                          maxLength: 50,
                          validate: (val: string) => {
                            if (watch("new_password") != val && val !== "") {
                              return "Passwords do not match";
                            }
                          },
                        })}
                      />
                      <FontAwesomeIcon
                        icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
                        color="gray"
                        className="pr-2"
                        onClick={() =>
                          toggleVisibility(setIsConfirmPasswordVisible)
                        }
                      />
                    </div>

                    {errors.confirm_password?.message && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        {errors.confirm_password?.message}
                      </span>
                    )}

                    {errors.confirm_password?.type == "maxLength" && (
                      <span className="text-red-500 text-xs mt-[5px]">
                        Max length exceeded
                      </span>
                    )}

                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 disabled:cursor-not-allowed `}
                    >
                      Submit
                    </LoadingButton>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-5 mx-16 justify-between items-center h-dvh ">
            <div className=" col-span-3"></div>
            <Card className="col-span-2 mx-auto bg-transparent bg-opacity-10  backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-center items-center">
                    <div>
                      <img
                        src={logomainsvg}
                        height={70}
                        width={70}
                        alt="Main logo"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-textwhite leading-5 italic font-semibold text-[1.43rem]">
                        Reset Your Password.
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-white text-[1.2rem]">
                    <p>
                      The reset link is invalid or expired. Please request a new
                      link from the{" "}
                      <span
                        onClick={() => {
                          navigate("/forgot_password");
                        }}
                        className="cursor-pointer underline font-semibold text-textprimary"
                      >
                        forgot password
                      </span>{" "}
                      page. Or go to{" "}
                      <span
                        onClick={() => {
                          navigate("/");
                        }}
                        className="cursor-pointer underline font-semibold text-textprimary pr-1"
                      >
                        Login
                      </span>
                      page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
