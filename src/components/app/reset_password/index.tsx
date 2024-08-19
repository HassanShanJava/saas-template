import { useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import logomainsvg from "@/assets/logo-main.svg";
import PasswordStrengthIndicator from "./password-strength-indicator.tsx";
import { isStrongPassword, ValidatePassword } from "./password-strength.ts";
import { useCallback, useMemo } from "react";



const ResetPassword = () => {
    const { token } = useParams()
    const form = useForm<{ password: string; confirmPassword: string }>({
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const { handleSubmit, register, watch, formState: { isSubmitting, errors } } = form;

    const password = watch("password");
    const passwordStrength = useMemo(() => ValidatePassword(password), [
        password
    ]);

    const onSubmit = useCallback((data:{ password: string; confirmPassword: string }) => {
        
        console.log("Submitted:", data);
      }, []);

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-black/90 ">
                <Card className="mx-auto bg-transparent bg-opacity-10  backdrop-blur-sm custom-gradient-bg rounded-3xl border-checkboxborder shadow-lg p-2">
                    <CardHeader>
                        <CardTitle>
                            <div className="gap-1 flex justify-center items-center">
                                <div>
                                    <img
                                        src={logomainsvg}
                                        height={110}
                                        width={100}
                                        alt="Main logo"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1 className="hero-topHeading italic tracking-wider leading-5 text-[1.3rem] text-textprimary">
                                        Account Recovery
                                    </h1>
                                    <p className="text-textwhite leading-5 italic font-semibold text-[1.8rem]">
                                        Reset password
                                    </p>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <FormProvider {...form}>
                            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                                        {...register('password', {
                                            required: "Required",
                                            pattern: {
                                                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,15}$/,
                                                message: "Follow the password structure."
                                            }
                                        })}
                                    />
                                </div>
                                <PasswordStrengthIndicator passwordStrength={passwordStrength} />


                                <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                                        {...register("confirmPassword", {
                                            required: "Required",
                                            maxLength: {
                                                value: 50,
                                                message: "Max length exceeded",
                                            },
                                        })}
                                    />
                                </div>


                                <LoadingButton
                                    type='submit'
                                    loading={isSubmitting}
                                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                                >
                                    Reset Password
                                </LoadingButton>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default ResetPassword