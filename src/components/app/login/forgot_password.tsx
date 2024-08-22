import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import "./style.css";
import { login } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
const { VITE_APP_SITEKEY } = import.meta.env;
import logomainsvg from "@/assets/logo-main.svg";
import { useSendResetEmailMutation } from "@/services/resetPassApi";
import { ErrorType } from "@/app/types";

// interface forgotPaswordType {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// { open, setOpen }: forgotPaswordType
const ForgotPasword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [isCaptchaError, setCaptchaError] = useState(false);

  const [sendRestEmail] = useSendResetEmailMutation();
  const form = useForm<{ email: string }>({
    mode: "onChange",
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
    formState: { isSubmitting, isSubmitted, errors, isSubmitSuccessful },
  } = form;

  const onSubmit = async (data: { email: string }) => {
    console.log(data);
    const recaptchaValue = recaptchaRef.current?.getValue();

    if (!recaptchaValue) {
      console.log("Please complete the ReCAPTCHA challenge.");
      setCaptchaError(true);
      return;
    }
    try {
      const resp = await sendRestEmail(data).unwrap();
      if (resp) {
        toast({
          variant: "success",
          title: `An e-mail with a password reset link has been sent to ${data.email}. If you did not receive the email, please check your spam/junk mail folder`,
        });
        setCaptchaError(false);
        reset();
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
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

      setCaptchaError(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  function onChange(value: any) {
    setCaptchaError(false);
  }

  return (
    <div className="loginpage-image">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex mx-16 justify-between items-center h-dvh ">
          <div className=" flex flex-col gap-2"></div>
          <div>
            <Card className="mx-auto max-w-md bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-center items-center">
                    <div>
                      <img
                        src={logomainsvg}
                        height={110}
                        width={100}
                        alt="Main logo"
                      ></img>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="hero-topHeading italic tracking-wider leading-5 text-[1.3rem] text-textprimary">
                        Request
                      </h1>
                      <p className="text-textwhite leading-5 italic font-semibold text-[1.8rem]">
                        New Password
                      </p>
                      <p className="text-textgray leading-5 text-[0.9rem]">
                        We will send password recovery instructions to the email
                        if an account exists with us.
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormProvider {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                      <input
                        id="username"
                        type="text"
                        placeholder="Enter you email"
                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                        {...register("email", {
                          required: "Email is required.",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email format.",
                          },
                          maxLength: 50,
                        })}
                      />
                    </div>
                    {errors.email?.message && (
                      <span className="text-xs text-red-400 font-poppins ">
                        {errors.email.message as string}
                      </span>
                    )}
                    {errors.email?.type == "maxLength" && (
                      <span className="text-xs text-red-400 font-poppins ">
                        Max length exceeded
                      </span>
                    )}

                    <div>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        theme="dark"
                        sitekey={VITE_APP_SITEKEY}
                        onChange={onChange}
                        size="normal"
                      />
                      {isCaptchaError && (
                        <>
                          <span className="text-red-400 text-xs font-poppins">
                            Please complete the reCaptcha
                          </span>
                        </>
                      )}
                    </div>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                    >
                      Submit
                    </LoadingButton>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
            <div className="flex justify-center items-center mt-5 flex-col">
              <div>
                <p className="Poppins text-textgray text-sm">
                  By using this app you agree to the
                </p>
              </div>
              <div>
                <p className="Poppins text-textgray text-sm">
                  <span className="text-textprimary">Let’s Move</span> Privacy
                  Statement - Terms & condition{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasword;
