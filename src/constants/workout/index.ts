import { deleteCognitoImage, UploadCognitoImage } from "@/utils/lib/s3Service";
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
  // sort_key?: string;
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
