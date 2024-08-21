import {
  createExerciseInputTypes,
  difficultyEnum,
  ExerciseResponseViewType,
  ExerciseTypeEnum,
  IntensityEnum,
} from "@/app/types";
import { Difficulty } from "@/components/admin/exercise/component/difficultySlider";
import { UploadCognitoImage } from "@/utils/lib/s3Service";

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
type Input = {
  gif: File[];
  imagemale: File[];
  imagefemale: File[];
};

type UploadResponse = {
  success: boolean;
  data?: string;
  location?: string;
  message?: string;
};

export const processAndUploadImages = async (input: Input) => {
  const result: {
    gif_url: string;
    thumbnail_male?: string;
    image_url_male?: string;
    thumbnail_female?: string;
    image_url_female?: string;
  } = {
    gif_url: "",
  };

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    return await UploadCognitoImage(file);
  };

  if (input.gif && input.gif.length > 0) {
    const gifResponse = await uploadFile(input.gif[0]);
    if (gifResponse.success) {
      result.gif_url = gifResponse.location ?? "";
    }
  }

  if (input.imagemale && input.imagemale.length > 0) {
    const maleImageResponse = await uploadFile(input.imagemale[0]);
    if (maleImageResponse.success) {
      result.thumbnail_male = maleImageResponse.location ?? "";
      result.image_url_male = maleImageResponse.location ?? "";
    }
  } else {
    result.thumbnail_male = "";
    result.image_url_male = "";
  }

  if (input.imagefemale && input.imagefemale.length > 0) {
    const femaleImageResponse = await uploadFile(input.imagefemale[0]);
    if (femaleImageResponse.success) {
      result.thumbnail_female = femaleImageResponse.location ?? "";
      result.image_url_female = femaleImageResponse.location ?? "";
    }
  } else {
    result.thumbnail_female = "";
    result.image_url_female = "";
  }

  console.log("Result:", result);
  return result;
};

export const initialValue = {
  exercise_name: "",
  visible_for: null,
  exercise_type: ExerciseTypeEnum.time_based,
  exercise_intensity: IntensityEnum.max_intensity,
  intensity_value: 10,
  difficulty: difficultyTypeoptions[Difficulty.Novice].value,
  sets: undefined,
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
  restPerSetrep: [{ value: null }],
  repetitionPerSet: [{ value: null }],
  gif: existingGif,
  imagemale: existingGif,
  imagefemale: existingGif,
};

export type ExerciseItem = {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: Array<{ value: number | string; label: string }>; // Define options here
  maxlength?: number;
  pattern?: string;
};

export function combinePayload(input: any, updatedData: any) {
  // Conditional deletions based on exercise_type
  if (input.exercise_type === ExerciseTypeEnum.repetition_based) {
    delete input.restPerSet;
    delete input.timePerSet;
    delete input.met_id;
    delete input.distance;
    delete input.speed;
  }

  if (input.exercise_type === ExerciseTypeEnum.time_based) {
    delete input.restPerSetrep;
    delete input.repetitionPerSet;
    delete input.exercise_intensity;
    if (input.exercise_intensity === IntensityEnum.max_intensity) {
      delete input.intensity_value;
    }
  }

  // Construct the final payload
  const finalPayload: any = {
    exercise_name: input.exercise_name,
    visible_for: input.visible_for,
    exercise_type: input.exercise_type,
    // exercise_intensity: input.exercise_intensity,
    // intensity_value: input.intensity_value,
    difficulty: input.difficulty,
    distance: input.distance ? parseInt(input.distance, 10) : undefined,
    speed: input.speed ? parseInt(input.speed, 10) : undefined,
    met_id: input.met_id,
    gif_url: updatedData.gif_url,
    video_url_male: input.video_url_male,
    video_url_female: input.video_url_female,
    thumbnail_male: updatedData.thumbnail_male,
    thumbnail_female: updatedData.thumbnail_female,
    category_id: input.category_id
      ? parseInt(input.category_id, 10)
      : undefined,
    equipment_ids: Array.isArray(input.equipment_ids)
      ? input.equipment_ids
      : [],
    primary_muscle_ids: Array.isArray(input.primary_muscle_ids)
      ? input.primary_muscle_ids
      : [],
    secondary_muscle_ids: Array.isArray(input.secondary_muscle_ids)
      ? input.secondary_muscle_ids
      : [],
    primary_joint_ids: Array.isArray(input.primary_joint_ids)
      ? input.primary_joint_ids
      : [],
  };

  // Handle exercise_type specific fields
  if (input.exercise_type === ExerciseTypeEnum.repetition_based) {
    finalPayload.repetitions_per_set = Array.isArray(input.repetitionPerSet)
      ? input.repetitionPerSet.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.rest_between_set = Array.isArray(input.restPerSetrep)
      ? input.restPerSetrep.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.sets = input.repetitionPerSet.length;
  }

  if (input.exercise_type === ExerciseTypeEnum.time_based) {
    finalPayload.seconds_per_set = Array.isArray(input.timePerSet)
      ? input.timePerSet.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.rest_between_set = Array.isArray(input.restPerSet)
      ? input.restPerSet.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.sets = input.timePerSet.length;
  }

  // Conditionally include exercise_intensity and intensity_value
  if (input.exercise_intensity) {
    finalPayload.exercise_intensity = input.exercise_intensity;
  }

  if (input.intensity_value) {
    finalPayload.intensity_value = input.intensity_value;
  }

  return finalPayload;
}

