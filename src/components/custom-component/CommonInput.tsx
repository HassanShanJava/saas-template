import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

interface Props {
  name: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: object; // To pass `react-hook-form`'s register prop
  error?: string; // Error message for the input field
}

const CommonInput: React.FC<Props> = ({
  name,
  placeholder,
  type,
  value,
  onChange,
  register,
  error,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex items-center custom-box-shadow w-full gap-2 px-2 py-2 rounded-md border ${
          error
            ? "border-red-500 focus-within:ring-red-500"
            : "border-checkboxborder focus-within:ring-QtextPrimary"
        } focus-within:outline-none focus-within:ring-2`}
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-QtextPrimary size-6"
        />
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...register}
          className="w-full h-full outline-none bg-transparent text-[white] placeholder:text-[#e2dfdf]"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CommonInput;
