
// import * as React from "react";
// import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
// import { CheckCircle } from "lucide-react";

// import { cn } from "@/lib/utils";

// const ButtonGroup = React.forwardRef<
//   React.ElementRef<typeof RadioGroupPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
// >(({ className, ...props }, ref) => {
//   return (
//     <RadioGroupPrimitive.Root
//       className={cn("flex gap-5", className)}
//       {...props}
//       ref={ref}
//     />
//   );
// });
// ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

// const ButtonGroupItem = React.forwardRef<
//   React.ElementRef<typeof RadioGroupPrimitive.Item>,
//   {

//     label: string;
//   } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
// >(({ className, label, ...props }, ref) => {
//   return (
//     <RadioGroupPrimitive.Item
//       ref={ref}
//       className={cn(
//         "border data-[state=checked]:bg-background text-center h-[125px] w-[125px] rounded-md focus:outline-none 2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <RadioGroupPrimitive.RadioGroupIndicator className="relative">
//         <div className="relative">
//           <div className="absolute -ml-2 -mt-[30px] ">
//             <CheckCircle className="text-primary" />
//           </div>
//         </div>
//       </RadioGroupPrimitive.RadioGroupIndicator>

//       <div className="flex flex-col justify-center">
//         <div className="text-sm pt-2">{label}</div>
//       </div>
//     </RadioGroupPrimitive.Item>
//   );
// });
// ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// export { ButtonGroup, ButtonGroupItem };
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-5", className)}
      {...props}
      ref={ref}
    />
  );
});
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "border text-center flex items-center justify-center lg:h-8 lg:w-12 lg:px-5 lg:py-4 lg:p-2 xl:h-10 xl:w-16 xl:px-4 xl:py-2 rounded-md focus:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:text-gray-400 data-[state=unchecked]:bg-white",
        className
      )}
      {...props}
    >
      <div className="text-sm">{label}</div>
    </RadioGroupPrimitive.Item>
  );
});
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonGroup, ButtonGroupItem };
