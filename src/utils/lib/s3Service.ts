import { v4 as uuidv4 } from "uuid";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { VITE_POOl_id, VITE_AWS_S3_BUCKET_NAME, VITE_AWS_S3_REGION } =
  import.meta.env;

const region = VITE_AWS_S3_REGION as string;
const IdentityPoolId = VITE_POOl_id as string;
const s3BucketName = VITE_AWS_S3_BUCKET_NAME as string;

const cognitoClient = new CognitoIdentityClient({ region });

const s3Client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: cognitoClient,
    identityPoolId: IdentityPoolId,
  }),
});

export const UploadCognitoImage = async (file: File) => {
  try {
    const isAllowedImageType =
      file?.type === "image/png" ||
      file?.type === "image/jpeg" ||
      file?.type === "image/jpg" ||
      file?.type === "image/gif";

    if (!isAllowedImageType) {
      throw new Error(
        "Unsupported file type. Only PNG, JPG/JPEG, and GIF are allowed."
      );
    }

    // Generate a unique file name using UUID
    const fileName = `${uuidv4()}-${file?.name}`;

    const uploadParams = {
      Bucket: s3BucketName,
      Key: fileName,
      ContentType: file?.type,
      Body: file,
    };

    // Create and send the upload command to S3
    const command = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(command);

    console.log({ data });

    return {
      success: true,
      data: fileName,
      location: `https://${s3BucketName}.s3.${region}.amazonaws.com/${fileName}`,
    };
  } catch (error: any) {
    console.log({ error });
    return { success: false, message: error?.message };
  }
};
