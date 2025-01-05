import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex font-poppins    items-center justify-center rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-secondary",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "relative flex h-[2.5rem] w-full items-center justify-center space-x-2 text-[.9rem] font-normal bg-primary bg-clip-text text-transparent transition-transform duration-200 border border-primary",
        // "border-2 border-[#C53643] bg-transparent hover:bg-[#e87983] hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        solid:
          "relative flex h-[2.5rem] w-full items-center justify-center space-x-2 text-[.9rem] text-white transition-transform duration-200 bg-primary hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  access?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      type = "button",
      access = true,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      access && (
        <Comp
          type={type}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
