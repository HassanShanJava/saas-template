import React, { useState } from "react";
import { motion } from "framer-motion";
import { FormDataSchema } from "@/schema/formSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Mail, Phone, PhoneCall } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Inputs = z.infer<typeof FormDataSchema>;
const steps = [
  {
    id: "1",
    name: "Personal Information",
    fields: [
      "firstName",
      "lastName",
     
      "email",
      "phoneno",
      "subscription",
    ],
  },
  {
    id: "2",
    name: "Address Setup",
    fields: ["address", "country", "zip"],
  },
  {
    id: "3",
    name: "Bank Details",
    fields: ["bankaccount", "swiftcode", "cardholdername","bankname"],
  },
];
interface Props {
  updateParentState: (newState: boolean) => void;
}
export default function Form({ updateParentState }: Props) {
  const [date, setDate] = React.useState<Date>();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    // reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  console.log(register)
  return (
    <section className="absolute inset-0 flex flex-col justify-between p-10 ">
      {/* steps */}
      <nav aria-label="Progress">
        <ol
          role="list"
          className="md:flex md:space-x-1  justify-center items-center "
        >
          <Button
            className="bg-white w-10 rounded-full absolute -left-6 p-0.5 hover:opacity-75"
            onClick={() => updateParentState(false)}
          >
            <div className="w-full h-full flex justify-center items-center bg-[#E2E8F0] rounded-full">
              <IoIosArrowForward className="h-4 w-4 text-black " />
            </div>
          </Button>
          {steps.map((step, index) => (
            <li key={step.name} className="flex items-center relative">
              {currentStep > index ? (
                <div className="flex justify-start items-center gap-2  transition-colors">
                  <div className="flex w-10 h-10 rounded-full bg-orange-600 justify-center items-center">
                    <span className="text-sm font-medium text-white">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-80 bg-gray-300"></div>
                  )}
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex justify-start items-center gap-2"
                  aria-current="step"
                >
                  <div className="flex w-10 h-10 rounded-full bg-orange-600 justify-center items-center">
                    <span className="text-sm font-medium text-white ">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-80 bg-gray-300"></div>
                  )}
                </div>
              ) : (
                <div className="flex justify-start items-center gap-2 transition-colors ">
                  <div className="flex w-10 h-10 rounded-full bg-white border-2 border-gray-200 justify-center items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-80 bg-gray-300"></div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="h-full" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            // initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            // animate={{ x: 0, opacity: 1 }}
            // transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className=" border-2 border-gray-200 max-w-[100%] h-full mt-5 py-4 rounded-xl  px-3">
              <div className="flex justify-center items-center flex-col gap-2 ">
                <div className="w-full px-5 grid-cols-12">
                  <div className="flex justify-between items-center w-full col-span-4 ">
                    <div className="flex flex-col w-64 justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className="text-sm font-bold">Full Name</h3>
                        <Badge className="bg-[#EBEFF4] border-2 border-[#DBE2EC] text-[#64748B] text-xs rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          Enter your legal name as it appears on your official
                          identification.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-4 col-span-8">
                      <div className="w-[45%] col-span-4">
                        <Input
                          id="firstname"
                          {...register("firstName")}
                          type="text"
                          placeholder="Enter First Name"
                          className=" bg-transparent outline-none"
                        />
                        {errors.firstName?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="w-[45%] col-span-4">
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          type="text"
                          placeholder="Enter Second Name"
                          className="bg-transparent outline-none"
                        />
                        {errors.lastName?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Date Of Birth</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          This informationm is required to verify your age and
                          provide age-appropirate services.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full m-3 justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            id="dob"
                            {...register("dob")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.dob?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.dob.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Gender</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          Select your gender from the options.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }
                      >
                        <RadioGroup
                          {...register("gender")}
                          defaultValue="male"
                          className="w-full h-full px-3 flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="gender" />
                            <Label htmlFor="r1">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="gender" />
                            <Label htmlFor="r2">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="prefer not to say"
                              id="gender"
                            />
                            <Label htmlFor="r3">Prefer not to say</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {errors.gender?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Email</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          Please provide a valid email address that you have
                          access to.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <Mail className="w-6 h-6 text-gray-500" />
                          <input
                            id="email"
                            {...register("email", {
                              required: "Email is Required",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email address",
                              },
                            })}
                            type="text"
                            placeholder="Email"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.email?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Phone No</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          Please provide a valid phone number where we can reach
                          you if needed.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <PhoneCall className="w-6 h-6 text-gray-500" />
                          <input
                            id="phoneno"
                            {...register("phoneno")}
                            type="text"
                            placeholder="phoneno"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.phoneno?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.phoneno.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Subscription</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">
                          Choose your Subscription or division from the list of
                          available options.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <Select {...register("Subscription")}>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select subscription"
                              className="text-gray-300 font-semibold"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Full month</SelectItem>
                            <SelectItem value="dark">half month</SelectItem>
                            <SelectItem value="system">trail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.Subscription?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.Subscription.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className=" border-2 border-gray-200 max-w-[100%] h-full mt-5 py-4 rounded-xl  px-3">
              <div className="flex justify-between items-center w-full col-span-4 ">
                <div className="flex flex-col w-64 justify-start">
                  <div className="flex gap-4 justify-start items-center">
                    {" "}
                    <h3 className="text-sm font-bold">Address</h3>
                    <Badge className="bg-[#EBEFF4] border-2 border-[#DBE2EC] text-[#64748B] text-xs rounded-md hover:opacity-70 hover:bg-transparent">
                      Required
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm">
                      Enter your address, Zip code and country.
                    </p>
                  </div>
                </div>
                <div className="flex w-[70%] justify-center items-center gap-4 flex-col">
                  <div className="w-full flex ">
                    <Input
                      id="address"
                      {...register("address")}
                      type="text"
                      placeholder="Enter your address"
                      className=" bg-transparent outline-none"
                    />
                    {errors.address?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-[100%] flex justify-between items-center">
                    <div className="w-[50%]">
                      <Input
                        id="county"
                        {...register("zip")}
                        type="text"
                        placeholder="Enter your Zip code"
                        className=" bg-transparent outline-none"
                      />
                      {errors.zip?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.zip.message}
                        </p>
                      )}
                    </div>
                    <div className="w-[45%]">
                      <Input
                        id="country"
                        {...register("country")}
                        type="text"
                        placeholder="Enter your country"
                        className=" bg-transparent outline-none"
                      />
                      {errors.country?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className=" border-2 border-gray-200 max-w-[100%]  mt-5 py-4 rounded-xl  px-3">
              <div className="flex justify-center items-center flex-col gap-2 ">
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">Bank Account No</h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">Enter 12 Digit Number</p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <input
                            id="bankaccount"
                            {...register("bankaccount")}
                            type="text"
                            placeholder="XXXX-XXXXXXXX"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.bankaccount?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.bankaccount.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">
                          BIC / Swift Code
                        </h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">Enter 12 Digit Number</p>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <input
                            id="swiftcode"
                            {...register("swiftcode")}
                            type="text"
                            placeholder="XXXX-XXXXXXXX"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.swiftcode?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.swiftcode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">
                          Card Holder Name
                        </h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <input
                            id="cardholdername"
                            {...register("cardholdername")}
                            type="text"
                            placeholder="Enter name"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.cardholdername?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.cardholdername.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full px-5 mt-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex flex-col w-[17.5rem] justify-start">
                      <div className="flex gap-4 justify-start items-center">
                        {" "}
                        <h3 className=" font-bold text-sm ">
                          Card Holder Name
                        </h3>
                        <Badge className="bg-[#EBEFF4] text-xs border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                          Required
                        </Badge>
                      </div>
                    </div>
                    <div className="flex w-[70%] justify-center items-center gap-2">
                      <div
                        className={
                          "w-full m-3 justify-center items-center text-left font-normal h-11 rounded-lg bg-background"
                        }
                      >
                        <div className="flex items-center w-full gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-gray-500">
                          <input
                            id="bankname"
                            {...register("bankname")}
                            type="text"
                            placeholder="Enter Bank Name"
                            className="w-full text-sm border-none outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {errors.bankname?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.bankname.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Navigation */}
        <div className="mt-1 pt-1">
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Button>
            <Button
              type="button"
              onClick={next}
              disabled={currentStep === steps.length - 1}
              className="rounded  px-2 py-1 text-sm font-semibold text-black bg-[#D0FD3E]  w-28 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
