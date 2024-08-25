import { IntensityEnum, Workout, WorkoutIntensityEnum, createExerciseInputTypes, difficultyEnum } from "@/app/types";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { createdByOptions, difficultyOptions, useGetAllWorkoutDayQuery, workout_day_data, workout_day_exercise_data } from "@/lib/constants/workout";
import React, { useEffect, useState } from "react";
import WorkoutDayComponent, { WorkoutDay, WorkoutDayOptional } from "../components/WorkoutDayComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetAllCategoryQuery, useGetAllEquipmentsQuery, useGetAllExercisesQuery, useGetAllJointsQuery, useGetAllMetQuery, useGetAllMuscleQuery } from "@/services/exerciseApi";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExerciseItem, exerciseTypeOptions } from "@/constants/exercise";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { current } from "@reduxjs/toolkit";
import WorkoutDayExerciseComponent, { Exercise } from "../components/WorkoutDayExerciseComponent";
import { Label } from "@/components/ui/label";
import expandTop from "@/assets/expand-top.svg";
import filterRemove from "@/assets/filter-remove.svg";
import { useOutletContext } from "react-router-dom";
import { ContextProps } from "./workout-form";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner/spinner";

export interface WorkoutWeek {
	week: number;
	days: WorkoutDay[];
}

export interface ExerciseForm {
	exercise_type: string;
	seconds_per_set: number[];
	rest_between_set: number[];
	repetitions_per_set: number[];
	speed: number;
	distance: number;
	met_id: number;
	exercise_intensity: "Max" | "% of 1RM";
	intensity_value: number;
}

