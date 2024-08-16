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

import { Check, ChevronsDown } from "lucide-react";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

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
                      <SelectTrigger floatingLabel={element.label}>
                        <SelectValue placeholder={"Select " + element.label} />
                      </SelectTrigger>
                      <SelectContent>
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
                      setFilter={element.function}
                      list={element.options}
                      name={element.name}
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
                      type={"number"}
                      min={0}
                      id={element.name}
                      name={element.name}
                      label={element.label}
                      onChange={element.function}
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
                  }));
                  setOpen(false);
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
  setFilter?: any;
  name?: string;
}

function Combobox({ list, setFilter, name }: comboboxType) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  console.log({ value, list });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value
            ? list && list?.find((list) => list.label === value)?.label
            : "Select " + name + "..."}
          <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[330px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}`} />
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandList className="custom-scrollbar">
            <CommandGroup>
              {list &&
                list?.map((item) => (
                  <CommandItem
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
                        value === item.value ? "opacity-100" : "opacity-0"
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
