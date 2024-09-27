import { WorkoutDay } from "@/components/admin/workoutplan/components/WorkoutDayComponent";
import { useEffect, useState } from "react";
import { useGetWorkoutByIdQuery } from "@/services/workoutService";

import { deleteCognitoImage, UploadCognitoImage } from "@/utils/lib/s3Service";
import { days } from "@/app/types";
type UploadResponse = {
  success: boolean;
  data?: string;
  location?: string;
  message?: string;
};

export interface searchCritiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
  goals?: string[];
  visible_for?: string[];
  level?: string;
}
export const processAndUploadImages = async (
  input: {
    file?: File[];
  },
  existingImages: {
    file?: string | null;
  }
) => {
  const result: {
    img_url?: string;
  } = {};

  // Define the upload function
  const uploadFile = async (file: File): Promise<UploadResponse> => {
    console.log("update url called");
    return await UploadCognitoImage(file);
  };

  // Define the delete function
  const deleteExistingImage = async (url?: string | null) => {
    if (url) {
      console.log("url to delete image from the workout", url);
      return await deleteCognitoImage(url);
    }
    return { success: true };
  };

  // Handle file image
  if (input.file && input.file.length > 0) {
    if (existingImages.file) {
      console.log("deleting this file", existingImages.file);
      await deleteExistingImage(existingImages.file);
    }
    const fileResponse = await uploadFile(input.file[0]);
    if (fileResponse.success) {
      result.img_url = fileResponse.location ?? "";
    }
  } else {
    result.img_url = existingImages.file ?? "";
  }

  console.log("Result:", result);
  return result;
};

export const initialValue = {
  workout_name: "",
  org_id: 0,
  description: "", // Optional, can be omitted if not needed
  visible_for: undefined, // Optional
  goals: "",
  level: "",
  weeks: undefined,
  img_url: undefined,
  members: [],
  file: undefined,
};

export function useGetAllWorkoutDayQuery(workoutId: string): {
  data: days[] | null;
  isLoading: boolean;
} {
  const [data, setData] = useState<days[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: workoutData,
    error,
    isLoading: workoutDataLoading,
  } = useGetWorkoutByIdQuery(
    {
      workoutId,
      include_days: true, // Enable days to be included
      include_days_and_exercises: false,
    },
    {
      skip: workoutId == undefined,
    }
  );

  useEffect(() => {
    if (!workoutDataLoading && workoutData && workoutData.days) {
      setData(workoutData.days);
      setIsLoading(false);
    } else if (!workoutDataLoading && error) {
      setIsLoading(false);
    }
  }, [workoutDataLoading, workoutData, error]);

  return { data, isLoading };
}
