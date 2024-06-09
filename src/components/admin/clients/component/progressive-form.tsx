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
import { Calendar as CalendarIcon } from "lucide-react";

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
    fields: ["firstName", "lastName", "email"],
  },
  {
    id: "2",
    name: "Address Setup",
    fields: ["country", "state", "city", "street", "zip"],
  },
  { id: "3", name: "Bank Details" },
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
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const [date, setDate] = React.useState<Date>();
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

  return (
    <section className="absolute inset-0 flex flex-col justify-between p-6 ">
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
                  <div className="flex w-8 h-8 rounded-full bg-orange-600 justify-center items-center">
                    <span className="text-sm font-medium text-white">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-52 bg-gray-300"></div>
                  )}
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex justify-start items-center gap-2"
                  aria-current="step"
                >
                  <div className="flex w-8 h-8 rounded-full bg-orange-600 justify-center items-center">
                    <span className="text-sm font-medium text-white ">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-52 bg-gray-300"></div>
                  )}
                </div>
              ) : (
                <div className="flex justify-start items-center gap-2 transition-colors ">
                  <div className="flex w-8 h-8 rounded-full bg-white border-2 border-gray-200 justify-center items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {step.id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 text-nowrap">
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="h-[2px] w-52 bg-gray-300"></div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form
        className="mt-4 py-4 border-2 border-gray-200 rounded-xl max-w-[100%] h-full"
        onSubmit={handleSubmit(processForm)}
      >
        {currentStep === 0 && (
          <motion.div
          // initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
          // animate={{ x: 0, opacity: 1 }}
          // transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex justify-center items-center flex-col ">
              <div className="w-full px-5">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-64 justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" text-sm font-bold">Full Name</h3>
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
                  <div className="flex w-[70%] justify-center items-center gap-2">
                    <div className="w-[45%]">
                      <Input
                        id="text"
                        type="text"
                        placeholder="Enter First Name"
                        className=" bg-transparent outline-none"
                      />
                    </div>
                    <div className="w-[45%]">
                      <Input
                        id="text"
                        type="text"
                        placeholder="Enter Second Name"
                        className="bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full px-5 mt-3">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-[17.5rem] justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" font-bold text-sm ">Date Of Birth</h3>
                      <Badge className="bg-[#EBEFF4] text-sm border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="w-full px-5 mt-3">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-[17.5rem] justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" text-sm font-bold">Gender</h3>
                      <Badge className="bg-[#EBEFF4] border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
                        Required
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm">
                        Select your gender from the options.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-[70%] justify-start items-center gap-2 border-2 border-gray-300 rounded-lg h-10 ">
                    <RadioGroup defaultValue="Male" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="r1" />
                        <Label htmlFor="r1">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="r2" />
                        <Label htmlFor="r2">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Prefer not to say" id="r3" />
                        <Label htmlFor="r3">Prefer not to say</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <div className="w-full px-5 mt-3">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-[17.5rem] justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" font-bold text-sm ">Email</h3>
                      <Badge className="bg-[#EBEFF4] text-sm border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="w-full px-5 mt-3">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-[17.5rem] justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" font-bold text-sm ">Phone No</h3>
                      <Badge className="bg-[#EBEFF4] text-sm border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="w-full px-5 mt-3">
                <div className="flex justify-between items-center w-full ">
                  <div className="flex flex-col w-[17.5rem] justify-start">
                    <div className="flex gap-4 justify-start items-center">
                      {" "}
                      <h3 className=" font-bold text-sm ">Email</h3>
                      <Badge className="bg-[#EBEFF4] text-sm border-2 border-[#DBE2EC] text-[#64748B] rounded-md hover:opacity-70 hover:bg-transparent">
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            {/* <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Provide your personal details.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.firstName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName")}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.lastName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div> */}
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
          // initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
          // animate={{ x: 0, opacity: 1 }}
          // transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Address
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2">
                  <select
                    id="country"
                    {...register("country")}
                    autoComplete="country-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                  {errors.country?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="street"
                    {...register("street")}
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.street?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.street.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="city"
                    {...register("city")}
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.city?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="state"
                    {...register("state")}
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.state?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="zip"
                    {...register("zip")}
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.zip?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Complete
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Thank you for your submission.
            </p>
          </>
        )}
      </form>

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
            {/* <svg
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg> */}
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
