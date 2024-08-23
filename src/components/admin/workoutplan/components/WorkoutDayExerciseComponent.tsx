import { Button } from "@/components/ui/button";

export interface Exercise {
	id: number;
	video_url_male: string;
	thumbnail_male: string;
	exercise_name: string;
	exercise_type: string;
	seconds_per_set: number[];
	repetitions_per_set: number[];
	rest_between_set: number[];
	exercise_intensity: "Max" | "% of 1RM";
	intensity_value: number;
	distance: number;
	speed: number;
	met_id: number;
	equipments: {id: number; name: string}[];
}

interface WorkoutDayExerciseyProps {
	exercise: Exercise;
	//add: ((week: number) => void) | null;
	onDuplicate: (id: number) => void;
	onDelete: (id: number) => void;
	//onUpdate: (id: number, updatedDay: WorkoutDayOptional) => void;
}
export default function WorkoutDayExerciseComponent({exercise, onDuplicate, onDelete}: WorkoutDayExerciseyProps) {
	return (
		<div className="border border-black/25 rounded-lg p-2">
			<div className="flex justify-between items-center relative space-x-1">
				<div className="flex gap-1 w-full">
					<img
						id="avatar"
						src={exercise.thumbnail_male}
						alt="Exercise Image"
						className="h-[20px] w-12 object-contain relative"
					/>
					<span className="text-sm truncate">{exercise.exercise_name} - {exercise.equipments.map(e => e.name).join(", ")}</span>
				</div>
				<div className="flex gap-x-1 align-center">
					<Button 
						onClick={() => {onDuplicate(exercise.id)}}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa-regular fa-clone"></i>
					</Button>
					<Button 
						onClick={() => {onDelete(exercise.id)}}
						className="h-auto p-0" variant="ghost"
					>
						<i className="fa-regular fa-trash-can"></i>
					</Button>
				</div>
			</div>
		</div>
	);
}
