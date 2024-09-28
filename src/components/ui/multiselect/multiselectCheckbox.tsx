import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea, ScrollBar } from "../scroll-area";
import { toast } from "@/components/ui/use-toast";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps extends VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: (string | number)[]) => void;
  defaultValue: (string | number)[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  width?: string | number;
  floatingLabel?: string; // Add this line
  labelClassname?: string; // Add this line
  dotruncate?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      width,
      floatingLabel,
      labelClassname,
      dotruncate = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<(string | number)[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(defaultValue);
      }
    }, [defaultValue]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string | number) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (!options?.length) {
        return; // Return early if there are no options available
      }
      if (selectedValues?.length === options?.length) {
        handleClear();
      } else {
        const allValues = options?.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <div className="relative">
        {floatingLabel && (
          <label
            className={cn(
              "absolute top-1 left-2",
              {
                "-top-2  px-1 mx-1 text-xs text-gray-800   bg-white": !false,
              },
              labelClassname
            )}
          >
            {floatingLabel}
          </label>
        )}
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={true}
        >
          <PopoverTrigger asChild className="whitespace-nowrap ">
            <Button
              ref={ref}
              {...props}
              onClick={handleTogglePopover}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit",
                className
              )}
              style={{ width }}
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center">
                    {selectedValues?.slice(0, maxCount).map((value) => {
                      const option = options?.find((o) => o.value === value);
                      const IconComponent = option?.icon;
                      return (
                        <Badge
                          key={value}
                          className={cn(
                            "bg-gray-200 text-black",
                            multiSelectVariants({ variant })
                          )}
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 mr-2" />
                          )}
                          <span
                            className={cn(
                              `${dotruncate ? "truncate" : ""}`,
                              "max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                            )}
                          >
                            {option?.label}
                          </span>

                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Separator
                      orientation="vertical"
                      className="flex min-h-6 h-full"
                    />
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto [&>span]:line-clamp-1">
                  <span className="text-base lg:text-sm text-gray-800 font-normal mx-3 sm:text-xs">
                    {placeholder}
                  </span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-auto min-w-full max-w-80"
            align="start"
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
            style={{ width }}
          >
            <Command>
              <CommandInput
                placeholder="Search..."
                onKeyDown={handleInputKeyDown}
              />
              <ScrollArea>
                <ScrollBar orientation="vertical" />
                <CommandList className="custom-scrollbar max-h-52">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key="select-all"
                      onSelect={toggleAll}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValues?.length === options?.length
                            ? "bg-primary text-primary-foreground"
                            : ""
                        )}
                      >
                        <CheckIcon
                          className={cn(
                            "h-4 w-4",
                            selectedValues?.length === options?.length
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                      {selectedValues?.length === options?.length
                        ? "Deselect all"
                        : "Select all"}
                    </CommandItem>
                    <CommandSeparator />
                    {options && options.length ? (
                      options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => toggleOption(option.value)}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues.includes(option.value)
                                ? "bg-primary text-primary-foreground"
                                : ""
                            )}
                          >
                            <CheckIcon
                              className={cn(
                                "h-4 w-4",
                                selectedValues.includes(option.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </div>
                          {option.icon && (
                            <option.icon className="h-4 w-4 mr-2" />
                          )}
                          {option.label}
                        </CommandItem>
                      ))
                    ) : (
                      <div className="flex justify-center items-center">
                        <p className="text-sm ">No available options</p>
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
