// // import { CheckIcon, ChevronsUpDown } from "lucide-react";

// // import * as React from "react";

// // import * as RPNInput from "react-phone-number-input";

// // import flags from "react-phone-number-input/flags";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Command,
// //   CommandEmpty,
// //   CommandGroup,
// //   CommandInput,
// //   CommandItem,
// //   CommandList,
// // } from "@/components/ui/command";
// // import { Input, InputProps } from "@/components/ui/input";
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@/components/ui/popover";

// // import { cn } from "@/lib/utils";
// // import { ScrollArea } from "../scroll-area";
// // impi
// // type PhoneInputProps = Omit<
// //   React.InputHTMLAttributes<HTMLInputElement>,
// //   "onChange" | "value"
// // > &
// //   Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
// //     onChange?: (value: RPNInput.Value) => void;
// //   };

// // const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
// //   React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
// //     ({ className, onChange, ...props }, ref) => {
// //       return (
// //         <RPNInput.default
// //           ref={ref}
// //           className={cn("flex", className)}
// //           flagComponent={FlagComponent}
// //           countrySelectComponent={CountrySelect}
// //           inputComponent={InputComponent}
// //           /**
// //            * Handles the onChange event.
// //            *
// //            * react-phone-number-input might trigger the onChange event as undefined
// //            * when a valid phone number is not entered. To prevent this,
// //            * the value is coerced to an empty string.
// //            *
// //            * @param {E164Number | undefined} value - The entered value
// //            */
// //           onChange={(value) => onChange?.(value || "")}
// //           {...props}
// //         />
// //       );
// //     }
// //   );
// // PhoneInput.displayName = "PhoneInput";

// // const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
// //   ({ className, ...props }, ref) => (
// //     <Input
// //       className={cn("rounded-e-lg rounded-s-none", className)}
// //       {...props}
// //       ref={ref}
// //     />
// //   )
// // );
// // InputComponent.displayName = "InputComponent";

// // type CountrySelectOption = { label: string; value: RPNInput.Country };

// // type CountrySelectProps = {
// //   disabled?: boolean;
// //   value: RPNInput.Country;
// //   onChange: (value: RPNInput.Country) => void;
// //   options: CountrySelectOption[];
// // };

// // const CountrySelect = ({
// //   disabled,
// //   value,
// //   onChange,
// //   options,
// // }: CountrySelectProps) => {
// //   const handleSelect = React.useCallback(
// //     (country: RPNInput.Country) => {
// //       onChange(country);
// //     },
// //     [onChange]
// //   );

// //   return (
// //     <Popover>
// //       <PopoverTrigger asChild>
// //         <Button
// //           type="button"
// //           variant={"outline"}
// //           className={cn("flex gap-1 rounded-e-none rounded-s-lg px-3")}
// //           disabled={disabled}
// //         >
// //           <FlagComponent country={value} countryName={value} />
// //           <ChevronsUpDown
// //             className={cn(
// //               "-mr-2 h-4 w-4 opacity-50",
// //               disabled ? "hidden" : "opacity-100"
// //             )}
// //           />
// //         </Button>
// //       </PopoverTrigger>
// //       <PopoverContent className="w-[300px] p-0">
// //         <Command>
// //           <CommandList>
// //             <ScrollArea className="h-72">
// //               <CommandInput placeholder="Search country..." />
// //               <CommandEmpty>No country found.</CommandEmpty>
// //               <CommandGroup>
// //                 {options
// //                   .filter((x) => x.value)
// //                   .map((option) => (
// //                     <CommandItem
// //                       className="gap-2"
// //                       key={option.value}
// //                       onSelect={() => handleSelect(option.value)}
// //                     >
// //                       <FlagComponent
// //                         country={option.value}
// //                         countryName={option.label}
// //                       />
// //                       <span className="flex-1 text-sm">{option.label}</span>
// //                       {option.value && (
// //                         <span className="text-foreground/50 text-sm">
// //                           {`+${RPNInput.getCountryCallingCode(option.value)}`}
// //                         </span>
// //                       )}
// //                       <CheckIcon
// //                         className={cn(
// //                           "ml-auto h-4 w-4",
// //                           option.value === value ? "opacity-100" : "opacity-0"
// //                         )}
// //                       />
// //                     </CommandItem>
// //                   ))}
// //               </CommandGroup>
// //             </ScrollArea>
// //           </CommandList>
// //         </Command>
// //       </PopoverContent>
// //     </Popover>
// //   );
// // };

// // const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
// //   const Flag = flags[country];

// //   return (
// //     <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
// //       {Flag && <Flag title={countryName} />}
// //     </span>
// //   );
// // };
// // FlagComponent.displayName = "FlagComponent";

// // export { PhoneInput };

// import  usePhoneValidation } from "react-phone-number-input";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Import the default styles for the phone input
import { z } from "zod";

const schema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});

type FormData = z.infer<typeof schema>;

const PhoneForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-3">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            // <PhoneInput
            //   value={value}
            //   onChange={onChange}
            //   defaultCountry="us"
            //   inputProps={{ name: "phone", id: "phone" }}
            // />
            <div className="relative">
              <span className="absolute p-0 text-xs left-[3.3rem] -top-2 px-1 bg-white z-10">
                Phone Number
              </span>
              <PhoneInput
                placeholder=" "
                value={value}
                onChange={onChange}
                
              />
            </div>
          )}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PhoneForm;
