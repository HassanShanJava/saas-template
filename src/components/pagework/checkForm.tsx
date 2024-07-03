// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { uploadFileToS3 } from "@/services/s3Upload";
// import { Button } from "@/components/ui/button";

// // Zod schema for the form
// const ImageSchema = z.object({
//   image: z.string().url(),
// });

// interface FormData {
//   image: string;
// }

// const ImageUpload: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       image: "", // Provide a default value for the image field
//     },
//   });

//   const [fileUrl, setFileUrl] = useState<string>("");
//   const [errorText, setErrorText] = useState<string>("");

//   // Function to handle file selection and upload
//   const handleSelectImage = async () => {
//     try {
//       const selectedFile = await selectFile();
//       if (selectedFile) {
//         const buffer = Buffer.from(await selectedFile.arrayBuffer());
//         const url = await uploadFileToS3(buffer, selectedFile.name);
//         setFileUrl(url);
//         setValue("image", url); // Set the image URL in the form
//         setErrorText("");
//       }
//     } catch (error) {
//       setErrorText("File upload failed.");
//     }
//   };

//   // Function to simulate file selection (for demo purposes)
//   const selectFile = async (): Promise<File | undefined> => {
//     return new Promise((resolve, reject) => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.onchange = (event) => {
//         const file = (event.target as HTMLInputElement).files?.[0];
//         if (file) {
//           resolve(file);
//         } else {
//           reject(new Error("No file selected"));
//         }
//       };
//       input.click(); // Simulate click to open file picker
//     });
//   };

//   // Function to handle form submission
//   const onSubmit = async (data: FormData) => {
//     try {
//       const isValid = await ImageSchema.safeParseAsync(data);
//       if (!isValid.success) {
//         throw new Error("Invalid data");
//       }

//       // Handle your form submission, e.g., save to backend
//       console.log("Submitted:", data);
//     } catch (error:any) {
//       setErrorText(error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* Button to select image */}
//       <Button type="button" onClick={handleSelectImage}>
//         Select Image
//       </Button>

//       {/* Display uploaded image if available */}
//       {fileUrl && (
//         <div>
//           <p>Uploaded Image:</p>
//           <img
//             src={fileUrl}
//             alt="Uploaded"
//             style={{ maxWidth: "100%", height: "auto" }}
//           />
//         </div>
//       )}

//       {/* Display validation error message */}
//       {errors.image && <p>{errors.image.message}</p>}

//       {/* Display general error message */}
//       {errorText && <p>{errorText}</p>}

//       {/* Submit button */}
//       <Button type="submit">Submit</Button>
//     </form>
//   );
// };

// export default ImageUpload;

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
//   import { Toaster } from "@/components/ui/toaster";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";

// // Updated schema with id included
// const FormSchema = z.object({
//   email: z
//     .string({
//       required_error: "Please select an email to display.",
//     }),
// });

// export default function ImageUpload() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log("value",data)
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   function submit(data:any){
//     console.log(data)
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(submit)} className="w-2/3 space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="1">m@example.com</SelectItem>
//                   <SelectItem value="2">m@google.com</SelectItem>
//                   <SelectItem value="3">m@support.com</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormDescription>
//                 You can manage email addresses in your{" "}
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//       <Toaster />
//     </Form>
//   );
// }

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Toaster } from "@/components/ui/toaster";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";

// // Email options array
// const emailOptions = [
//   { email: "m@example.com", id: "1" },
//   { email: "m@google.com", id: "2" },
//   { email: "m@support.com", id: "3" },
// ];

// // Updated schema with id included
// const FormSchema = z.object({
//   email: z.string({
//     required_error: "Please select an email to display.",
//   }),
// });

// export default function ImageUpload() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log("value", data);
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   function submit(data: any) {
//     console.log(data);
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(submit)} className="w-2/3 space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {emailOptions.map((option) => (
//                     <SelectItem key={option.id} value={option.id}>
//                       {option.email}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormDescription>
//                 You can manage email addresses in your{" "}
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//       <Toaster />
//     </Form>
//   );
// }
import React, { useState } from "react";
import { uploadFileToS3 } from "@/services/s3Upload";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadFileToS3(file);
      setFileUrl(url);
      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
    }
  };

  return (
    <>
      <h1>Upload Files to S3 Bucket</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {fileUrl && (
        <div>
          <h2>Uploaded File</h2>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </>
  );
};

export default UploadForm;
