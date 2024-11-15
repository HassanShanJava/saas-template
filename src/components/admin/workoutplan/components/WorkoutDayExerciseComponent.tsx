import { ExerciseTypeEnum, IntensityEnum } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner/spinner";
import { cn } from "@/lib/utils";
const { VITE_VIEW_S3_URL } = import.meta.env;

export interface Exercise {
  id?: number;
  workout_day_id?: number;
  exercise_id?: number;
  exercise_type?: ExerciseTypeEnum;
  sets?: number | null;
  seconds_per_set?: number[];
  repetitions_per_set?: number[];
  rest_between_set?: number[];
  exercise_intensity?: IntensityEnum;
  intensity_value?: number | null;
  notes?: string;
  distance?: number | null;
  speed?: number | null;
  met_id?: number | null;
  exercise_name: string;
  thumbnail_male?: string;
  gif_url?: string;
}

interface WorkoutDayExerciseyProps {
  exercise: Exercise;
  //add: ((week: number) => void) | null;
  selected: boolean;
  onDuplicate: (exercise: Exercise, id: number) => void;
  onDelete: (id: number) => void;
  onClick: () => void;
  isDeleteLoading: boolean;
  //onUpdate: (id: number, updatedDay: WorkoutDayOptional) => void;
}
export default function WorkoutDayExerciseComponent({
  exercise,
  onDuplicate,
  onDelete,
  onClick,
  selected,
  isDeleteLoading,
}: WorkoutDayExerciseyProps) {
  return (
    <div
      className={cn(
        "border border-black/25 rounded-lg p-2 cursor-pointer hover:border-primary",
        selected && "border-primary"
      )}
    >
      <div onClick={onClick}>
        <div className="flex justify-between items-center relative space-x-1">
          <div className="grid grid-cols-[40px_auto] w-4/5">
            <img
              id="avatar"
              src={
                exercise.gif_url
                  ? exercise.gif_url.includes(VITE_VIEW_S3_URL)
                    ? exercise.gif_url
                    : `${VITE_VIEW_S3_URL}/${exercise.gif_url}`
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
          <div className="flex gap-x-4 align-center ">
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent div's onClick from triggering
                onClick();
              }}
              className="h-auto p-0"
              variant="ghost"
            >
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(exercise, exercise?.id || 0);
              }}
              className="h-auto p-0"
              variant="ghost"
            >
              <i className="fa-regular fa-clone"></i>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(exercise?.id || 0);
              }}
              className="h-6 w-6 p-0"
              variant="ghost"
            >
              {selected && isDeleteLoading ? (
                <Spinner className="h-4 w-4" /> // Show spinner when deleting
              ) : (
                <i className="fa-regular fa-trash-can"></i>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