// export function combinePayload(input: any, updatedData: any) {
//   // Conditional deletions based on exercise_type
//   if (input.exercise_type === ExerciseTypeEnum.repetition_based) {
//     delete input.restPerSet;
//     delete input.timePerSet;
//     delete input.met_id;
//     delete input.distance;
//     delete input.speed;
//   }

//   if (input.exercise_type === ExerciseTypeEnum.time_based) {
//     delete input.restPerSetrep;
//     delete input.repetitionPerSet;
//     delete input.exercise_intensity;
//     if (input.exercise_intensity === IntensityEnum.max_intensity) {
//       delete input.intensity_value;
//     }
//   }

//   // Construct the final payload
//   return {
//     exercise_name: input.exercise_name,
//     visible_for: input.visible_for,
//     exercise_type: input.exercise_type,
//     exercise_intensity: input.exercise_intensity,
//     intensity_value: input.intensity_value,
//     difficulty: input.difficulty,
//     distance: input.distance ? parseInt(input.distance, 10) : undefined,
//     speed: input.speed ? parseInt(input.speed, 10) : undefined,
//     met_id: input.met_id,
//     gif_url: updatedData.gif_url,
//     video_url_male: input.video_url_male,
//     video_url_female: input.video_url_female,
//     thumbnail_male: updatedData.thumbnail_male,
//     thumbnail_female: updatedData.thumbnail_female,
//     category_id: input.category_id
//       ? parseInt(input.category_id, 10)
//       : undefined,
//     equipment_ids: Array.isArray(input.equipment_ids)
//       ? input.equipment_ids
//       : [],
//     primary_muscle_ids: Array.isArray(input.primary_muscle_ids)
//       ? input.primary_muscle_ids
//       : [],
//     secondary_muscle_ids: Array.isArray(input.secondary_muscle_ids)
//       ? input.secondary_muscle_ids
//       : [],
//     primary_joint_ids: Array.isArray(input.primary_joint_ids)
//       ? input.primary_joint_ids
//       : [],
//     timePerSet: Array.isArray(input.timePerSet)
//       ? input.timePerSet.map((item: any) => parseInt(item.value, 10))
//       : [],
//     restPerSet: Array.isArray(input.restPerSet)
//       ? input.restPerSet.map((item: any) => parseInt(item.value, 10))
//       : [],
//     restPerSetrep: Array.isArray(input.restPerSetrep)
//       ? input.restPerSetrep.map((item: any) =>
//           item.value ? parseInt(item.value, 10) : null
//         )
//       : [],
//     repetitionPerSet: Array.isArray(input.repetitionPerSet)
//       ? input.repetitionPerSet.map((item: any) =>
//           item.value ? parseInt(item.value, 10) : null
//         )
//       : [],
//   };
// }

// export function combinePayload(input: any, updatedData: any) {
//   return {
//     exercise_name: input.exercise_name,
//     visible_for: input.visible_for,
//     exercise_type: input.exercise_type,
//     exercise_intensity: input.exercise_intensity,
//     intensity_value: input.intensity_value,
//     difficulty: input.difficulty,
//     distance: parseInt(input.distance, 10),
//     speed: parseInt(input.speed, 10),
//     met_id: input.met_id,
//     gif_url: updatedData.gif_url,
//     video_url_male: input.video_url_male,
//     video_url_female: input.video_url_female,
//     thumbnail_male: updatedData.thumbnail_male,
//     thumbnail_female: updatedData.thumbnail_female,
//     category_id: parseInt(input.category_id, 10),
//     equipment_ids: input.equipment_ids,
//     primary_muscle_ids: input.primary_muscle_ids,
//     secondary_muscle_ids: input.secondary_muscle_ids,
//     primary_joint_ids: input.primary_joint_ids,
//     timePerSet: input.timePerSet.map((item: any) => parseInt(item.value, 10)),
//     restPerSet: input.restPerSet.map((item: any) => parseInt(item.value, 10)),
//     restPerSetrep: input.restPerSetrep.length
//       ? input.restPerSetrep.map((item: any) =>
//           item.value ? parseInt(item.value, 10) : null
//         )
//       : [],
//     repetitionPerSet: input.repetitionPerSet.length
//       ? input.repetitionPerSet.map((item: any) =>
//           item.value ? parseInt(item.value, 10) : null
//         )
//       : [],
//   };
// }

