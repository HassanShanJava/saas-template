import { difficultyEnum, ExerciseTypeEnum, IntensityEnum } from "@/app/types";
import { Difficulty } from "@/components/admin/exercise/component/difficultySlider";

export const visibilityOptions = [
  { value: "Only Myself", label: "Only Myself" },
  { value: "Staff of My Club", label: "Staff of My Club" },
  { value: "Members of My Club", label: "Members of My Club" },
  { value: "Everyone in My Club", label: "Everyone in My Club" },
];

export const exerciseTypeOptions = [
  { value: "Time Based", label: "Time Based" },
  { value: "Repetition Based", label: "Repetition Based" },
];
export const difficultyTypeoptions = [
  { value: "Novice", label: "Novice" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advance", label: "Advance" },
  { value: "Expert", label: "Expert" },
];
const existingGif: File[] = []; // Initialize this with your existing files if any.

export const initialValue = {
  exercise_name: "",
  visible_for: undefined,
  exercise_type: ExerciseTypeEnum.time_based,
  exercise_intensity: IntensityEnum.max_intensity,
  intensity_value: 10,
  difficulty: difficultyEnum.Beginner,
  sets: undefined,
  seconds_per_set: [],
  repetitions_per_set: [],
  rest_between_set: [],
  distance: 0,
  speed: 0,
  met_id: null,
  gif_url: "",
  video_url_male: "",
  video_url_female: "",
  thumbnail_male: "",
  thumbnail_female: "",
  category_id: null,
  equipment_ids: [],
  primary_muscle_ids: [],
  secondary_muscle_ids: [],
  primary_joint_ids: [],
  timePerSet: [{ value: null }],
  restPerSet: [{ value: null }],
  repetitionPerSet: [{ value: null }],
  gif: existingGif,
};

export type ExerciseItem = {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: Array<{ value: number | string; label: string }>; // Define options here
};
