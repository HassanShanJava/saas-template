import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../textarea";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface FloatingLabelInputProps
  extends InputProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoComplete?:string;
}

const FloatingInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingLabelInputProps
>(({ className, type, ...props }, ref) => {
  if (type === "textarea") {
    return (
      <Textarea
        placeholder=" "
        className={cn(
          "peer",
          "flex  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <Input
      placeholder=" "
      type={type}
      className={cn("peer", className)}
      ref={ref as React.Ref<HTMLInputElement>}
      {...props}
    />
  );
});
FloatingInput.displayName = "FloatingInput";

interface FloatingLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  isTextarea?: boolean;
}

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FloatingLabelProps
>(({ className, isTextarea, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary font-poppins peer-focus:dark:secondary absolute start-2 z-10 origin-[0] scale-75 transform bg-background px-2 text-sm text-gray-400 duration-300",
        isTextarea
          ? "peer-placeholder-shown:top-[13%] peer-placeholder-shown:-translate-y-[13%] peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
          : "top-2 -translate-y-4 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, error, type, rows, ...props }, ref) => {
  const isTextarea = type === "textarea";

  return (
    <div className='font-poppins '>
      <div className="relative">
        <FloatingInput ref={ref} id={id} type={type} rows={rows} {...props} />
        <FloatingLabel htmlFor={id} isTextarea={isTextarea}>
          {label}
        </FloatingLabel>
      </div>
      {error && (
        <span className="text-destructive block !mt-[5px] text-[12px]">
          {error}
        </span>
      )}
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingInput, FloatingLabel, FloatingLabelInput };
