import { ExerciseTypeEnum, IntensityEnum } from "@/app/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const { VITE_VIEW_S3_URL } = import.meta.env;

export interface Exercise {
  id: number;
  video_url_male?: string;
  thumbnail_male?: string;
  exercise_name: string;
  exercise_type: ExerciseTypeEnum;
  seconds_per_set: number[];
  repetitions_per_set: number[];
  rest_between_set: number[];
  exercise_intensity?: IntensityEnum;
  intensity_value: number | null;
  distance: number | null;
  speed: number | null;
  met_id: number | null;
  equipments?: { id: number; name: string }[];
  notes?: string;
}

interface WorkoutDayExerciseyProps {
  exercise: Exercise;
  //add: ((week: number) => void) | null;
  selected: boolean;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: () => void;
  //onUpdate: (id: number, updatedDay: WorkoutDayOptional) => void;
}
export default function WorkoutDayExerciseComponent({
  exercise,
  onDuplicate,
  onDelete,
  onClick,
  selected,
}: WorkoutDayExerciseyProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border border-black/25 rounded-lg p-2 cursor-pointer hover:border-primary",
        selected && "border-primary"
      )}
    >
      <div className="flex justify-between items-center relative space-x-1">
        <div className="grid grid-cols-[40px_auto] w-4/5">
          <img
            id="avatar"
            src={
              exercise.thumbnail_male
                ? `${VITE_VIEW_S3_URL}/${exercise.thumbnail_male}`
                : `${VITE_VIEW_S3_URL}/download.png`
            }
            alt="Exercise Image"
            className="h-[20px] w-[40px] object-contain relative"
          />
          <span className="text-sm truncate">
            {exercise.exercise_name}
            {/* -{" "} */}
            {/* {exercise.equipments.map((e) => e.name).join(", ")} */}
          </span>
        </div>
        <div className="flex gap-x-1 align-center">
          <Button
            onClick={() => {
              onDuplicate(exercise.id);
            }}
            className="h-auto p-0"
            variant="ghost"
          >
            <i className="fa-regular fa-clone"></i>
          </Button>
          <Button
            onClick={() => {
              onDelete(exercise.id);
            }}
            className="h-auto p-0"
            variant="ghost"
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
