import React, { useState } from "react";
import { z } from "zod";

// Import the uploadCognitoImage function
import { UploadCognitoImage } from "@/utils/lib/s3Service";
// Define the Zod schema for image URL and name validation
const imageUrlSchema = z.object({
  url: z.string(),
  name: z.string().default("John Doe"),
});

interface ImageData {
  url: string;
  name: string;
}

const UseForm: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
      if (validTypes.includes(file.type)) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
       
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (event: 
    React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedImage) {
      try {
        const geturl = await UploadCognitoImage(selectedImage);
        console.log("URL data required and add the data", geturl.data);
        const url = geturl?.location as string;
        // Validate the URL and name using the Zod schema
        const schema = imageUrlSchema.safeParse({ url });
        console.log("updated the image", schema);
      } catch (err) {
        console.error("Upload failed:", err);
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
    </form>
  );
};

export default UseForm;
