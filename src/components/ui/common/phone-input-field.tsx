import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  inputcolor?: string;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  inputcolor
}) => {
  return (
    <div className="flex flex-col unique-parent">
      <PhoneInput
        country={"pk"}
        value={value}
        onChange={onChange}
        containerStyle={{
          width: "100%",
          height: "2.5rem",
          backgroundColor: "transparent",
          border: "1px solid hsl(var(--border-color-check))",
          borderRadius: "7px",
          display: "flex",
        }}
        inputStyle={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          color: inputcolor??"#000",
          fontSize: "16px",
        
        }}
        buttonClass="phone-input-dropdown"
        placeholder={placeholder}
        // countryCodeEditable={false}
      />
      
      {error && (
        <p className="text-destructive font-poppins block !mt-[5px] text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInputField;
