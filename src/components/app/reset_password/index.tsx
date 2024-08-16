import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import logomainsvg from "@/assets/logo-main.svg";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ResetPassword = () => {
    const { token } = useParams()
    const form = useForm<{ password: string, confirmPassword: string }>({
        mode: "all",
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })
    const { handleSubmit, register, formState: { isSubmitting, errors } } = form
    const onSubmit = async (data: { password: string, confirmPassword: string }) => {
        console.log({ data })
    }
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-black/90">
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
                                        Account Recovery
                                    </h1>
                                    <p className="text-textwhite leading-5 italic font-semibold text-[1.8rem]">
                                        Reset password
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
                                        type="email"
                                        placeholder="Enter you email"
                                        className="w-full bg-transparent border-checkboxborder text-textgray outline-none"
                                    // {...register("email", {
                                    //     required: "Email is required",
                                    //     pattern: {
                                    //         value: /\S+@\S+\.\S+/,
                                    //         message: "Invalid email address",
                                    //     },
                                    //     maxLength: 64,
                                    // })}
                                    />
                                </div>
                                {/* {errors.email?.message && (
                                    <span className="text-xs text-red-400 font-poppins ">
                                        {errors.email.message as string}
                                    </span>
                                )}
                                {errors.email?.type == 'maxLength' && (
                                    <span className="text-xs text-red-400 font-poppins ">
                                        Max length exceeded
                                    </span>
                                )} */}
                                <div className="flex items-center custom-box-shadow w-full gap-2 px-4 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 ">
                                    <input
                                        id="password"
                                        // type={isPasswordVisible ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full  bg-transparent border-checkboxborder text-textgray outline-none"
                                    // {...register("password", {
                                    //     required: true,
                                    //     maxLength: 50,
                                    //     minLength: 8,
                                    // })}
                                    />
                                    {/* <FontAwesomeIcon
                                        icon={isPasswordVisible ? faEyeSlash : faEye}
                                        color="gray"
                                        className="pr-2"
                                        onClick={togglePasswordVisibility}
                                    /> */}
                                </div>
                                {/* {errors.password && errors.password.type === "required" && (
                                    <span className="text-red-400 text-xs font-poppins">
                                        Password is required
                                    </span>
                                )}
                                {errors.password?.type == 'maxLength' && (
                                    <span className="text-xs text-red-400 font-poppins ">
                                        Max length exceeded
                                    </span>
                                )}
                                {errors.password?.type == 'minLength' && (
                                    <span className="text-xs text-red-400 font-poppins ">
                                        Password too small
                                    </span>
                                )} */}


                                <LoadingButton
                                    // loading={loading}
                                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 bg-primary text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500"
                                >
                                    {false ? "Logging In" : "Login"}
                                </LoadingButton>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
                
            </div>
        </>
    )
}

export default ResetPassword