import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { Check, ChevronDown } from "lucide-react";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { MultiSelect } from "../multiselect/multiselectCheckbox";

interface filtertypes {
  isOpen: boolean;
  setOpen: any;
  initialValue?: any;
  setFilter?: any;
  setSearchCriteria?: any;
  filterData?: any;
  filterDisplay?: any;
}

const TableFilters = ({
  isOpen,
  setOpen,
  initialValue,
  filterData,
  setFilter,
  setSearchCriteria,
  filterDisplay,
}: filtertypes) => {
  console.log({ filterData, initialValue });
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Separator className=" h-[1px] rounded-full my-2" />
          <div className="py-2 space-y-4">
            {filterDisplay &&
              filterDisplay?.map((element: any) => {
                if (element.type == "select") {
                  return (
                    <Select
                      name={element.name}
                      value={filterData[element.name]}
                      onValueChange={(value) => {
                        element.function(value);
                      }}
                    >
                      <SelectTrigger className="capitalize" floatingLabel={element.label}>
                        <SelectValue placeholder={"Select " + element.label} />
                      </SelectTrigger>
                      <SelectContent className="capitalize">
                        {element.options?.map((st: any, index: number) => (
                          <SelectItem key={index} value={String(st.id)}>
                            {st.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }
                if (element.type == "combobox") {
                  return (
                    <Combobox
                      defaultValue={filterData[element.name]}
                      setFilter={element.function}
                      list={element.options}
                      name={element.name}
                      label={element.label}
                    />
                  );
                }
                if (element.type == "percentage") {
                  return (
                    <FloatingLabelInput
                      type={"number"}
                      min={0}
                      max={100}
                      name={element.name}
                      label={element.label}
                      onChange={element.function}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (Number(target.value) > 100) {
                          target.value = "100";
                        }
                      }}
                    />
                  );
                }
                if (element.type == "number") {
                  return (
                    <FloatingLabelInput
                      defaultValue={filterData[element.name]}
                      type={"number"}
                      min={0}
                      id={element.name}
                      name={element.name}
                      label={element.label}
                      onChange={element.function}
                    />
                  );
                }

                if (element.type === "multiselect") {
                  return (
                    <MultiSelect
                      floatingLabel={element.label.replace(/_/g, " ")}
                      key={element.label}
                      options={element.options}
                      defaultValue={filterData[element.name] || []} // Ensure defaultValue is always an array
                      onValueChange={(selectedValues) => {
                        console.log("Selected Values: ", selectedValues); // Debugging step
                        element.function(selectedValues); // Pass selected values to state handler
                      }}
                      placeholder={"Select " + element.label.replace(/_/g, " ")}
                      variant="inverted"
                      maxCount={1}
                      className="capitalize focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                  );
                }
              })}

            <div className="gap-3 flex">
              <Button
                type="submit"
                variant={"outline"}
                onClick={() => {
                  setFilter({});
                  setSearchCriteria(initialValue);
                  setOpen(false);
                }}
                className="border-primary  text-black gap-1 font-semibold w-full"
              >
                Reset
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  setSearchCriteria((prev: any) => ({
                    ...prev,
                    ...filterData,
                    offset: 0,
                    sort_key: "id",
                    sort_order: "desc",
                  }));
                  setOpen(false);
                  console.log("FIltered Data", filterData);
                }}
                className="bg-primary  text-black space-x-2 font-semibold w-full"
              >
                <i className="fa fa-filter "></i>
                Apply filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface comboboxType {
  list?: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
  setFilter?: any;
  name?: string;
  label?: string;
}

function Combobox({ list, setFilter, name, defaultValue, label }: comboboxType) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(list?.find((list) => list.value == defaultValue)?.label ?? "");
  console.log({ value, list, defaultValue });
  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <div className="relative">
          <span className="absolute p-0 text-[11px] left-2 -top-1.5 px-1 bg-white capitalize">{label}</span>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="border-[1px] hover:bg-transparent w-full justify-between font-normal capitalize"
          >
            {value
              ? list && list?.find((list) => list.label == value)?.label
              : "Select " + label?.toLowerCase()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>

      </PopoverTrigger>
      <PopoverContent className="w-[330px] max-h-28 p-0" side="bottom">
        <Command>
          <CommandInput placeholder={`Search ${label}`} />
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandList className="custom-scrollbar">
            <CommandGroup>
              {list &&
                list?.map((item) => (
                  <CommandItem
                    className="capitalize"
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      console.log({ currentValue, value });
                      setValue(currentValue == value ? "" : currentValue);
                      setFilter(
                        list &&
                        list?.find((list) => list.label === currentValue)
                          ?.value
                      );
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

export default TableFilters;
