import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselect/multiselect";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRef } from "react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
interface WorkOutPlanForm {
  isOpen: boolean;
  setOpen: any;
}

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
import { FiUpload } from "react-icons/fi";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { CountryTypes, ErrorType } from "@/app/types";
import { AutosizeTextarea } from "@/components/ui/autosizetextarea/autosizetextarea";
import { membersSchema } from "@/schema/formSchema";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetCountriesQuery, useGetMembersListQuery } from "@/services/memberAPi";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import StepperIndicator from "@/components/ui/stepper-indicator";
//{ isOpen, setOpen }: WorkOutPlanForm
const WorkoutPlanForm = () => {
  const navigate = useNavigate();
	const LAST_STEP = 2;
	const [activeStep, setActiveStep] = useState<number>(1);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: transformedData } = useGetMembersListQuery(orgId);

  //const FormSchema = z.object({
  //  name: z
  //    .string({
  //      required_error: "Required",
  //    })
  //    .min(3, {
  //      message: "Required",
  //    }),
  //  description: z.string({}).optional(),
  //  members_id: z.array(membersSchema).nonempty({
  //    message: "Required",
  //  }),
  //  country_id: z.coerce
  //    .number({
  //      required_error: "Required",
  //    })
  //    .refine((value) => value !== 0, {
  //      message: "Required",
  //    }),
  //});
  const { data: countries } = useGetCountriesQuery();

  const form = useForm({
    defaultValues: {},
    mode: "all",
  });

	const {handleSubmit} = form;
  const [workoutPlan, setworkoutPlan] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
  };

  //const watcher = form.watch();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
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
  }

  const handleClose = () => {
    navigate("/admin/workoutplans");
  };
  return (
    <Sheet open={true}>
      <SheetContent className="!max-w-[1200px]" hideCloseButton>
				<FormProvider {...form}>
					<form noValidate onSubmit={handleSubmit(onSubmit)}>
						<SheetHeader>
							<SheetTitle>
								<div className="flex justify-between gap-5 items-start ">
									<div>
										<p className="font-semibold">Workout Plans</p>
									</div>
									<div className="flex justify-center space-x-[20px]">
										<Button
											type="button"
											className="w-[100px] text-center flex items-center gap-2 border-primary"
											variant={"outline"}
											onClick={handleClose}
										>
											<i className="fa fa-xmark "></i>
											Cancel
										</Button>

										{activeStep !== 1 &&
										<Button
											className="w-[100px] px-2 text-center flex items-center gap-2 border-primary"
											type="button"
											variant={"outline"}
											onClick={() => setActiveStep(active => active-1)}
										>
											<i className="fa fa-arrow-left-long "></i>
											Previous
										</Button>}

										{activeStep === LAST_STEP ? (
										<LoadingButton
											type="submit"
											className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
											// onClick={handleSubmit(onSubmit)}
											// loading={isSubmitting}
											// disabled={isSubmitting}
										>
											{/* {!isSubmitting && ( */}
											<i className="fa-regular fa-floppy-disk text-base px-1 "></i>
											{/* )} */}
											Save
										</LoadingButton>) : (
										<Button
											type="button"
											className="w-[100px] bg-primary text-black text-center flex items-center gap-2"
											onClick={() => setActiveStep(active => active+1)}
										>
											<i className="fa fa-arrow-right-long "></i>
											Next
										</Button>)}
									</div>
								</div>
							</SheetTitle>
						</SheetHeader>
						<Separator className="h-[1px] rounded-full my-2" />
						<div className="flex justify-center mt-10">
							<div className="w-1/2 flex justify-center">
								<StepperIndicator
									activeStep={activeStep}
									labels={[{key: 1, label: "Plan Information & Details"},{key: 2, label: "Training & Exercise Details"}]}
									lastKey={LAST_STEP}
								/>
							</div>
						</div>
						{/*<Form {...form}>*/}
							<div>
								<p className="text-black text-2xl font-bold">
									{" "}
									Plan information and Details
								</p>
								<div className="grid grid-cols-3 grid-rows-4 grid-flow-col p-4">
									{/* <!-- Column 1: Name and Description --> \*/}
									{/*<div className="p-4">*/}
										<div className="">
											<div className="relative">
												{/*<FormField
													control={form.control}
													name="name"
													render={({ field }) => (
														<FormItem>*/}
															<FloatingLabelInput
																id="name"
																label="Name*"
															/>
															{/*watcher.name ? <></> : <FormMessage />*/}
														{/*</FormItem>
													)}
												/>*/}
											</div>
										</div>
										<div className="row-span-2">
											{/*<FormField
												control={form.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormControl>*/}
															<AutosizeTextarea
																placeholder="description"
																id="description"
																maxHeight={600}
															/>
														{/*</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>*/}
										</div>
										<div>
											{/*<FormField
												control={form.control}
												name="members_id"
												render={({ field }) => (
													<FormItem className="w-full ">*/}
														<MultiSelector
															onValuesChange={(values) => values}
															values={[]}
														>
															<MultiSelectorTrigger className="border-[1px] border-gray-300">
																<MultiSelectorInput
																	className="font-medium"
																	placeholder="Assign Members*"
																/>
																<ChevronDownIcon className="h-5 w-5 text-gray-500" />
															</MultiSelectorTrigger>
															<MultiSelectorContent className="">
																<MultiSelectorList>
																	{transformedData &&
																		transformedData.map((user: any) => (
																			<MultiSelectorItem
																				key={user.id}
																				value={user}
																				// disabled={field.value?.length >= 5}
																			>
																				<div className="flex items-center space-x-2">
																					<span>{user.name}</span>
																				</div>
																			</MultiSelectorItem>
																		))}
																</MultiSelectorList>
															</MultiSelectorContent>
														</MultiSelector>
														{/*<FormMessage />
													</FormItem>
												)}
											/>*/}
										</div>
									{/*</div>*/}

									{/* <!-- Column 2: Visibility and Repetition --> */}
									{/*<div className="p-4 flex flex-col gap-6">*/}
										<div className="">
										{/*<FormField
												control={form.control}
												name="country_id"
												render={({ field }) => (
													<FormItem className="flex flex-col w-full">*/}
																			{/*!field.value &&
																				" "*/}
														<Popover>
															<PopoverTrigger asChild>
																{/*<FormControl>*/}
																	<Button
																		variant="outline"
																		role="combobox"
																		className={"justify-between font-normal font-medium text-gray-400 focus:border-primary w-full"}
																	>
																		Select Goals*
																		<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																	</Button>
																{/*</FormControl>*/}
															</PopoverTrigger>
															<PopoverContent className="p-0">
																<Command>
																	<CommandList>
																		<CommandInput placeholder="Goals*" />
																		<CommandEmpty>No country found.</CommandEmpty>
																		<CommandGroup>
																			{countries &&
																				countries.map((country: CountryTypes) => (
																					<CommandItem
																						value={country.country}
																						key={country.id}
																						onSelect={() => {
																							form.setValue(
																								"country_id",
																								country.id // Set country_id to country.id as number
																							);
																						}}
																					>
																					{/*
																								country.id === field.value
																									? "opacity-100"
																									: "opacity-0"*/}
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4 rounded-full border-2 border-green-500",
																							)}
																						/>
																						{country.country}{" "}
																						{/* Display the country name */}
																					</CommandItem>
																				))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
														{/*watcher.country_id ? <></> : <FormMessage />}
													</FormItem>
												)}
											/>*/}
										</div>
										<div className="">
										{/*<FormField
												control={form.control}
												name="country_id"
												render={({ field }) => (
													<FormItem className="flex flex-col w-full">*/}
															{/*!field.value &&
																				"font-medium text-gray-400 focus:border-primary "*/}
														<Popover>
															<PopoverTrigger asChild>
																{/*<FormControl>*/}
																	<Button
																		variant="outline"
																		role="combobox"
																		className="justify-between font-normal font-medium text-gray-400 focus:border-primary w-full"
																	>
																		Select Levels*
																		<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																	</Button>
																{/*</FormControl>*/}
															</PopoverTrigger>
															<PopoverContent className="p-0">
																<Command>
																	<CommandList>
																		<CommandInput placeholder="Goals*" />
																		<CommandEmpty>No country found.</CommandEmpty>
																		<CommandGroup>
																			{countries &&
																				countries.map((country: CountryTypes) => (
																					<CommandItem
																						value={country.country}
																						key={country.id}
																						onSelect={() => {
																							form.setValue(
																								"country_id",
																								country.id // Set country_id to country.id as number
																							);
																						}}
																					>
																						{/*
																								country.id === field.value
																									? "opacity-100"
																									: "opacity-0"*/}
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4 rounded-full border-2 border-green-500",
																							)}
																						/>
																						{country.country}{" "}
																						{/* Display the country name */}
																					</CommandItem>
																				))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
														{/*watcher.country_id ? <></> : <FormMessage />}
													</FormItem>
												)}
											/>*/}
										</div>
										<div className="">
										{/*<FormField
												control={form.control}
												name="country_id"
												render={({ field }) => (
													<FormItem className="flex flex-col w-full">*/}
														{/*
																			!field.value &&
																				"font-medium text-gray-400 focus:border-primary "
																				*/}
														<Popover>
															<PopoverTrigger asChild>
																{/*<FormControl>*/}
																	<Button
																		variant="outline"
																		role="combobox"
																		className="justify-between font-normal font-medium text-gray-400 focus:border-primary w-full"
																	>
																	{/*field.value
																			? countries?.find(
																					(country: CountryTypes) =>
																						country.id === field.value // Compare with numeric value
																				)?.country // Display country name if selected
																			: */}
																		Visible for*
																		<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																	</Button>
																{/*</FormControl>*/}
															</PopoverTrigger>
															<PopoverContent className="p-0">
																<Command>
																	<CommandList>
																		<CommandInput placeholder="Goals*" />
																		<CommandEmpty>No country found.</CommandEmpty>
																		<CommandGroup>
																			{countries &&
																				countries.map((country: CountryTypes) => (
																					<CommandItem
																						value={country.country}
																						key={country.id}
																						onSelect={() => {
																							form.setValue(
																								"country_id",
																								country.id // Set country_id to country.id as number
																							);
																						}}
																					>
																					{/*
																								country.id === field.value
																									? "opacity-100"
																									: "opacity-0"*/}
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4 rounded-full border-2 border-green-500",
																							)}
																						/>
																						{country.country}{" "}
																						{/* Display the country name */}
																					</CommandItem>
																				))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
														{/*watcher.country_id ? <></> : <FormMessage />}
													</FormItem>
												)}
											/>*/}
										</div>
										<div className="">
										{/*<FormField
												control={form.control}
												name="country_id"
												render={({ field }) => (
													<FormItem className="flex flex-col w-full">*/}
														<Popover>
															<PopoverTrigger asChild>
																{/*<FormControl>*/}
																	{/*
																			!field.value &&
																				"font-medium text-gray-400 focus:border-primary "
																				*/}
																	<Button
																		variant="outline"
																		role="combobox"
																		className="justify-between font-normal font-medium text-gray-400 focus:border-primary w-full"
																	>
																		{/*field.value
																			? countries?.find(
																					(country: CountryTypes) =>
																						country.id === field.value // Compare with numeric value
																				)?.country // Display country name if selected
																			:*/ "Week (x) *"}
																		<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																	</Button>
																{/*</FormControl>*/}
															</PopoverTrigger>
															<PopoverContent className="p-0">
																<Command>
																	<CommandList>
																		<CommandInput placeholder="Goals*" />
																		<CommandEmpty>No country found.</CommandEmpty>
																		<CommandGroup>
																			{countries &&
																				countries.map((country: CountryTypes) => (
																					<CommandItem
																						value={country.country}
																						key={country.id}
																						onSelect={() => {
																							form.setValue(
																								"country_id",
																								country.id // Set country_id to country.id as number
																							);
																						}}
																					>
																						{/*
																								country.id === field.value
																									? "opacity-100"
																									: "opacity-0"
																									*/}
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4 rounded-full border-2 border-green-500",
																							)}
																						/>
																						{country.country}{" "}
																						{/* Display the country name */}
																					</CommandItem>
																				))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
														{/*watcher.country_id ? <></> : <FormMessage />}
													</FormItem>
												)}
											/>*/}
										</div>
									
									{/*</div>*/}

									{/* <!-- Column 3: Image Upload --> */}

									{/*<div className="p-4">
										<div className="mb-4">
											<div className="justify-center items-center flex flex-col">
												<div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
													{selectedImage ? (
														<img
															src={URL.createObjectURL(selectedImage)}
															alt="Selected"
															className="h-full w-full object-cover"
														/>
													) : (
														<ImageIcon className="w-12 h-12 text-gray-400" />
													)}
												</div>
												<input
													type="file"
													accept="image/*"
													onChange={handleImageChange}
													className="hidden"
													id="image-upload"
												/>
												<label htmlFor="image-upload">
													<Button
														variant="ghost"
														className="mt-2 gap-2 border-dashed border-2 text-xs"
													>
														<FiUpload className="text-primary w-5 h-5" /> Image
													</Button>
												</label>
											</div>
										</div>
									</div>*/}
									<div className="p-4 row-span-4">
										<div className="mb-4">
											<div className="justify-center items-center flex flex-col">
												<div className="flex flex-col items-center justify-center p-4 border rounded h-52 w-52">
													{selectedImage ? (
														<img
															src={URL.createObjectURL(selectedImage)}
															alt="Selected"
															className="h-full w-full object-cover"
														/>
													) : (
														<ImageIcon className="w-12 h-12 text-gray-400" />
													)}
												</div>
												<input
													type="file"
													accept="image/*"
													onChange={handleImageChange}
													className="hidden"
													ref={fileInputRef}
												/>
												<Button
													variant="ghost"
													className="mt-2 gap-2 border-dashed border-2 text-xs hover:bg-green-100"
													onClick={handleButtonClick}
												>
													<FiUpload className="text-primary w-5 h-5" /> Upload
													Picture
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/*</Form>*/}
					</form>
				</FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default WorkoutPlanForm;
