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
import { DatePickerWithRange } from "../date-range/date-rangePicker";
import { toast } from "../use-toast";
import { TimeOperatorSelector } from "./time-operator-selector";

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
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
        <SheetContent className="!h-screen">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Separator className=" h-[1px] rounded-full my-2" />
          <div className="py-2 space-y-4 ">
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
                      <SelectTrigger
                        className="capitalize w-full"
                        floatingLabel={element.label}
                      >
                        <SelectValue placeholder={"Select " + element.label} />
                      </SelectTrigger>
                      <SelectContent className="capitalize">
                        {element.options?.map((st: any, index: number) => (
                          <SelectItem key={index} value={String(st.value)}>
                            {st.label}
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
                if (element.type == "date-range") {
                  return (
                    <div className="w-full " key={element.name}>
                      <DatePickerWithRange
                        name={element.name}
                        value={{
                          start_date: filterData.start_date, // Access start_date directly
                          end_date: filterData.end_date, // Access end_date directly
                        }}
                        onValueChange={(dates) => {
                          // Call your updated function
                          element.function(dates);
                        }}
                        label={"Select " + element.label}
                        className="w-full" // Ensure full width
                      />
                    </div>
                  );
                }

                if (element.type == "percentage") {
                  return (
                    <FloatingLabelInput
                      type={"number"}
                      min={0}
                      defaultValue={filterData[element.name]}
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
                        element.function(selectedValues); // Pass selected values to state handler
                      }}
                      placeholder={"Select " + element.label.replace(/_/g, " ")}
                      variant="inverted"
                      maxCount={1}
                      className="capitalize border-checkboxborder border-[1px]"
                    />
                  );
                }

                if (element.type === "time_opt") {
                  return (
                    <TimeOperatorSelector
                      key={element.name}
                      name={element.name}
                      label={element.label}
                      value={
                        filterData[element.name] || { operator: "", time: "" }
                      }
                      options={element.options}
                      onChange={(value) => {
                        element.function(value);
                      }}
                    />
                  );
                }
              })}
            <div className="gap-3 flex ">
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
                  const dateRangeFilter = filterDisplay?.find(
                    (element: any) => element.type == "date-range"
                  );

                  let isValidDateRange = true; // To track the validity of the date range

                  if (dateRangeFilter) {
                    const { start_date, end_date } = filterData;

                    // If one date is present and the other is missing, show the error toast
                    if (
                      (start_date && !end_date) ||
                      (!start_date && end_date)
                    ) {
                      toast({
                        variant: "destructive",
                        description: "Must be a valid date range.",
                      });
                      isValidDateRange = false; // Set to false if invalid
                      return;
                    }

                    // If both dates are missing, log the message and skip applying the date range
                    if (!start_date && !end_date) {
                      isValidDateRange = false; // Set to false if no date range is provided
                    }
                  }

                  // Proceed with applying other filters regardless of the date range validity
                  setSearchCriteria((prev: any) => ({
                    ...prev,
                    ...filterData, // Apply all filter data
                    ...(isValidDateRange
                      ? {}
                      : { start_date: undefined, end_date: undefined }), // Only apply date range if valid
                    offset: 0,
                    sort_key: "id",
                    sort_order: "desc",
                  }));

                  // Close the side panel after applying filters
                  setOpen(false);
                }}
                className="bg-primary text-black space-x-2 font-semibold w-full"
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

function Combobox({
  list,
  setFilter,
  name,
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
