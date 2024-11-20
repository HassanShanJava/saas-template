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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
const { VITE_APP_SITEKEY, VITE_Domain_Name } = import.meta.env;
import logomainsvg from "@/assets/logo-main.svg";
import { extractLinks } from "@/utils/helper";
import useDocumentTitle from "@/components/ui/common/document-title";

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { loading, userInfo, error, isLoggedIn } = useSelector(
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
  } = useForm<{
    email: string;
    password: string;
    rememberme: boolean;
  }>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email,
      password,
      rememberme: false,
    },
  });

  useEffect(() => {
    if (error != null) {
      console.log("Error Login", error);
      setCaptchaError(false);
      // reset(initalValue);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (loading || !isLoggedIn) return;
    setCaptchaError(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }

    if (userInfo) {
      const sidepanel = localStorage.getItem("sidepanel");
      const decodedSidepanel = JSON.parse(atob(sidepanel as string));
      const links =   extractLinks(decodedSidepanel);
      toast({
        variant: "success",
        title: "LogIn",
        description: "You are successfully logged In",
      });
      console.log("Screen width", window.innerWidth);
    }
  }, [loading]);

  const handleRememberMe = (e: boolean) => {
    setValue("rememberme", e);
    if (e == false) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
    rememberme: boolean;
    persona?: string;
  }> = async (data) => {
    const recaptchaValue = recaptchaRef.current?.getValue();

    if (!recaptchaValue) {
      console.log("Please complete the ReCAPTCHA challenge.");
      setCaptchaError(true);
      return;
    }

    const payload = {
      ...data,
      email: data.email.toLowerCase(),
      website_url: VITE_Domain_Name,
    };

    console.log("Form data:", payload);
    dispatch(login(payload));
    // recaptchaRef.current?.reset();
  };

  const [isCaptchaError, setCaptchaError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function onChange(value: any) {
    setCaptchaError(false);
  }
  useDocumentTitle("Login");
  return (
    <div className="loginpage-image">
      <div className="max-w-[1800px] mx-auto xs:mx-0">
        <div className="flex sm:mx-16 justify-center sm:justify-between items-center h-dvh xs:mx-0 ">
          <div className=" flex flex-col gap-2 xs:gap-0"></div>
          <div>
            <Card className="px-16 max-w-md bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
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
                        Log In
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    <input
                      maxLength={50}
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
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    <input
                      maxLength={50}
                      minLength={8}
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full  bg-transparent border-checkboxborder text-textgray outline-none"
                      {...register("password", {
                        required: "Password is required.",
                        maxLength: 50,
                        minLength: 8,
                      })}
                    />
                    <FontAwesomeIcon
                      icon={isPasswordVisible ? faEyeSlash : faEye}
                      color="gray"
                      className="pr-2"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-red-400 text-xs font-poppins">
                      Password is required
                    </span>
                  )}
                  {errors.password?.type == "maxLength" && (
                    <span className="text-xs text-red-400 font-poppins ">
                      Max length exceeded
                    </span>
                  )}
                  {errors.password?.type == "minLength" && (
                    <span className="text-xs text-red-400 font-poppins ">
                      Password too small
                    </span>
                  )}

                  <div className="flex justify-between items-center p-0 m-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberme"
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
                    <div
                      onClick={() => navigate("/forgot_password")}
                      className="cursor-pointer"
                    >
                      <span className="text-[0.8rem] underline font-semibold text-textprimary">
                        Forgot Password?
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
                        <span className="text-red-400 text-xs font-poppins">
                          Please complete the reCaptcha
                        </span>
                      </>
                    )}
                  </div>
                  <LoadingButton
                    loading={loading}
                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                  >
                    {loading ? "Logging In" : "Sign In"}
                  </LoadingButton>
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
                  <span className="text-primary mr-2 text-lg">FitnFi</span>
                  <Link
                    className="text-primary underline"
                    to="/privacy-statement"
                  >
                    Privacy Statement
                  </Link>{" "}
                  -{" "}
                  <Link
                    className="text-primary underline"
                    to="/terms-and-conditions"
                  >
                    Terms & condition{" "}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
