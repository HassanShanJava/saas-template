import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

interface Props {
  name: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommonInput: React.FC<Props> = ({
  name,
  placeholder,
  type,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center custom-box-shadow w-full gap-2 px-2 py-2 rounded-md border border-checkboxborder focus-within:outline-none focus-within:ring-2 focus-within:ring-QtextPrimary">
      <FontAwesomeIcon icon={faEnvelope} className="text-QtextPrimary size-6" />
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full outline-none bg-transparent placeholder:text-[#e2dfdf]"
      />
    </div>
  );
};

export default CommonInput;
