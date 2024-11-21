import React from "react";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IMAGES from "@/assets/IMAGES";
import CommonButton from "@/components/custom-component/CommonButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

const LoginOTP: React.FC = () => {
  const navigate = useNavigate();
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
                <form className="space-y-4">
                  <div className="flex my-3 flex-col justify-center items-center">
                    <InputOTP maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="flex items-center justify-between my-3 w-80">
                      <div>
                        <p className="text-[.8rem] text-textgray">
                          Remaining time :{" "}
                          <span className="text-QtextPrimary">00:59</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[.8rem] text-QtextPrimary underline hover:cursor-pointer">
                          Resent OTP
                        </p>
                      </div>
                    </div>
                  </div>
                  <CommonButton
                    title="Continue"
                    type="button"
                    onClick={() => navigate("/dashboard")}
                  />
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
