import React, {
  useState,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { PhoneInput, PhoneInputRefType } from "react-international-phone";
import "react-international-phone/style.css";
import "./FloatingLabelInput.css"; // Import the CSS for styling

interface FloatingLabelInputProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultCountry?: string;
  rules?: any;
  error?: FieldError;
}

// Forwarding ref to make the component reusable and manage ref correctly
const FloatingLabelPhone = forwardRef<
  PhoneInputRefType,
  FloatingLabelInputProps
>(({ name, label, control, defaultCountry = "us", rules, error }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`floating-label-input ${isFocused ? "focused" : ""}`}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, onBlur } }) => (
          <>
            <PhoneInput
              ref={ref} // Pass the ref directly to PhoneInput
              value={value}
              onChange={onChange}
              defaultCountry={defaultCountry}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur(); // Trigger validation on blur
              }}
              inputProps={{ name }} // Exclude ref from inputProps
            />
            <label htmlFor={name} className="floating-label">
              {label}
            </label>
          </>
        )}
      />
      {error && <p className="error-message">{error.message}</p>}{" "}
      {/* Error message */}
    </div>
  );
});

FloatingLabelPhone.displayName = "FloatingLabelPhone";

export default FloatingLabelPhone;
