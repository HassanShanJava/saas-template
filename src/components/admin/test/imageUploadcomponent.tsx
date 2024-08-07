import React, { useState } from "react";
import { z } from "zod";

// Import the uploadCognitoImage function
import { UploadCognitoImage } from "@/utils/lib/s3Service";
// Define the Zod schema for image URL validation
const imageUrlSchema = z.string().url();

const UseForm: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
      if (validTypes.includes(file.type)) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
      } else {
        setError(
          "Invalid image format. Only PNG, JPG, JPEG, and GIF are allowed."
        );
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedImage) {
      try {
        const url = await UploadCognitoImage(selectedImage);

        // Validate the URL using the Zod schema
        const result = imageUrlSchema.safeParse(url);
        if (result.success) {
          setImageUrl(result.data);
          console.log("Uploaded Image URL:", result.data);
        } else {
          setError("Invalid image URL received.");
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="imageInput">Select an image:</label>
        <input
          type="file"
          id="imageInput"
          accept=".png, .jpg, .jpeg, .gif"
          onChange={handleImageChange}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      {previewUrl && (
        <div>
          <img
            src={previewUrl}
            alt="Selected"
            style={{ width: "200px", height: "auto" }}
          />
        </div>
      )}
      <button type="submit">Upload Image</button>
      {imageUrl && (
        <div>
          <p>Image uploaded successfully!</p>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </div>
      )}
    </form>
  );
};

export default UseForm;
