// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";
// import { zodResolver } from "@hookform/resolvers/zod";

// const FormSchema = z.object({
//   selectedValue: z.string().nonempty(),
// });

// export default function SelectOneForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(FormSchema),
//   });

//   const onSubmit = (data:any) => {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//       <div className="flex flex-col">
//         <label
//           htmlFor="selectedValue"
//           className="text-sm font-medium text-gray-700"
//         >
//           Select an option
//         </label>
//         <Select {...register("selectedValue")} name="selectedValue">
//           <SelectTrigger>
//             <SelectValue placeholder="Select an option" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="option1">Option 1</SelectItem>
//             <SelectItem value="option2">Option 2</SelectItem>
//             <SelectItem value="option3">Option 3</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.selectedValue && typeof errors.selectedValue === "string" && (
//           <p className="text-red-500 text-sm">{errors.selectedValue}</p>
//         )}
//       </div>
//       <Button type="submit">Submit</Button>
//     </form>
//   );
// }


// import { Link } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";
// import { Toast } from "../ui/toast";
// import { Toaster } from "../ui/toaster";

// const FormSchema = z.object({
//   email: z
//     .string({
//       required_error: "Please select an email to display.",
//     })
//     .email(),
// });

// export function SelectOneForm() {
//   const {
//     handleSubmit,
//     formState: { errors },
//   } = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   function onSubmit(data:any) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//       <div>
//         <label htmlFor="email" className="block font-medium text-gray-700">
//           Email
//         </label>
//         <Select defaultValue="" >
//           <SelectTrigger>
//             <SelectValue placeholder="Select a verified email to display" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="m@example.com">m@example.com</SelectItem>
//             <SelectItem value="m@google.com">m@google.com</SelectItem>
//             <SelectItem value="m@support.com">m@support.com</SelectItem>
//           </SelectContent>
//         </Select>
//         <p className="mt-2 text-sm text-gray-500">
//           You can manage email addresses in your{" "}
//           <Link to="/examples/forms">email settings</Link>.
//         </p>
//         <p className="text-red-500 text-sm">
//           {errors.email && errors.email.message}
//         </p>
//       </div>
//       <Button type="submit">Submit</Button>
//       <Toaster/>
//     </form>
//   );
// }



import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "./selectone"
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  subscription: z.enum(["full-month", "half-month", "trial"]),
});

type FormValues = {
  subscription: "full-month" | "half-month" | "trial";
};

export function SelectOneForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: FormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
      <FormField
        {...register("subscription")}
        name="subscription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription</FormLabel>
            <Select
              onChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-month">Full Month</SelectItem>
                <SelectItem value="half-month">Half Month</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage>{errors.subscription?.message}</FormMessage>
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}