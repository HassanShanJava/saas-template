import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check, ChevronDownIcon } from "lucide-react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";

type MultiSelectorProps = {
  values: { id: number; name: string }[];
  onValuesChange: (value: { id: number; name: string }[]) => void;
  maxVisible?: number; // Number of items to display before showing the "more" text
} & React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

interface MultiSelectContextProps {
  value: { id: number; name: string }[];
  onValueChange: (value: { id: number; name: string }) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values,
  onValuesChange,
  maxVisible = 2, // Default number of items to display
  className,
  children,
  ...props
}: MultiSelectorProps) => {
  const value = Array.isArray(values) ? values : [];
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  const onValueChangeHandler = useCallback(
    (val: { id: number; name: string }) => {
      const valId = val.id;
      if (value.some((item) => item.id === valId)) {
        onValuesChange(value.filter((item) => item.id !== valId));
      } else {
        onValuesChange([...value, val]);
      }
    },
    [value, onValuesChange]
  );

  const visibleItems = value.slice(0, maxVisible);
  const hiddenCount = value.length - maxVisible;

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
      }}
    >
      <Command className={cn("flex flex-col", className)} {...props}>
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { value, onValueChange } = useMultiSelect();

  const visibleItems = value.slice(0, 2);
  const hiddenCount = value.length - 2;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-1 p-1 py-2 border border-muted rounded-lg bg-background",
        className
      )}
      {...props}
    >
      {visibleItems.map((item) => (
        <Badge key={item.id} className="flex items-center gap-1">
          <span>{item.name}</span>
          <button onClick={() => onValueChange(item)} className="ml-1">
            <RemoveIcon className="h-4 w-4" />
          </button>
        </Badge>
      ))}
      {hiddenCount > 0 && <Badge className="ml-1">+{hiddenCount} more</Badge>}
      <ChevronDownIcon className="ml-auto h-5 w-5" />
    </div>
  );
});

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect();
  return (
    <div ref={ref} className="relative">
      {open && children}
    </div>
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList ref={ref} className={cn("p-2 flex flex-col", className)}>
      {children}
    </CommandList>
  );
});

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: { id: number; name: string } } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, ...props }, ref) => {
  const { value: Options, onValueChange } = useMultiSelect();

  const isIncluded = Options.some((obj) => obj.id === value.id);

  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => onValueChange(value)}
      className={cn(
        "cursor-pointer flex justify-between",
        className,
        isIncluded && "opacity-50 cursor-default"
      )}
    >
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isIncluded}
          onChange={() => onValueChange(value)}
          className="form-checkbox"
        />
        <span>{value.name}</span>
      </label>
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
