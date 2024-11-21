import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import IMAGES from "@/assets/IMAGES";
import CommonInput from "@/components/custom-component/CommonInput";
import CommonButton from "@/components/custom-component/CommonButton";

const initialFormData = {
  email: "",
  rememberMe: false,
};

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    navigate("/login-otp");
  };

  return (
    <div className="loginpage-image">
      <div className="max-w-[1800px] mx-auto xs:mx-0">
        <div className="flex sm:mx-16 justify-center sm:justify-between items-center h-dvh xs:mx-0">
          <div className=" flex flex-col gap-2 xs:gap-0"></div>
          <div>
            <Card className="px-16 max-w-md bg-white/30 backdrop-blur-lg rounded-3xl border border-white/40 shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-2 flex justify-center items-center">
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
                        Welcome Back 👋
                      </p>
                      <p className="text-textgray leading-5 text-[0.9rem]">
                        Reach your goals at the gym with over 50 programs
                        designed for results
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <CommonInput
                      name="email"
                      placeholder="Enter Your Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange(e.target.name, e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberme"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                      className="text-white border-checkboxborder"
                    />
                    <label
                      htmlFor="rememberme"
                      className="font-poppins text-textgray text-sm font-medium leading-none"
                    >
                      Remember Me
                    </label>
                  </div>

                  <div>
                    {/* ReCAPTCHA purely for UI */}
                    <ReCAPTCHA
                      theme="dark"
                      sitekey="YOUR_SITE_KEY"
                      size="normal"
                    />
                  </div>
                  <CommonButton title="Login" type="submit" />
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
                  <span className="text-white mr-2 text-lg">QMS</span>
                  <Link
                    className="text-QtextPrimary underline"
                    to="/privacy-statement"
                  >
                    Privacy Statement
                  </Link>{" "}
                  -{" "}
                  <Link
                    className="text-QtextPrimary underline"
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
};

export default AuthenticationPage;
