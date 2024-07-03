import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
const { VITE_APP_SITEKEY } = import.meta.env;

export default function AuthenticationPage() {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checked, setChecked] = useState<boolean>(false);
  const { loading, userInfo, error } = useSelector(
    (state: RootState) => state.auth
  );
  const email = localStorage.getItem("email") ?? "";
  const password = localStorage.getItem("password") ?? "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, isValid, errors },
    setValue,
    reset,
  } = useForm<{ email: string; password: string; rememberme: boolean }>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email,
      password,
      rememberme: false,
    },
  });

  useEffect(() => {
    if (error != null)
      toast({
        variant: "destructive",
        title: error,
        description: "There was a problem with your request.",
      });
    console.log(error);
  }, [error]);

  useEffect(() => {
    if (userInfo !== null) {
      toast({
        variant: "success",
        title: "LogIn",
        description: "You are Successfully Logged In",
      });
      navigate("/admin/dashboard");
    }
  }, [navigate, userInfo]);

  const handleRememberMe = (e: any) => {
    setValue("rememberme", e);
    setChecked(e);
  };

  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
    rememberme: boolean;
  }> = async (data) => {
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      console.log("Please complete the ReCAPTCHA challenge.");
      setCaptchaError(true);
      return;
    }

    console.log("Form data:", data);
    dispatch(login(data));

    setCaptchaError(false);
    reset();
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };
  const [isCaptchaError, setCaptchaError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function onChange(value: any) {
    setCaptchaError(false);
  }

  console.log("Loading auth", loading);
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
                        src="logo-main.svg"
                        height={110}
                        width={100}
                        alt="Logo"
                      ></img>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="hero-topHeading italic tracking-wider leading-5 text-[1.3rem] text-textprimary">
                        Login
                      </h1>
                      <p className="text-textwhite leading-5 italic font-semibold text-[1.8rem]">
                        Your Account
                      </p>
                      <p className="text-textgray leading-5 text-[0.9rem]">
                        Reach your goals at the gym with over 50 programs
                        designed for result
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    <input
                      id="username"
                      type="email"
                      placeholder="Enter you email id"
                      className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email?.message && (
                    <span className="text-sm text-red-400 font-poppins ">
                      {errors.email.message as string}
                    </span>
                  )}
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    <input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full  bg-transparent border-checkboxborder text-textgray outline-none"
                      {...register("password", { required: true })}
                    />
                    <FontAwesomeIcon
                      icon={isPasswordVisible ? faEyeSlash : faEye}
                      color="gray"
                      className="pr-2"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-red-400 text-sm font-poppins">
                      Password is required
                    </span>
                  )}
                  <div className="flex justify-between items-center p-0 m-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberme"
                        checked={checked}
                        onCheckedChange={handleRememberMe}
                        className="text-black border-checkboxborder"
                        {...register("rememberme")}
                      />
                      <label
                        htmlFor="rememberme"
                        className="font-poppins text-textgray text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember Me
                      </label>
                    </div>
                    <div>
                      <span className="text-[0.8rem] underline font-semibold text-textprimary">
                        Forget Password?
                      </span>
                    </div>
                  </div>
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
                        <span className="text-red-400 text-sm font-poppins">
                          Fill the captcha
                        </span>
                      </>
                    )}
                  </div>
                  {loading ? (
                    <LoadingButton
                      loading
                      className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                    >
                      Logging In
                    </LoadingButton>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                    >
                      Login
                    </Button>
                  )}
                </form>
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
}