const WorkoutStep2: React.FC = () => {
	const {form: form1} = useOutletContext<ContextProps>();
	const noOfWeeks = form1.getValues("weeks");
	const [days, setDays] = useState(() => (
		[...Array(noOfWeeks*7).keys()].map((_, i) => ({
			week: Math.floor(i/7) + 1,
			day: i%7 + 1,
		}))
	))
	const [exercises, setExercises] = useState<Exercise[]>(workout_day_exercise_data as Exercise[]);
	const [exerciseFilterOpen, setExerciseFilterOpen] = useState<boolean>(true);
	const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>();
	const [currExercise, setCurrExercise] = useState<Exercise | null>(null);
	const { data: CategoryData } = useGetAllCategoryQuery();
	const { data: EquipmentData } = useGetAllEquipmentsQuery();
	const { data: MuscleData } = useGetAllMuscleQuery();
	const { data: JointsData } = useGetAllJointsQuery();
	const { data: MetsData } = useGetAllMetQuery();
	const [inputRef, setInputRef] = useState<HTMLDivElement | null>(null);
	const [showSearchResults, setShowSearchResults] = useState<boolean>(true);
  const { data: WorkoutDays } = useGetAllWorkoutDayQuery();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
	const [query, setQuery] = useState<string>("");
  const { data: Exercises, isLoading } = useGetAllExercisesQuery(
    {
      org_id: orgId,
      query: query,
    },
	);

  useEffect(() => {
    if (WorkoutDays) {
      console.log('eGetAllWorkoutDayQueryetsData:', WorkoutDays);
			WorkoutDays.map(dbDay => {
				const idx = (dbDay.week - 1)*7 + (dbDay.day - 1)
				setDays(days => days.map((day, i) => i == idx ? {...day, ...dbDay} : day));
			})
    }
  }, [WorkoutDays]);

const Exercise_info: ExerciseItem[] = [
	{
		type: "multiselect",
		name: "primary_muscle_ids",
		label: "Primary Muscle*",
		required: true,
		options: MuscleData,
	},
	{
		type: "select",
		name: "category",
		label: "Category",
		required: true,
		options: CategoryData,
	},
	{
		type: "select",
		name: "difficulty",
		label: "Difficulty",
		required: true,
		options: difficultyOptions,
	},
	{
		type: "select",
		name: "created_by",
		label: "Created By",
		required: true,
		options: createdByOptions,
	},
	{
		type: "multiselect",
		name: "equipment_ids",
		label: "Equipments*",
		required: true,
		options: EquipmentData,
	},
	{
		type: "multiselect",
		name: "primary_joint_ids",
		label: "Primary Joints*",
		required: true,
		options: JointsData,
	},
];
	
	const [uid, setUid] = useState<number>(1e4);
  const form = useForm<ExerciseForm>({
    defaultValues: currExercise,
    mode: "all",
  });
	const {register, control, formState: {errors, isDirty}, watch, handleSubmit} = form;
	const formValues = watch();

	function handleAddDay(idx: number, day_name: string) {
		console.log("onSave", day_name);
		setDays(days => days.map((day,i) => i === idx ? {...day, day_name: day_name, id: uid} : day))
		setUid(uid => uid + 1);
	}

	function handleDelete(idx: number) {
		setDays(days => days.map((day, i) => i === idx ? {week: Math.floor(i/7) + 1, day: i%7 + 1} : day));
	}

	function handleUpdate(idx: number, id: number, day_name: string) {
		setDays(days => days.map((day,i) => i === idx ? {...day, day_name: day_name} : day))
	}

	function handleExerciseDuplicate(id: number) {
		const exercise = exercises.find(e => e.id === id);
		if (exercise)
			setExercises(exercises => [...exercises, exercise]);
	}

	function handleExerciseAdd(exercise) {
			setExercises(exercises => [...exercises, exercise]);
	}

	function handleExerciseDelete(index: number, id: number) {
		setExercises(exercises => exercises.filter((_, i) => i !== index));
	}

	interface ExerciseFilter {
		primary_muscle_ids?: number[]
		category?: number;
		difficulty?: difficultyEnum;
		equipment_ids?: number[];
		primary_joint_ids?: number[];
	}
		
  const [filterData, setFilter] = useState<ExerciseFilter>({});

  function handleFilterChange(field: string, value: any) {
    setFilter((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

	useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filterData)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val); 
          });
        } else {
          params.append(key, value); 
        }
      }
    }
    const newQuery = params.toString();
    setQuery(newQuery); 
	}, [filterData])

	function onSubmit(data: any) {
		return
	}
	return (
		<div className="mt-4 space-y-4 mb-20">
			<p className="text-black/80 text-[1.37em] font-bold">
				{" "}
				Training & Exercise Details
			</p>
			<div className="w-full flex gap-5">
				<div className="w-[33.3%] h-[32rem] bg-[#EEE] rounded-xl space-y-2 custom-scrollbar">
					{showSearchResults ? 
					<div className="p-3">
						{[...Array(noOfWeeks).keys()].map((week: any, i: number) => (
							<Accordion type="single" defaultValue="item-1" collapsible>
							<AccordionItem value="item-1" className="!border-none">
								<AccordionTrigger className="h-0 !no-underline !bg-transparent">
										<span className="font-semibold">Week {i + 1}</span>
								</AccordionTrigger>
								<AccordionContent className="space-y-3">
									<span className="text-sm">Days</span>
									{[...Array(7).keys()].map((_, j: number) => (
										<WorkoutDayComponent
										key={i*7 + j}
										day={days[i*7 + j]}
										onSave={(day_name) => handleAddDay(i*7 + j, day_name)}
										onDelete={() => handleDelete(i*7 + j)}
										onUpdate={(id, day_name) => handleUpdate(i*7 + j, id, day_name)}
										/>
									))}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						))}
					</div>
					: <>
					<div className="sticky z-40 top-0 p-3 bg-[#EEE] space-y-2 custom-scrollbar">
						<div className="flex justify-between items-center">
							<span className="font-semibold">Search Exercise</span>
							<Button 
								onClick={() => setShowSearchResults(false)}
								variant="ghost" 
								className="h-auto p-0 hover:bg-transparent">
								<i className="fa-regular fa-x font-semibold text-sm"></i>
							</Button>
						</div>
						<div className="flex justify-between">
							<span className="text-sm">Filters</span>
							<Button 
								onClick={() => setExerciseFilterOpen(prev => !prev)}
								variant="ghost" 
								className="h-auto p-0 hover:bg-transparent">
								<img src={expandTop} className={cn("w-5 h-5 transition-transform duration-200", !exerciseFilterOpen && 'rotate-180')} alt="show/hide"/>
							</Button>
						</div>
							{exerciseFilterOpen && (
							<>
							<div className="grid grid-cols-3 gap-2">
							{Exercise_info.map((element) => {
							if (element.type == "select") {
								return (
									<Select
										key={element.label}
										name={element.label}
										value={(() => {
										return filterData[element.name as 'category']?String(filterData[element.name as 'category']):''
										})()}
										onValueChange={(value) => {
											handleFilterChange(element.name, value);
										}}
									>
										<SelectTrigger className="[&_span]:text-xs border border-black/25">
											<SelectValue placeholder={element.label.replace(/_/g, ' ') // Replace underscores with spaces
												.toLowerCase()     // Convert to lowercase
												.replace(/(?:^|\s)\S/g, (match:string) => match.toUpperCase())} />
										</SelectTrigger>
										<SelectContent>
											{element.options?.map((st: any, index: number) => (
												<SelectItem key={index} value={String(st.value)}>
													{st.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								);
							}

							if (element.type === "multiselect") {
								return (
									<MultiSelect
										key={element.label}
										options={element.options ?? []}
										defaultValue={(() => {
											return filterData[element.name as "primary_muscle_ids" | "primary_joint_ids" | "equipment_ids"] || []
										})()} 
										onValueChange={(selectedValues) => {
											console.log("Selected Values: ", selectedValues); 
											handleFilterChange(element.name, selectedValues); 
										}}
										placeholder={element.label.replace(/_/g, ' ')}
										variant="inverted"
										maxCount={1}
										className="border border-black/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&_span]:text-xs [&_span]:mx-0 [&_svg]:mx-0"
									/>
								);
							}
						})}
						</div>
						</>
						)}
						<div className="flex gap-2">
							<div className="flex-1">
								<FloatingLabelInput
									id="search"
									placeholder="Search by Exercise Name"
									onChange={(event) => setInputValue(event.target.value)}
									className="text-gray-400 bg-transparent border border-black/25"
								/> 
							</div>
							<Button 
								onClick={() => setFilter({})}
								variant="ghost" 
								className="h-auto p-0 hover:bg-transparent">
								<img src={filterRemove} className="w-5 h-5 transition-transform duration-200" alt="show/hide"/>
							</Button>
						</div>
					</div>
					<div className="px-3 pb-6 space-y-3">
					{isLoading ? <Spinner /> 
					: Exercises?.data.map(exercise => (
							<div 
							onClick={() => {handleExerciseAdd(exercise)}}
							className="border border-black/25 rounded-lg p-2 hover:border-primary cursor-pointer">
								<div className="flex justify-between items-center relative space-x-1 ">
									<div className="flex gap-1 w-full">
										<img
											id="avatar"
											src={exercise.thumbnail_male}
											alt="Exercise Image"
											className="h-[20px] w-12 object-contain relative"
										/>
										<span className="text-sm truncate">{exercise.exercise_name} - {exercise.equipments.map(e => e.name).join(", ")}</span>
									</div>
								</div>
							</div>
						))
					}
					{isLoading ? <Spinner /> 
					: Exercises?.data.map(exercise => (
							<div 
							onClick={() => {handleExerciseAdd(exercise)}}
							className="border border-black/25 rounded-lg p-2 hover:border-primary cursor-pointer">
								<div className="flex justify-between items-center relative space-x-1 ">
									<div className="flex gap-1 w-full">
										<img
											id="avatar"
											src={exercise.thumbnail_male}
											alt="Exercise Image"
											className="h-[20px] w-12 object-contain relative"
										/>
										<span className="text-sm truncate">{exercise.exercise_name} - {exercise.equipments.map(e => e.name).join(", ")}</span>
									</div>
								</div>
							</div>
						))
					}
					{isLoading ? <Spinner /> 
					: Exercises?.data.map(exercise => (
							<div 
							onClick={() => {handleExerciseAdd(exercise)}}
							className="border border-black/25 rounded-lg p-2 hover:border-primary cursor-pointer">
								<div className="flex justify-between items-center relative space-x-1 ">
									<div className="flex gap-1 w-full">
										<img
											id="avatar"
											src={exercise.thumbnail_male}
											alt="Exercise Image"
											className="h-[20px] w-12 object-contain relative"
										/>
										<span className="text-sm truncate">{exercise.exercise_name} - {exercise.equipments.map(e => e.name).join(", ")}</span>
									</div>
								</div>
							</div>
						))
					}
					</div>
					</>}
				</div>
				<div className="w-[33.3%] h-[32rem] bg-[#EEE] rounded-xl p-3 relative custom-scrollbar">
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="font-semibold">Exercise</span>
							<Button 
								onClick={() => setShowSearchResults(true)}
								className="font-normal h-auto p-0 hover:bg-transparent" variant="ghost"
							>
								<i className="fa fa-plus "></i>
								Add Exercise 
							</Button>
						</div>
						<div className="space-y-2">
							{exercises.map((exercise, i)=> (
								<WorkoutDayExerciseComponent
									key={i}
									exercise={exercise}
									selected={i===selectedExerciseIndex}
									onDuplicate={handleExerciseDuplicate}
									onDelete={(id) => handleExerciseDelete(i, id)}
									onClick={() => {
										if (isDirty) {
											toast({
												variant: "destructive",
												title: "Exercise not saved",
												description: "You have changed the exercise, save before switching to the next exercise",
											});
											console.log("form.formState.dirtyFields" , form.formState.dirtyFields)
										} else {
											setCurrExercise(exercise);
											form.reset(exercise);
											setSelectedExerciseIndex(i)
										}
									}}
								/>
							))}
						</div> 
					</div>
				</div>
				<div className="w-[33.3%] h-[32rem] bg-[#EEE] rounded-xl p-3 space-y-2 custom-scrollbar flex flex-col">
					<div className="flex justify-between">
						<span className="font-semibold">Exercise Details</span>
						{isDirty &&
						<Button
							onClick={()=> {setEdit(false);setIsFocused(false);return day.id ? onUpdate(day.id,name) : onSave(name)}}
							className="h-auto p-0" variant="ghost"
							>
							<i className="fa-regular fa-floppy-disk h-4 w-4"></i>
						</Button>}
					</div>
					{currExercise !== null ? 
					<FormProvider {...form}>
						<form
							noValidate
							className="pb-4 space-y-3"
							onSubmit={handleSubmit(onSubmit)}
							action="#"
						>
						<div className="flex justify-center">
								<img
									id="avatar"
									src={formValues.thumbnail_male}
									alt="Exercise Image"
									className="w-4/5 object-contain relative"
								/>
						</div>
						<div className="relative">
							<Controller
								name="exercise_type"
								rules={{ required: "Required" }}
								control={control}
								render={({
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<div className="flex justify-center">
										<RadioGroup
											onValueChange={(e) => {
												console.log("exercise_type c", e);
												onChange(e);
												setTimeout(() => console.log(form.getValues(), formValues), 1000);
											}}
											defaultValue={
												(() => {console.log("exercise_type v", value != null ? String(value) : undefined);return value != null ? String(value) : undefined})()
											}
											value={
												(() => {console.log("exercise_type v", value != null ? String(value) : undefined);return value != null ? String(value) : undefined})()
											}
											className="flex flex-row space-x-4"
										>
											{exerciseTypeOptions?.map((option: any, index: number) => (
													<div
														key={index}
														className="flex justify-start items-center space-x-3"
													>
														<RadioGroupItem
															id={option.value}
															value={String(option.value)}
														/>
														<Label htmlFor={option.value}>{option.label}</Label>
													</div>
												)
											)}
										</RadioGroup>
									</div>
								)}
							/>
							{errors["exercise_type"]?.message && (
								<span className="text-red-500 text-xs mt-[5px]">
									{
										errors["exercise_type"]?.message
									}
								</span>
							)}
						</div>
						<div className="gap-2 grid grid-cols-[repeat(20,1fr)] flex items-center">
							<span className="col-span-9">Rep({formValues.exercise_type === "Time Based" ? 's' : 'x'})</span>	
							<span className="col-span-9">Rest(s)</span>	
						</div>
						<div className="gap-2 grid grid-cols-[repeat(20,1fr)] items-center">
							{[...Array(
									Math.max(
										formValues.repetitions_per_set.length,
										formValues.seconds_per_set.length,
										formValues.rest_between_set.length
									))
								.keys()].map((_, i) => {
								console.log("Map ran again")
								return (
								<React.Fragment key={i}>
									{formValues.exercise_type === "Time Based" ?
										<div className="col-span-9">
											<FloatingLabelInput
												type="number"
												value={formValues.seconds_per_set[i]?formValues.seconds_per_set[i]:''}
												{...register(`seconds_per_set.${i}`, {required: "Required", valueAsNumber: true})}
												className={cn("bg-transparent border border-black/25",errors?.rest_between_set?.[i]
														? "border-red-500"
														: "")}
												min="0"
											/>
											{errors?.seconds_per_set?.[i] && (
												<span className="text-red-500 mr-4">
													{errors?.seconds_per_set?.[i].message}
												</span>
											)}
										</div>
									:
											<div className="col-span-9">
												<FloatingLabelInput
													type="number"
													value={(() => {
														console.log(`repetitions_per_set.${i}`, formValues.repetitions_per_set[i]);
														return formValues.repetitions_per_set[i]?formValues.repetitions_per_set[i]:''
													})()}
													{...register(`repetitions_per_set.${i}`, {required: "Required", valueAsNumber: true})}
													className={cn("bg-transparent border border-black/25",errors?.repetitions_per_set?.[i]
															? "border-red-500"
															: "")}
													min="0"
												/>
												{errors?.repetitions_per_set?.[i] && (
													<span className="text-red-500 mr-4">
														{errors.repetitions_per_set?.[i].message}
													</span>
												)}
											</div>
									}

									<div className="col-span-9">
										<FloatingLabelInput
											type="number"
											{...register(`rest_between_set.${i}`, { required: "Required", valueAsNumber: true})}
											className={`bg-transparent border border-black/25 ${
												errors?.rest_between_set?.[i]
													? "border-red-500"
													: ""
											}`}
											min="0"
										/>
										{errors?.rest_between_set?.[i] && (
											<span className="text-red-500 mr-4">
												{errors.rest_between_set?.[i].message}
											</span>
										)}
									</div>

									<button
										type="button"
										onClick={() => {
											form.setValue('seconds_per_set', formValues.seconds_per_set.filter((_, index) => index !== i));
											form.setValue('rest_between_set', formValues.rest_between_set.filter((_, index) => index !== i));
											form.setValue('repetitions_per_set', formValues.repetitions_per_set.filter((_, index) => index !== i));
										}}
										className="text-red-500 hover:text-red-700"
									>
										<i
											className="fa-regular fa-trash-can text-red-500"
										/>
									</button>
								</React.Fragment>
							)})}
						</div>
						<Button
							variant={"ghost"}
							type="button"
							onClick={() => {
								form.setValue('seconds_per_set', [...formValues.seconds_per_set, 0]);
								form.setValue('rest_between_set', [...formValues.rest_between_set, 0]);
								form.setValue('repetitions_per_set', [...formValues.repetitions_per_set, 0]);
							}}
							className="gap-2 items-center justify-center px-4 py-2 rounded hover:bg-transparent"
						>
							<i className="fa-solid fa-plus"></i> Add 
						</Button>
								{formValues.exercise_type === "Time Based" ?
								<div className="grid grid-cols-3 gap-2">
									<div>
										<Controller
											name="met_id"
											rules={{required: "Required"}}
											control={control}
											render={({
												field: {onChange, value, onBlur},
												fieldState: {invalid, error} 
											}) => (
												<Select
													onValueChange={(value) => onChange(+value)}
													defaultValue={value?String(value):undefined}
												>
													<SelectTrigger
														floatingLabel="MET"
														labelClassname="bg-transparent"
														name="goals"
														>
														<SelectValue
															placeholder="MET"
														/>
													</SelectTrigger>
													<SelectContent>
													{MetsData?.map((st: any, index: number) =>
														<SelectItem
															key={index}
															value={String(st.value)}
															>
															{st.label}
														</SelectItem>
													)}
													</SelectContent>
												</Select>
											)}
										/>
										{errors.met_id?.message && <span className="text-red-500 text-xs mt-[5px]">{errors.met_id?.message}</span>}
									</div>
									<div>
										<FloatingLabelInput
											{...register("distance", {setValueAs:v => {console.log("distance value", v);return v}, validate: v => (isNaN(v) || v >= 0) || "Only non negative numbers"})}
											type="number"
											id="distance"
											label="Distance(KM)"
											labelClassname="bg-transparent text-xs"
											className="bg-transparent"
										/>
										{errors.distance?.message && (
											<span className="text-red-500 text-xs mt-[5px]">
												{
													errors.distance?.message
												}
											</span>
										)}
									</div>
									<div>
										<FloatingLabelInput
											{...register("speed", {setValueAs: v => {console.log("speed value", v);return v}, validate: v => (isNaN(v) || v >= 0) || "Only non negative numbers"})}
											id="speed"
											type="number"
											label="Speed(KM/H)"
											labelClassname="bg-transparent text-xs"
											className="bg-transparent"
										/>
										{errors.speed?.message && (
											<span className="text-red-500 text-xs mt-[5px]">
												{
													errors.speed?.message
												}
											</span>
										)}
									</div>
								</div>
								: 
								<>
								<div>
									<Controller
										name="exercise_intensity"
										rules={{ required: "Required" }}
										control={control}
										render={({
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<div className="flex justify-center">
												<RadioGroup
													onValueChange={(e) => {
														console.log(e);
														onChange(e);
														setTimeout(() => console.log(form.getValues(), formValues), 1000);
													}}
													defaultValue={
														(() => {console.log(value != null ? String(value) : undefined);return value != null ? String(value) : undefined})()
													}
													className="flex flex-row space-x-4"
												>
															<div
																className="flex justify-start items-center space-x-3"
															>
																<RadioGroupItem
																	id="Max Intensity"
																	value="Max Intensity"
																/>
																<Label htmlFor="Max Intensity">Max Intensity</Label>
															</div>
															<div
																className="flex justify-start items-center space-x-3"
															>
																<RadioGroupItem
																	id="irm"
																	value="irm"
																/>
																<div>
																	<FloatingLabelInput
																		{...register("intensity_value", {setValueAs: v => {console.log("speed value", v);return v}, validate: v => (isNaN(v) || v >= 0) || "Only non negative numbers"})}
																		id="speed"
																		type="number"
																		className="w-16 bg-transparent"
																	/>
																	{errors.speed?.message && (
																		<span className="text-red-500 text-xs mt-[5px]">
																			{
																				errors.speed?.message
																			}
																		</span>
																	)}
																</div>
																<Label htmlFor="irm">%1RM</Label>
															</div>
														
												</RadioGroup>
											</div>
										)}
									/>
									{errors["exercise_type"]?.message && (
										<span className="text-red-500 text-xs mt-[5px]">
											{
												errors["exercise_type"]?.message
											}
										</span>
									)}
								</div>
								</>}
						</form>
					</FormProvider>
					: <span className="flex flex-grow justify-center items-center">No exercise selected</span>
					}
				</div>
			</div>
		</div>
	);
}
export default WorkoutStep2;