// Example usage:
const input = {
  exercise_name: "waqar",
  visible_for: "Staff of My Club",
  exercise_type: "Time Based",
  exercise_intensity: "Max Intensity",
  intensity_value: 10,
  difficulty: "Beginner",
  distance: "12",
  speed: "12",
  met_id: 4,
  gif_url: "",
  video_url_male: "abc",
  video_url_female: "abc",
  thumbnail_male: "",
  thumbnail_female: "",
  category_id: "3",
  equipment_ids: [59, 60],
  primary_muscle_ids: [1, 2],
  secondary_muscle_ids: [1, 2],
  primary_joint_ids: [1, 2],
  timePerSet: [
    {
      value: "12",
    },
    {
      value: "12",
    },
    {
      value: "11",
    },
  ],
  restPerSet: [
    {
      value: "12",
    },
    {
      value: "11",
    },
    {
      value: "15",
    },
  ],
  restPerSetrep: [
    {
      value: null,
    },
  ],
  repetitionPerSet: [
    {
      value: null,
    },
  ],
  gif: [
    {
      path: "new.gif",
    },
  ],
  imagemale: [
    {
      path: "profile.jpeg",
    },
  ],
  imagefemale: [
    {
      path: "profile_02.jpeg",
    },
  ],
};

const updatedData = {
  gif_url: "1621ba9c-2e9c-450c-8481-91d0b96fe11e-new.gif",
  thumbnail_male: "62844067-00f9-41c4-b198-dc90c8bedf64-profile.jpeg",
  image_url_male: "62844067-00f9-41c4-b198-dc90c8bedf64-profile.jpeg",
  thumbnail_female: "ff734a6d-e476-40e1-8fb6-41c71d51b535-profile_02.jpeg",
  image_url_female: "ff734a6d-e476-40e1-8fb6-41c71d51b535-profile_02.jpeg",
};

const combinedPayload = combinePayload(input, updatedData);
console.log(combinedPayload);

export const test_editPayload = {
  exercise_name: "sample exercise001",
  visible_for: "Staff of My Club",
  exercise_type: "Time Based",
  intensity_value: 10,
  difficulty: "Novice",
  sets: 2,
  distance: 12,
  speed: 12,
  met_id: 5,
  gif_url: "82230015-5c3c-482f-a20c-448cf8e97ce0-new.gif",
  video_url_male: "abc",
  video_url_female: "abc",
  thumbnail_male: "",
  thumbnail_female: "",
  category_id: 6,
  equipment_ids: [60, 66],
  primary_muscle_ids: [1, 2],
  secondary_muscle_ids: [],
  primary_joint_ids: [1, 2],
  timePerSet: [{ value: 12 }],
  restPerSet: [{ value: 60 }],
  restPerSetrep: [],
  repetitionPerSet: [],
  gif: [],
  imagemale: [],
  imagefemale: [],
};

export const transformExerciseData = (
  data: ExerciseResponseViewType
): createExerciseInputTypes => {
  return {
    exercise_name: data.exercise_name,
    visible_for: data.visible_for ?? null,
    org_id: data.org_id,
    exercise_type: data.exercise_type,
    exercise_intensity: data.exercise_intensity,
    intensity_value: data.intensity_value || undefined,
    difficulty: data.difficulty || "",
    sets: data.sets ?? null,
    distance: data.distance ?? undefined,
    speed: data.speed ?? undefined,
    met_id: data.met_id ?? null,
    gif_url: data.gif_url,
    video_url_male: data.video_url_male,
    video_url_female: data.video_url_female,
    thumbnail_male: data.thumbnail_male,
    thumbnail_female: data.thumbnail_female,
    image_url_female: data.image_url_female,
    image_url_male: data.image_url_male,
    category_id: data.category_id,
    equipment_ids: data.equipment_ids,
    primary_muscle_ids: data.primary_muscle_ids,
    secondary_muscle_ids: data.secondary_muscle_ids ?? [],
    primary_joint_ids: data.primary_joint_ids,
    timePerSet: data.seconds_per_set?.map((value) => ({ value })) ?? [
      { value: null },
    ],
    restPerSet: data.rest_between_set?.map((value) => ({ value })) ?? [
      { value: null },
    ],
    restPerSetrep: [], // Adjust this as needed
    repetitionPerSet: [], // Adjust this as needed
    gif: [], // File inputs will be handled separately
    imagemale: [],
    imagefemale: [],
  };
};
