// // import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3"
// // const {
// //   VITE_AWS_S3_REGION,
// //   VITE_AWS_S3_ACCESS_KEY_ID,
// //   VITE_AWS_S3_SECRET_ACCESS_KEY,
// //   VITE_View_URL,
// //   VITE_AWS_S3_BUCKET_NAME,
// // } = import.meta.env;

// // const s3Client = new S3Client({
// //   region: VITE_AWS_S3_REGION as string,
// //   credentials: {
// //     accessKeyId: VITE_AWS_S3_ACCESS_KEY_ID as string,
// //     secretAccessKey:VITE_AWS_S3_SECRET_ACCESS_KEY as string,
// //   },
// // });

// // interface FileUploadParams {
// //   fileBuffer: Buffer;
// //   fileName: string;
// // }

// // export async function uploadFileToS3(
// //   fileBuffer: Buffer,
// //   fileName: string
// // ): Promise<string> {
// //   const params = {
// //     Bucket: VITE_AWS_S3_BUCKET_NAME,
// //     Key: fileName,
// //     Body: fileBuffer,
// //     ContentType: "image/jpg", 
// //   };
  
// //   const command = new PutObjectCommand(params);
// //   await s3Client.send(command);

// //   const url = `${VITE_View_URL}/${fileName}`;
// //   return url;
// // }

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//   region: import.meta.env.VITE_AWS_S3_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_S3_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY,
//   },
// });

// export async function uploadFileToS3(file: File): Promise<string> {
//   const params = {
//     Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
//     Key: file.name,
//     Body: file,
//     ContentType: file.type,
//   };

//   const command = new PutObjectCommand(params);
//   await s3Client.send(command);

//   const url = `${import.meta.env.VITE_View_URL}/${file.name}`;

//   return url;
// }
