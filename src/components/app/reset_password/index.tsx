import { useNavigate, useParams } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import logomainsvg from "@/assets/logo-main.svg";
import PasswordStrengthIndicator from "./password-strength-indicator.tsx";
import { isStrongPassword, ValidatePassword } from "./password-strength.ts";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import {
    useResetPasswordMutation,
    useVerifyTokenQuery,
} from "@/services/resetPassApi.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { ErrorType } from "@/app/types.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPassword = () => {
    const { token } = useParams();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const toggleVisibility = (setState: React.Dispatch<SetStateAction<boolean>>) => setState(prev => !prev)
    const navigate = useNavigate();
    const [userData, setUserData] = useState<Record<string, any>>({})
    const { data: verifyToken, error } = useVerifyTokenQuery(token as string, {
        skip: token == undefined
    });
    const [resetPassword] = useResetPasswordMutation();

    const form = useForm<{ new_password: string; confirm_password: string }>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            new_password: "",
            confirm_password: "",
        },
    });

    useEffect(() => {
        if (verifyToken !== undefined && !error) {
            setUserData(verifyToken)
        } else if (error && typeof error === "object" && "data" in error) {
            const typedError = error as ErrorType;
            toast({
                variant: "destructive",
                title: typedError.data?.detail,
            });
            navigate('/');

        }
    }, [verifyToken, error]);

    const {
        handleSubmit,
        register,
        watch,
        formState: { isSubmitting, errors, isSubmitSuccessful },
    } = form;

    const password = watch("new_password");
    const passwordStrength = useMemo(
        () => ValidatePassword(password),
        [password]
    );

    const onSubmit = useCallback(async (data: { new_password: string; confirm_password: string }) => {
        try {
            if (userData) {

                const payload = {
                    token: token as string,
                    id: userData?.id as number,
                    org_id: userData?.org_id as number,
                    ...data
                }
                console.log({ payload })
                await resetPassword(payload).unwrap();
                if (isSubmitSuccessful) {
                    toast({
                        variant: "success",
                        title: "Password Reset Successfully",
                    });
                    navigate('/');
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
        }
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
                                            required: "Required",
                                            pattern: {
                                                value:
                                                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,50}$/,
                                                message: "Follow the password structure.",
                                            },
                                        })}
                                    />
                                    <FontAwesomeIcon
                                        icon={isPasswordVisible ? faEyeSlash : faEye}
                                        color="gray"
                                        className="pr-2"
                                        onClick={() => toggleVisibility(setIsPasswordVisible)}
                                    />
                                </div>
                                <PasswordStrengthIndicator
                                    passwordStrength={passwordStrength}
                                />

                                <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                                    <input
                                        id="confirm_password"
                                        type={isConfirmPasswordVisible   ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                                        {...register("confirm_password", {
                                            required: "Required",
                                            maxLength: {
                                                value: 50,
                                                message: "Max length exceeded",
                                            },
                                            validate: (val: string) => {
                                                if (watch('new_password') != val && val !== '') {
                                                    return "Your passwords do no match";
                                                }
                                            }
                                        })}
                                    />
                                    <FontAwesomeIcon
                                        icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
                                        color="gray"
                                        className="pr-2"
                                        onClick={() => toggleVisibility(setIsConfirmPasswordVisible)}
                                    />
                                </div>


                                {errors.confirm_password?.message && (
                                    <span className="text-red-500 text-xs mt-[5px]">
                                        {errors.confirm_password?.message}
                                    </span>
                                )}

                                <LoadingButton
                                    type="submit"
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
};

export default ResetPassword;
