import React, { useState } from "react";
import { UploadCognitoImage, deleteCognitoImage } from "@/utils/lib/s3Service";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [deleteFileName, setDeleteFileName] = useState<string>("");
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

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

  // Handle file delete
  const handleDelete = async () => {
    if (!deleteFileName) {
      setDeleteStatus("Please enter a file name to delete.");
      return;
    }

    try {
      const result = await deleteCognitoImage(deleteFileName);
      if (result.success) {
        setDeleteStatus(result.message);
      } else {
        setDeleteStatus(`File deletion failed: ${result.message}`);
      }
    } catch (error: any) {
      setDeleteStatus(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div>
      <div>
        <h2>Upload File</h2>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload}>Upload</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>

      <div>
        <h2>Delete File</h2>
        <input
          type="text"
          value={deleteFileName}
          onChange={(e) => setDeleteFileName(e.target.value)}
          placeholder="Enter file name to delete"
        />
        <button onClick={handleDelete}>Delete</button>
        {deleteStatus && <p>{deleteStatus}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
