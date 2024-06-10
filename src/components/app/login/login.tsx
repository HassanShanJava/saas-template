import "./style.css";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReCAPTCHA from "react-google-recaptcha";
import {faEnvelope,faEye} from "@fortawesome/free-regular-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@/components/ui/checkbox";
const {VITE_APP_SITEKEY} =import.meta.env;
import React, { useEffect } from "react";
export default function AuthenticationPage(){

  function onChange(value:any) {
    console.log("Captcha value:", value);
  }
    return (
      <div className="max-w-[1800px] mx-auto loginpage-image">
        <div className="flex mx-16 justify-between items-center h-dvh ">
          <div className=" flex flex-col gap-2"></div>
          <div>
            <Card className="mx-auto max-w-md bg-transparent bg-opacity-10 backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
              <CardHeader>
                <CardTitle>
                  <div className="gap-1 flex justify-center items-center">
                    <div>
                      <img src="logo-main.svg" height={110} width={100}></img>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="hero-topHeading italic tracking-wider leading-5	text-[1.3rem] text-textprimary">
                        Login
                      </h1>
                      <p className="text-textwhite leading-5	 italic font-semibold text-[1.8rem]">
                        {" "}
                        Your Account
                      </p>
                      <p className="text-textgray leading-5	text-[0.9rem] ">
                        Reach your goals at the gym with over 50 programs
                        designed for result
                      </p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  {" "}
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    <input
                      id="username"
                      type="email"
                      placeholder="Enter you email id"
                      className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                    />
                  </div>
                  <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                    {" "}
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter you password"
                      className="w-full  bg-transparent border-checkboxborder text-textgray outline-none"
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      color="gray"
                      className="pr-2"
                    />
                  </div>
                  <div className="flex justify-between items-center p-0 m-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        className="text-black border-checkboxborder"
                      />
                      <label
                        htmlFor="terms"
                        className=" font-poppins text-textgray text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember Me
                      </label>
                    </div>
                    <div>
                      <span className="text-[0.8rem] underline font-semibold  text-textprimary">
                        Forget Password?
                      </span>
                    </div>
                  </div>
                  <div>
                    <ReCAPTCHA
                      
                      sitekey={VITE_APP_SITEKEY}
                      onChange={onChange}
                    />
          
                  </div>
                  <Button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                  >
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}