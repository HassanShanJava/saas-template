import { RootState } from "@/app/store";
import { CountryTypes, Workout } from "@/app/types";
import { AutosizeTextarea } from "@/components/ui/autosizetextarea/autosizetextarea";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multiselect/multiselect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { visibleFor } from "@/lib/constants/workout";
import { cn } from "@/lib/utils";
import { useGetCountriesQuery, useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";

const WorkoutStep1: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: countries } = useGetCountriesQuery();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: transformedData } = useGetMembersListQuery(orgId);
	const {control, formState: {errors}, register} = useFormContext<Workout>();
	return (
		<div className="mt-4 space-y-4">
			<p className="text-black/80 text-[1.37em] font-bold">
				{" "}
				Plan information and Details
			</p>
			<div className="grid grid-cols-3 grid-rows-4 grid-flow-col gap-4">
				{/* <!-- Column 1: Name and Description --> \*/}
					<div className="h-min">
						<FloatingLabelInput
							id="name"
							label="Name*"
							error={errors.name?.message}
							{...register("name", {required: "Required"})}
						/>
					</div>
					<div className="row-span-2">
						<FloatingLabelInput
							id="description"
							label="Description"
							type="textarea"
							rows={4}
							customPercentage={[14,12]}
							className="col-span-2"
							{...register("description")}
							error={errors.description?.message}
						/>
						{/*<AutosizeTextarea
							placeholder="description"
							id="description"
							minHeight={94}
							maxHeight={600}
							className="h-full"
						/>*/}
					</div>
					<div className="h-min">
						<MultiSelector
							onValuesChange={(values) => values}
							values={[]}
							className="space-y-0"
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
					</div>
				{/* <!-- Column 2: Visibility and Repetition --> */}
					<div className="h-min">
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
													{/*
															form.setValue(
																"country_id",
																country.id // Set country_id to country.id as number
															);
															*/}
										<CommandGroup>
											{countries &&
												countries.map((country: CountryTypes) => (
													<CommandItem
														value={country.country}
														key={country.id}
														onSelect={() => {return}}
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
					</div>
					<div className="h-min">
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
										{/*
															form.setValue(
																"country_id",
																country.id // Set country_id to country.id as number
															);
															*/}
										<CommandGroup>
											{countries &&
												countries.map((country: CountryTypes) => (
													<CommandItem
														value={country.country}
														key={country.id}
														onSelect={() => {return}}
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
					</div>
					{/*<div className="h-min">
						<Controller
							name="visiblefor"
							rules={{ required: "Required" }}
							control={control}
							render={({
								field: {onChange, value, onBlur},
								fieldState: { invalid, error }
							}) => {
								<Select 
									onValueChange={(value) => onChange(value)}
									defaultValue={value}
									>
									<SelectTrigger>
									</SelectTrigger>
								
							}}
						<Popover>
							<PopoverTrigger asChild>
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
										: *\/}
									Visible for*
									<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0">
								<Command>
									<CommandList>
										<CommandInput placeholder="Goals*" />
										<CommandEmpty>No country found.</CommandEmpty>
										{/*
															form.setValue(
																"country_id",
																country.id // Set country_id to country.id as number
															);
															*\/}
										<CommandGroup>
											{visibleFor &&
												visibleFor.map((st: any, idx: number) => (
													<CommandItem
														value={st.value}
														key={idx}
														onSelect={() => {return}}
													>
													{/*
																*\/}
														<Check
															className={cn(
																"mr-2 h-4 w-4 rounded-full border-2 border-green-500",
																st.value === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{st.label}{" "}
														{/* Display the country name *\/}
													</CommandItem>
												))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>*/}
					{/*<Controller
							name={item.name as keyof CreateFoodTypes}
							rules={{ required: "Required" }}
							control={control}
							render={({
								field: { onChange, value, onBlur },
								fieldState: { invalid, error },
							}) => (
								<div>
									<Select
										onValueChange={(value) => {
											onChange(value);
										}}
										defaultValue={value as string | undefined}
									>
										<SelectTrigger
											floatingLabel={item.label}
											name={item.name}
										>
											<SelectValue
												placeholder={"Select " + item.label}
											/>
										</SelectTrigger>

										<SelectContent>
											{item.options?.map((st: any, index: number) => (
												<SelectItem
													key={index}
													value={String(st.value)}
												>
													{st.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}
						/>
						{errors[item.name as keyof CreateFoodTypes]?.message && (
							<span className="text-red-500 text-xs mt-[5px]">
								{errors[item.name as keyof CreateFoodTypes]?.message}
							</span>
						)}*/}
					<div className="h-min">
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
										{/*
															form.setValue(
																"country_id",
																country.id // Set country_id to country.id as number
															);
															*/}
										<CommandGroup>
											{countries &&
												countries.map((country: CountryTypes) => (
													<CommandItem
														value={country.country}
														key={country.id}
														onSelect={() => {return}} >
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
					</div>
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
				<div className="row-span-4 h-min">
					<div>
						<div className="justify-center items-center flex flex-col">
							<div className="flex flex-col items-center justify-center p-4 border rounded h-32 w-32">
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
								onChange={() => {return}}
								className="hidden"
								ref={fileInputRef}
							/>
							<Button
								variant="ghost"
								className="px-2 mt-2 gap-1 border-dashed border-2 font-normal text-xs hover:bg-green-100"
								onClick={() => {return}}
							>
								<FiUpload className="text-primary w-5 h-5" /> Upload
								Picture
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default WorkoutStep1;
