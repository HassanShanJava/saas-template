import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number" && (e.key === "-" || e.key === "+")) {
        e.preventDefault();
      }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (type === "number") {
        const target = e.target as HTMLInputElement;
        const value = target.value;

        // Regex to match numbers with up to 2 decimal places
        const regex = /^\d*\.?\d{0,2}$/;

        if (!regex.test(value)) {
          target.value = value.slice(0, value.length - 1);
        }
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border placeholder:text-sm border-input bg-background placeholder:font-normal px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
