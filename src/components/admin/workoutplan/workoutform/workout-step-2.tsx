import { Workout, createExerciseInputTypes } from "@/app/types";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { workout_day_data, workout_day_exercise_data } from "@/lib/constants/workout";
import React, { useEffect, useState } from "react";
import WorkoutDayComponent, { WorkoutDay, WorkoutDayOptional } from "../components/WorkoutDayComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetAllCategoryQuery, useGetAllEquipmentsQuery, useGetAllJointsQuery, useGetAllMetQuery, useGetAllMuscleQuery } from "@/services/exerciseApi";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExerciseItem, exerciseTypeOptions } from "@/constants/exercise";
//import WorkoutDayExerciseComponent, { Exercise } from "../components/WorkoutDayExerciseComponent";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { current } from "@reduxjs/toolkit";
import WorkoutDayExerciseComponent from "../components/WorkoutDayExerciseComponent";

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
	met_id; number;
}

export interface RepBased {
	repititions_per_set: number[];
	rest_between_set: number[];
	intensity_type: "Max" | "% of 1RM";
	intensity_value: number;
}

export interface TimeBased {
	seconds_per_set: number[];
	rest_between_set: number[];
	distance: number;
	speed: number;
}
const WorkoutStep2: React.FC = () => {
	const [weeks, setWeeks] = useState<any>(workout_day_data);
	const [exercises, setExercises] = useState<Exercise[]>(workout_day_exercise_data as Exercise[]);
	//const [repBasedData, setRepBasedData] = useState<RepBased>();
	//const [timeBasedData, setTimeBasedData] = useState<TimeBased>();
	const [currExercise, serCurrExercise] = useState<Exercise>(workout_day_exercise_data[0]);
	const { data: CategoryData } = useGetAllCategoryQuery();
	const { data: EquipmentData } = useGetAllEquipmentsQuery();
	const { data: MuscleData } = useGetAllMuscleQuery();
	const { data: JointsData } = useGetAllJointsQuery();
  const { data: MetsData } = useGetAllMetQuery();
	
  const form = useForm<ExerciseForm>({
    defaultValues: (()=>{console.log(currExercise);return currExercise})(),
    mode: "all",
  });
	const {register, control, formState: {errors}, watch, handleSubmit} = form;
	const formValues = watch();


	function handleAddDay(week: number) {
		const thisWeek = weeks.find((w: WorkoutWeek) => w.week === week);
		if (thisWeek.days.length === 7) {
			toast({
				variant: "destructive",
				title: "Max Days In a Week Reached",
				description: "A week can only have 7 days. Add another week.",
			});
			return
		}
		setWeeks((weeks: WorkoutWeek[]) => 
			weeks.map((week: WorkoutWeek) => {
				if(week.week === thisWeek.week) {
				const lastDay = week.days[week.days.length-1];
						return {...week, days: [...week.days,
							{
									day_name: "",
									week: week.week,
									day: lastDay?lastDay.day+1:1,
									id: lastDay.id + 1,
							}
					]}
				} else {
					return week
				}
			}
		));
	}

	function handleAddWeek() {
		const lastWeek = weeks[weeks.length-1];
		const lastDay = lastWeek.days[lastWeek.days.length-1];
		setWeeks((weeks: WorkoutWeek[]) => [...weeks, {
			week: lastWeek.week + 1,
			days: [
					{
						day_name: "",
						week: lastWeek.week + 1,
						day: 1,
						id: lastDay.id + 1,
					}
			]
		}]);
	}

	function handleDelete(id: number) {
		setWeeks((weeks: any) => {
			
			return weeks.map((week: WorkoutWeek) => ({...week, days: week.days.filter(day => day.id !== id)}))
		}
		);
	}

	function handleUpdate(id: number, updatedDay: WorkoutDayOptional) {
		setWeeks((weeks: any) => 
			weeks.map((week: any) => ({
				...week, 
				days: week.days.map((day:WorkoutDay) =>
					day.id === id ? {...day, ...updatedDay} : day
				)}
			))
		) 
	}

	function handleExerciseDuplicate(id: number) {
		const exercise = exercises.find(e => e.id === id);
		if (exercise)
			setExercises(exercises => [...exercises, exercise]);
	}

	function handleExerciseDelete(index: number, id: number) {
		setExercises(exercises => exercises.filter((_, i) => i !== index));
	}

	interface ExerciseFilter {
		primary_muscle_ids?: number[]
		exercise_category?: number;
		primary_joint_ids?: number[];
		equipment_ids?: number[];
	}
		
  const [filterData, setFilter] = useState<ExerciseFilter>({});

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
      name: "exercise_category",
      label: "Category*",
      required: true,
      options: CategoryData,
    },
    {
      type: "multiselect",
      name: "primary_joint_ids",
      label: "Primary Joints*",
      required: true,
      options: JointsData,
    },
    {
      type: "multiselect",
      name: "equipment_ids",
      label: "Equipments*",
      required: true,
      options: EquipmentData,
    },
  ];
  

  function handleFilterChange(field: string, value: any) {
    setFilter((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

	function onSubmit(data: any, event) {
		e.preventDefault();
		console.log(value);
	}
	return (
		<div className="mt-4 space-y-4 mb-20">
			<p className="text-black/80 text-[1.37em] font-bold">
				{" "}
				Training & Exercise Details
			</p>
			<div className="w-full flex gap-5">
				<div className="w-[29.75%] h-[32rem] bg-[#EEE] rounded-xl p-3 space-y-2 custom-scrollbar">
					{weeks.map((week: any, index: number) => (
						<Accordion type="single" defaultValue="item-1" collapsible>
						<AccordionItem value="item-1" className="!border-none">
							<AccordionTrigger className="h-0 !no-underline !bg-transparent">
									<div>
										{index == 0 &&
										<Button
											onClick={(e) => {
												e.stopPropagation();
												handleAddWeek()}
											}
											className="h-auto p-0" variant="ghost"
										>
											<i className="fa fa-plus mr-3"></i>
										</Button>}
										<span className="font-semibold">Week {week.week}</span>
									</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<span className="text-sm">Days</span>
								{week.days.map((st: any, index: number) => (
									<WorkoutDayComponent
									key={st.id}
									day={st}
									dayNo={index%7+1}
									add={index === 0 ? handleAddDay : null}
									onDelete={handleDelete}
									onUpdate={handleUpdate}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					))}
				</div>
				<div className="w-[36.15%] h-[32rem] bg-[#EEE] rounded-xl p-3 custom-scrollbar">
					<div className="flex justify-between">
						<span className="font-semibold">Exercise</span>
					</div>
					<span className="text-sm">Filter Exercises</span>
					<div className="grid grid-cols-3 grid-rows-3 gap-2">
						{Exercise_info.map((element) => {
						if (element.type == "select") {
							return (
								<Select
									key={element.label}
									name={element.label}
									value={filterData[element.label as 'exercise_category']?String(filterData[element.label as 'exercise_category']):undefined}
									onValueChange={(value) => {
										handleFilterChange(element.label, value);
									}}
								>
									<SelectTrigger className="[&_span]:text-xs">
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
									defaultValue={filterData[element.label as "primary_muscle_ids" | "primary_joint_ids" | "equipment_ids"] || []} // Ensure defaultValue is always an array
									onValueChange={(selectedValues) => {
										console.log("Selected Values: ", selectedValues); // Debugging step
										handleFilterChange(element.label, selectedValues); // Pass selected values to state handler
									}}
									placeholder={element.label.replace(/_/g, ' ')}
									variant="inverted"
									maxCount={1}
									className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&_span]:text-xs [&_span]:mx-0 [&_svg]:mx-0"
								/>
							);
						}
					})}
					</div>
					<div className="space-y-2">
						{exercises.map((exercise, i)=> (
							<WorkoutDayExerciseComponent
								key={i}
								exercise={exercise}
								onDuplicate={handleExerciseDuplicate}
								onDelete={(id) => handleExerciseDelete(i, id)}
							/>
						))}
					</div>
				</div>
				<div className="w-[34.1%] h-[32rem] bg-[#EEE] rounded-xl p-3 space-y-2 custom-scrollbar">
					<div className="flex justify-between">
						<span className="font-semibold">Exercise Details</span>
					</div>
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
									src={currExercise.thumbnail_male}
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
												console.log(e);
												onChange(e);
												setTimeout(() => console.log(form.getValues(), formValues), 1000);
											}}
											defaultValue={
												(() => {console.log(value != null ? String(value) : undefined);return value != null ? String(value) : undefined})()
											}
											className="flex flex-row space-x-4"
										>
											{exerciseTypeOptions?.map((option: any, index: number) => (
													<div
														key={index}
														className="flex justify-start items-center space-x-3"
													>
														<RadioGroupItem
															value={String(option.value)}
														/>
														<label>{option.label}</label>
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
												value={formValues.seconds_per_set[i]}
												{...register(`seconds_per_set.${i}`, {required: "Required", setValueNumber: true})}
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
													value={formValues.repetitions_per_set[i]}
													{...register(`repetitions_per_set.${i}`, {required: "Required", setAsNumber: true})}
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
											{...register(`rest_between_set.${i}`, { required: "Required", setValueNumber: true})}
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
							<div className="grid grid-cols-3 gap-2">
								{formValues.exercise_type === "Time Based" ?
								<>
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
									{errors.goal?.message && <span className="text-red-500 text-xs mt-[5px]">{errors.goal?.message}</span>}
								</div>
								<div>
									<FloatingLabelInput
										{...register("distance", {setValueAs:v => {console.log("distance value", v);return v}, validate: v => (isNaN(v) || v >= 0) || "Only non negative numbers"})}
										type="number"
										id="distance"
										label="Distance(KM)"
										labelClassname="bg-transparent"
										className="bg-transparent"
										noFilterInput
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
										labelClassname="bg-transparent"
										className="bg-transparent"
										noFilterInput
									/>
									{errors.speed?.message && (
										<span className="text-red-500 text-xs mt-[5px]">
											{
												errors.speed?.message
											}
										</span>
									)}
								</div>
								</>
								: <></>}
							</div>
							<Button type="submit">Submit</Button>
						</form>
					</FormProvider>
				</div>
			</div>
		</div>
	);
}
export default WorkoutStep2;
