import React, { useEffect } from "react";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IMAGES from "@/assets/IMAGES";
import CommonButton from "@/components/custom-component/CommonButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { OTPFormValues, otpSchema } from "@/schema/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

const LoginOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { email, otp } = location.state;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = (data: OTPFormValues) => {
    if (data.otp == otp) {
      console.log("OTP Entered: ", data.otp);
      localStorage.setItem("userToken", "payload.token.access_token");
      navigate("/admin/dashboard");
      toast({
        variant: "success",
        title: "Login",
        description: `${`Login Successfull`}`,
      });
    } else {
      console.log("Please enter correct otp");
    }
  };

  const onResentOtp = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      console.log("Email from localStorage:", storedEmail);
    } catch (error) {
      console.log("onResentOTP error ==>", error);
    }
  };

  // Fetch email from localStorage
  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("userEmail");
  //   if (storedEmail) {
  //     console.log("Email from localStorage:", storedEmail);
  //   } else {
  //     console.log("No email found in localStorage.");
  //   }
  // }, []);

  return (
    <div className="loginpage-image bg-[#bebbbb]">
      <div className="max-w-[1800px] mx-auto xs:mx-0">
        <div className="flex sm:mx-16 justify-center sm:justify-between items-center h-dvh xs:mx-0">
          <div className=" flex flex-col gap-2 xs:gap-0"></div>
          <div>
            <Card className="px-16 max-w-md bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-center items-center">
                    <div>
                      <img
                        src={IMAGES.logo_icon}
                        height={110}
                        width={100}
                        alt="Main logo"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* <h1 className="hero-topHeading italic tracking-wider leading-5 text-[1.3rem] text-QtextPrimary">
                        Log In
                      </h1> */}
                      <p className="text-QtextPrimary leading-5 italic font-semibold text-[1.8rem]">
                        Enter Code
                      </p>
                      <p className="text-textgray leading-5 text-[0.9rem]">
                        We sent OTP code to your email address
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex my-3 flex-col justify-center items-center">
                    <Controller
                      name="otp"
                      control={control}
                      render={({ field }) => (
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            {[...Array(6)].map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.otp.message}
                      </p>
                    )}
                    <div className="flex items-center justify-between my-3 w-80">
                      <div>
                        <p className="text-[.8rem] text-textgray">
                          Remaining time :{" "}
                          <span className="text-QtextPrimary">00:59</span>
                        </p>
                      </div>
                      <div onClick={onResentOtp}>
                        <p className="text-[.8rem] text-QtextPrimary underline hover:cursor-pointer">
                          Resent OTP
                        </p>
                      </div>
                    </div>
                  </div>
                  <CommonButton title="Continue" type="submit" />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOTP;
