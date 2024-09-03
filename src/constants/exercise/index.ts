import {
  createExerciseInputTypes,
  difficultyEnum,
  ExerciseResponseViewType,
  ExerciseTypeEnum,
  IntensityEnum,
} from "@/app/types";
import { Difficulty } from "@/components/admin/exercise/component/difficultySlider";
import { deleteCognitoImage, UploadCognitoImage } from "@/utils/lib/s3Service";

export const visibilityOptions = [
  { value: "Only Myself", label: "Only myself" },
  { value: "Coaches Of My Gym", label: "Coaches of my gym" },
  { value: "Members Of My Gym", label: "Members of my gym" },
  {
    value: "Everyone In My Gym",
    label: "Everyone in my gym",
  },
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

export const processAndUploadImages = async (
  input: {
    gif?: File[];
    imagemale?: File[];
    imagefemale?: File[];
  },
  existingImages: {
    gif?: string | null;
    thumbnail_male?: string | null;
    image_url_male?: string | null;
    thumbnail_female?: string | null;
    image_url_female?: string | null;
  }
) => {
  const result: {
    gif_url?: string;
    thumbnail_male?: string;
    image_url_male?: string;
    thumbnail_female?: string;
    image_url_female?: string;
  } = {};

  // Define the upload function
  const uploadFile = async (file: File): Promise<UploadResponse> => {
    return await UploadCognitoImage(file);
  };

  // Define the delete function
  const deleteExistingImage = async (url?: string | null) => {
    if (url) {
      const fileName = url.split("/").pop() ?? ""; // Extract file name from URL
      return await deleteCognitoImage(fileName);
    }
    return { success: true }; // No image to delete
  };

  // Handle GIF image
  if (input.gif && input.gif.length > 0) {
    if (existingImages.gif) {
      await deleteExistingImage(existingImages.gif);
    }
    const gifResponse = await uploadFile(input.gif[0]);
    if (gifResponse.success) {
      result.gif_url = gifResponse.location ?? "";
    }
  } else {
    result.gif_url = existingImages.gif ?? "";
  }

  // Handle male images
  if (input.imagemale && input.imagemale.length > 0) {
    if (existingImages.thumbnail_male || existingImages.image_url_male) {
      await deleteExistingImage(existingImages.thumbnail_male);
      await deleteExistingImage(existingImages.image_url_male);
    }
    const maleImageResponse = await uploadFile(input.imagemale[0]);
    if (maleImageResponse.success) {
      result.thumbnail_male = maleImageResponse.location ?? "";
      result.image_url_male = maleImageResponse.location ?? "";
    }
  } else {
    result.thumbnail_male = existingImages.thumbnail_male ?? "";
    result.image_url_male = existingImages.image_url_male ?? "";
  }

  // Handle female images
  if (input.imagefemale && input.imagefemale.length > 0) {
    if (existingImages.thumbnail_female || existingImages.image_url_female) {
      await deleteExistingImage(existingImages.thumbnail_female);
      await deleteExistingImage(existingImages.image_url_female);
    }
    const femaleImageResponse = await uploadFile(input.imagefemale[0]);
    if (femaleImageResponse.success) {
      result.thumbnail_female = femaleImageResponse.location ?? "";
      result.image_url_female = femaleImageResponse.location ?? "";
    }
  } else {
    result.thumbnail_female = existingImages.thumbnail_female ?? "";
    result.image_url_female = existingImages.image_url_female ?? "";
  }

  console.log("Result:", result);
  return result;
};

export enum VisibilityEnum {
  OnlyMyself = "Only Myself",
  StaffOfMyClub = "Staff of My Club",
  MembersOfMyClub = "Members of My Club",
  EveryoneInMyClub = "Everyone in My Club",
}

export const initialValue = {
  exercise_name: "",
  visible_for: "",
  exercise_type: ExerciseTypeEnum.time_based,
  exercise_intensity: IntensityEnum.max_intensity,
  intensity_value: 10,
  difficulty: difficultyTypeoptions[Difficulty.Novice].value,
  sets: null,
  distance: 0,
  speed: 0,
  met_id: null,
  gif_url: "",
  video_url_male: "",
  video_url_female: "",
  thumbnail_male: "",
  thumbnail_female: "",
  category_id: "",
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
    distance: input.distance ? parseFloat(input.distance) : 0,
    speed: input.speed ? parseFloat(input.speed) : 0,
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
    finalPayload.met_id = null;
    finalPayload.distance = 0;
    finalPayload.speed = 0;
  }

  if (input.exercise_type === ExerciseTypeEnum.time_based) {
    finalPayload.seconds_per_set = Array.isArray(input.timePerSet)
      ? input.timePerSet.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.rest_between_set = Array.isArray(input.restPerSet)
      ? input.restPerSet.map((item: any) => parseInt(item.value, 10))
      : [];
    finalPayload.sets = input.timePerSet.length;
    finalPayload.exercise_intensity = 0;
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
    visible_for: data.visible_for ?? undefined,
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
