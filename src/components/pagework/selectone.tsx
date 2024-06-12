import React from "react";

interface SelectProps {
  onChange: (value: string) => void;
  value: string;
  children:React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ onChange, value, children }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select onChange={handleChange} value={value}>
      {children}
    </select>
  );
};

export default Select;
