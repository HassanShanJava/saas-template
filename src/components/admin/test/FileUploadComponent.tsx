// FileUploadComponent.tsx
import React, { useState, ChangeEvent } from "react";
import { uploadFileToS3 ,} from "@/services/s3Upload"; // adjust the path as needed

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadUrl("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFileToS3(file);
      setUploadUrl(url);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image to S3</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadUrl && (
        <p>
          File uploaded successfully! View it <a href={uploadUrl}>here</a>.
        </p>
      )}
    </div>
  );
};

export default FileUploadComponent;
