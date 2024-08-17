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

export const initialValue = {
  exercise_name: "",
  visible_for: undefined,
  exercise_type: undefined,
  exercise_intensity: undefined,
  intensity_value: undefined,
  difficulty: undefined,
  sets: undefined,
  seconds_per_set: undefined,
  repetitions_per_set: undefined,
  rest_between_set: undefined,
  distance: null,
  speed: null,
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
};

export type ExerciseItem = {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: Array<{ value: number | string; label: string }>; // Define options here
};
