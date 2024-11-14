import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "../button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";


interface ComboboxType {
    list?: {
        label: string;
        value: string;
    }[];
    defaultValue?: string;
    setFilter?: any;
    name?: string;
    label?: string;
}
export default function Combobox({
    list,
    setFilter,
    defaultValue,
    label,
}: ComboboxType) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(
        list?.find((list) => list.value == defaultValue)?.label ?? ""
    );
    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <span className="absolute p-0 text-[11px] left-2 -top-1.5 px-1 bg-white capitalize">
                        {label}
                    </span>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="border-[1px] hover:bg-transparent w-full justify-between font-normal capitalize"
                    >
                        {value
                            ? list && list?.find((list) => list.value == value)?.label
                            : "Select " + label?.toLowerCase()}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[330px] max-h-28 p-0 " side="bottom">
                <Command>
                    <CommandInput placeholder={`Search ${label}`} />
                    <CommandEmpty>No list found.</CommandEmpty>
                    <CommandList className="custom-scrollbar shadow-sm">
                        <CommandGroup>
                            {list &&
                                list?.map((item) => (
                                    <CommandItem
                                        className="capitalize"
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue == value ? "" : currentValue);
                                            setFilter(currentValue == value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item.label ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

