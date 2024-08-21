import { Workout, createExerciseInputTypes } from "@/app/types";
import { Controller, useFormContext } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { workout_day_data } from "@/lib/constants/workout";
import { useState } from "react";
import WorkoutDayComponent, { WorkoutDay, WorkoutDayOptional } from "../components/WorkoutDayComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetAllCategoryQuery, useGetAllEquipmentsQuery, useGetAllJointsQuery, useGetAllMuscleQuery } from "@/services/exerciseApi";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExerciseItem } from "@/constants/exercise";

const WorkoutStep2: React.FC = () => {
	const {getValues} = useFormContext<Workout>();
	const [weeks, setWeeks] = useState<any>(workout_day_data);
	const { data: CategoryData } = useGetAllCategoryQuery();
	const { data: EquipmentData } = useGetAllEquipmentsQuery();
	const { data: MuscleData } = useGetAllMuscleQuery();
	const { data: JointsData } = useGetAllJointsQuery();
	console.log(CategoryData, EquipmentData, MuscleData, JointsData);

	function handleAddDay(week: number) {
		const thisWeek = weeks.find(w => w.week === week);
		if (thisWeek.days.length === 7) {
			toast({
				variant: "destructive",
				title: "Max Days In a Week Reached",
				description: "A week can only have 7 days. Add another week.",
			});
			return
		}
		setWeeks(weeks => 
			weeks.map(week => {
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
		setWeeks(weeks => [...weeks, {
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
			
			return weeks.map(week => ({...week, days: week.days.filter(day => day.id !== id)}))
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
  const [filterData, setFilter] = useState({});

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
	return (
		<div className="mt-4 space-y-4 mb-20">
			<p className="text-black/80 text-[1.37em] font-bold">
				{" "}
				Training & Exercise Details
			</p>
			<div className="w-full flex gap-5">
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3 space-y-3 custom-scrollbar">
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
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3">
					<div className="flex justify-between">
						<span className="font-semibold">Exercise</span>
					</div>
					<span className="text-sm">Filter Exercises</span>
                {Exercise_info.map((element) => {
                if (element.type == "select") {
                  return (
                    <Select
                      key={element.label}
                      name={element.label}
                      value={filterData[element.label]}
                      onValueChange={(value) => {
                        handleFilterChange(element.label, value);
                      }}
                    >
                      <SelectTrigger floatingLabel={element.label.replace(/_/g, ' ').toUpperCase()}>
                        <SelectValue placeholder={"Select " + element.label.replace(/_/g, ' ') // Replace underscores with spaces
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
                      floatingLabel={element.label.replace(/_/g, ' ')}
                      key={element.label}
                      options={element.options}
                      defaultValue={filterData[element.label] || []} // Ensure defaultValue is always an array
                      onValueChange={(selectedValues) => {
                        console.log("Selected Values: ", selectedValues); // Debugging step
                        handleFilterChange(element.label, selectedValues); // Pass selected values to state handler
                      }}
                      placeholder={"Select " + element.label.replace(/_/g, ' ')}
                      variant="inverted"
                      maxCount={1}
                      className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                  );
                }
							})}
				</div>
				<div className="flex-1 h-[26rem] bg-[#EEE] rounded-xl p-3"></div>
			</div>
		</div>
	);
}
export default WorkoutStep2;
