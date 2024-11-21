import React from "react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const CommonButton: React.FC<Props> = ({ title, type = "button", onClick }) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      className={`relative flex bg-red-600 h-[2.5rem] w-full items-center justify-center space-x-2 text-[.9rem] font-normal text-white transition-transform duration-200 hover:bg-gradient-to-t from-[#E14746] to-[#C53643] hover:scale-105`}
    >
      {title}
    </Button>
  );
};

export default CommonButton;
