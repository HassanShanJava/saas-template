import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import ""
interface PhoneInputWithFloatingLabelProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const PhoneInputWithFloatingLabel = React.forwardRef<
  HTMLInputElement,
  PhoneInputWithFloatingLabelProps
>(({ id, label, value, onChange }, ref) => {
  return (
    <div className="phone-input-wrapper">
      <PhoneInput
        id={id}
        placeholder=" "
        value={value}
        onChange={onChange}
        className="peer"
        ref={ref as any} // type adjustment for PhoneInput
      />
      <Label
        htmlFor={id}
        className={cn(
          "phone-input-label peer-focus:text-[#525167] peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        )}
      >
        {label}
      </Label>
    </div>
  );
});
PhoneInputWithFloatingLabel.displayName = "PhoneInputWithFloatingLabel";

export default PhoneInputWithFloatingLabel;
