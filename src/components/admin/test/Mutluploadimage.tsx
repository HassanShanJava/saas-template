import React, { ChangeEvent, useState } from "react";
import { UploadCognitoImage } from "@/utils/lib/s3Service";

type ImageType =
  | "maleThumbnail"
  | "femaleThumbnail"
  | "malePromotional"
  | "femalePromotional";

type FileState = Record<ImageType, File | null>;
type UrlState = Record<ImageType, string | null>;
const ImageUpload: React.FC = () => {
  // Separate state for selected files and preview URLs
  const [selectedFiles, setSelectedFiles] = useState<FileState>({
    maleThumbnail: null,
    femaleThumbnail: null,
    malePromotional: null,
    femalePromotional: null,
  });

  const [previewUrls, setPreviewUrls] = useState<UrlState>({
    maleThumbnail: null,
    femaleThumbnail: null,
    malePromotional: null,
    femalePromotional: null,
  });

  // Handle file selection for a specific image type
  const handleFileSelect = (
    type: ImageType,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    // Validate the file type
    if (
      file &&
      !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
    ) {
      console.error(
        `Invalid file type for ${type}. Only PNG, JPEG, JPG, and GIF are allowed.`
      );
      return; // Exit if the file type is not allowed
    }

    if (file) {
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [type]: file,
      }));

      setPreviewUrls((prevUrls) => ({
        ...prevUrls,
        [type]: URL.createObjectURL(file),
      }));
    }
  };

  const uploadFile = async (
    type: ImageType
  ): Promise<{ type: ImageType; url: string } | null> => {
    const selectedFile = selectedFiles[type];
    if (!selectedFile) {
      console.log(`No file selected for ${type}`);
      return null; // Return null if no file is selected
    }

    try {
      // Call the custom upload function and get the S3 URL
      const s3Response = await UploadCognitoImage(selectedFile);
      const s3Url = s3Response.location;

      // Return the structured data for this image
      return { type, url: s3Url as string };
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null; // Return null in case of an error
    }
  };

  // Upload all available files
  const uploadAllFiles = async () => {
    if (!Object.values(selectedFiles).some((file) => file !== null)) {
      console.log("No files selected for upload.");
      return;
    }

    const uploadResults = await Promise.all(
      Object.keys(selectedFiles).map((type) => uploadFile(type as ImageType))
    );

    // Create an object to store the URLs
    const uploadedUrls = uploadResults.reduce<Record<ImageType, string | null>>(
      (acc, result) => {
        if (result) {
          acc[result.type] = result.url;
        }
        return acc;
      },
      {
        maleThumbnail: null,
        femaleThumbnail: null,
        malePromotional: null,
        femalePromotional: null,
      }
    );

    // Log the object containing all image names and URLs
    console.log("Upload Results:", uploadedUrls);

    console.log("All available files have been processed.");
  };

  // Render each image preview and upload button
  return (
    <div>
      <h2>Upload Multiple Images to S3</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {Object.keys(selectedFiles).map((type) => (
          <div
            key={type}
            style={{ flexBasis: "calc(25% - 20px)", marginBottom: "20px" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(type as ImageType, e)}
              style={{ marginBottom: "10px" }}
            />

            {previewUrls[type as ImageType] && (
              <div>
                <h3>Preview ({type}):</h3>
                <img
                  src={previewUrls[type as ImageType] as string}
                  alt={`Preview ${type}`}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>
            )}

          </div>
        ))}
      </div>

      <button
        onClick={uploadAllFiles}
        style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
      >
        Upload All Available Files
      </button>
    </div>
  );
};

export default ImageUpload;