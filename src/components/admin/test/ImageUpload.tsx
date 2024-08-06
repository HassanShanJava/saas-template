import React, { useState } from "react";
import { UploadCognitoImage } from "@/utils/lib/s3Service";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Get the first selected file
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    try {
      const result = await UploadCognitoImage(file);
      if (result.success) {
        setUploadStatus(`File uploaded successfully: ${result.location}`);
      } else {
        setUploadStatus(`File upload failed: ${result.message}`);
      }
    } catch (error: any) {
      setUploadStatus(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
