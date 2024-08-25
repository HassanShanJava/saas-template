import { RootState } from "@/app/store";
import { CountryTypes, ErrorType, Workout } from "@/app/types";
import { AutosizeTextarea } from "@/components/ui/autosizetextarea/autosizetextarea";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multiselect/multiselect";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { visibleFor, workoutGoals, workoutLevels } from "@/lib/constants/workout";
import { cn } from "@/lib/utils";
import { useGetCountriesQuery, useGetMembersListQuery } from "@/services/memberAPi";
import { Check, ChevronDownIcon, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { ContextProps } from "./workout-form";

const WorkoutStep1: React.FC = () => {
	const {form} = useOutletContext<ContextProps>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: countries } = useGetCountriesQuery();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: memberList } = useGetMembersListQuery(orgId);


	const {control, formState: {errors}, register} = form;
	const {trigger} = form;
	return (
			<FormProvider {...form}>
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
									<Controller
										name="member_ids"
										control={control}
										render={({
											field: {onChange, value, onBlur},
											fieldState: {invalid, error}
										}) => (
											<MultiSelect
												floatingLabel="Assign Members*"
												key="Assign Members*"
												options={memberList||[]}
												defaultValue={value||[]} // Ensure defaultValue is always an array
												onValueChange={(selectedValues) => onChange(selectedValues)}
												placeholder="Assign Members*"
												variant="inverted"
												maxCount={1}
												className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
											/>
										)}
									/>
								</div>
							{/* <!-- Column 2: Visibility and Repetition --> */}
								<div className="h-min">
									<Controller
										name="goal"
										rules={{required: "Required"}}
										control={control}
										render={({
											field: {onChange, value, onBlur},
											fieldState: {invalid, error} 
										}) => (
											<Select
												onValueChange={(value) => onChange(value)}
												defaultValue={value}
											>
												<SelectTrigger
													floatingLabel="Goal"
													name="goals"
													>
													<SelectValue
														placeholder="Select Goal"
													/>
												</SelectTrigger>
												<SelectContent>
												{workoutGoals.map((st: any, index: number) =>
													<SelectItem
														key={index}
														value={st.value}
														>
														{st.label}
													</SelectItem>
												)}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.goal?.message && <span className="text-red-500 text-xs mt-[5px]">{errors.goal?.message}</span>}
								</div>
								<div className="h-min">
									<Controller
										name="level"
										rules={{required: "Required"}}
										control={control}
										render={({
											field: {onChange, value, onBlur},
											fieldState: {invalid, error}
										}) => (
											<Select
												onValueChange={(value) => onChange(value)}
												defaultValue={value}
											>
												<SelectTrigger
													floatingLabel="Level"
													name="level"
													>
													<SelectValue
														placeholder="Select Level"/>
												</SelectTrigger>
												<SelectContent>
													{workoutLevels.map((st: any, index: number) => (
														<SelectItem
															key={index}
															value={st.value}>
															{st.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.level?.message && 
									<span className="text-red-500 text-xs mt-[5px]">{errors.level?.message}</span>}
								</div>
								<div className="h-min">
									<Controller
										name="visiblefor"
										rules={{ required: "Required" }}
										control={control}
										render={({
											field: {onChange, value, onBlur},
											fieldState: { invalid, error }
										}) => (
											<Select
												onValueChange={(value) => onChange(value)}
												defaultValue={value}
												>
												<SelectTrigger
													floatingLabel="Visible For"
													name="visiblefor"
												>
													<SelectValue
														placeholder="Select Visible For"
													/>
												</SelectTrigger>
												<SelectContent>
													{visibleFor.map((st: any, index: number) => (
														<SelectItem
															key={index}
															value={st.value}
														>
															{st.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.visiblefor?.message &&
									<span className="text-red-500 text-xs mt-[5px]">{errors.visiblefor?.message}</span>
									}
								</div>
								<div className="h-min">
									<Controller
										name="weeks"
										rules={{required: "Required"}}
										control={control}
										render={({
											field: {onChange, value, onBlur},
											fieldState: {invalid, error}
										}) => (
											<Select
												onValueChange={(value) => onChange(Number(value))}
												defaultValue={(value?String(value):value) as string | undefined}
												>
												<SelectTrigger
													floatingLabel="Weeks"
													name="weeks"
												>
													<SelectValue placeholder="Weeks" />
												</SelectTrigger>
												<SelectContent>
												{Array
													.from({length: 20}, (_, i) => ({label: String(i+1), value: String(i+1)}))
													.map((st: any, index: number) => (
														<SelectItem
															key={index}
															value={st.value}
														>
															{st.label}
														</SelectItem>
												))}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.weeks?.message && <span className="text-red-500 text-xs mt-[5px]">{errors.weeks?.message}</span>}
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
		</FormProvider>
	);
}
export default WorkoutStep1;
