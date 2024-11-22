import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoginFormSchema, loginSchema } from "@/schema/LoginSchema";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const initailValue = {
  email: "",
  rememberme: false,
};

const AuthenticationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: initailValue,
  });

  // const onSubmit = (data: LoginFormSchema) => {
  //   console.log("Form Data:", data);

  //   // Generate OTP
  //   const generatedOtp = "642987";
  //   setOtp(generatedOtp);

  //   // Simulate an API response with the OTP
  //   console.log(`OTP Generated for ${data.email}: ${generatedOtp}`);

  //   alert("afsaf");
  //   // Navigate to OTP page
  //   navigate("/otp", { state: { email: data.email, otp: generatedOtp } });
  // };

  const onSubmit = (data: LoginFormSchema) => {
    const generatedOtp = "642987";
    setOtp(generatedOtp);

    // Simulate an API response with the OTP
    console.log(`OTP Generated for ${data.email}: ${generatedOtp}`);

    // Navigate to OTP page
    navigate("/login-otp", {
      state: { email: data.email, otp: generatedOtp },
    });

    toast({
      variant: "success",
      title: "Login",
      description: `${`Your OTP sent your register email`}`,
    });
    if (data.rememberMe) {
      localStorage.setItem("userEmail", data.email);
      console.log("Email stored in localStorage:", data.email);
    }
  };

  return (
    <div className="loginpage-image bg-slate-900">
      <div className="max-w-[1800px] mx-auto xs:mx-0">
        <div className="flex sm:mx-16 justify-center sm:justify-between items-center h-dvh xs:mx-0">
          <div className="flex flex-col gap-2 xs:gap-0"></div>
          <div>
            <Card className="px-16 max-w-md bg-white/5 backdrop-blur-lg rounded-3xl border border-white/40 shadow-lg p-2">
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
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          error={errors.email?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      name="rememberMe"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="rememberme"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-white border-checkboxborder"
                        />
                      )}
                    />

                    <label
                      htmlFor="rememberme"
                      className="font-poppins text-textgray text-sm font-medium leading-none"
                    >
                      Remember Me
                    </label>
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
