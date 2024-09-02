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
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";

interface exercisefiltertypes {
  isOpen: boolean;
  setOpen: any;
  initialValue?: any;
  setFilter: (filter: any) => void;
  setSearchCriteria: (criteria: any) => void;
  filterData: any;
  filterDisplay: any;
}

const ExerciseFilters = ({
  isOpen,
  setOpen,
  initialValue,
  filterData,
  setFilter,
  setSearchCriteria,
  filterDisplay,
}: exercisefiltertypes) => {
  function handleFilterChange(field: string, value: any) {
    setFilter((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Separator className="h-[1px] rounded-full my-2" />
          <div className="py-2 space-y-4">
            {filterDisplay &&
              filterDisplay?.map((element: any) => {
                if (element.type == "select") {
                  return (
                    <Select
                      key={element.label}
                      name={element.label}
                      value={filterData[element.label]}
                      onValueChange={(value) => {
                        handleFilterChange(element.label, value);
                      }}
                    >
                      <SelectTrigger
                        floatingLabel={element.label
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      >
                        <SelectValue
                          placeholder={
                            "Select " +
                            element.label
                              .replace(/_/g, " ") // Replace underscores with spaces
                              .toLowerCase() // Convert to lowercase
                              .replace(/(?:^|\s)\S/g, (match: string) =>
                                match.toUpperCase()
                              )
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {element.options?.map((st: any, index: number) => (
                          <SelectItem key={index} value={String(st.value)}>
                            {st.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                if (element.type === "multiselect") {
                  return (
                    <MultiSelect
                      floatingLabel={element.name
                        .replace(/_/g, " ")
                        .toUpperCase()}
                      key={element.label}
                      options={element.options}
                      defaultValue={filterData[element.label] || []} // Ensure defaultValue is always an array
                      onValueChange={(selectedValues) => {
                        console.log("Selected Values: ", selectedValues); // Debugging step
                        handleFilterChange(element.label, selectedValues); // Pass selected values to state handler
                      }}
                      placeholder={
                        "Select " +
                        element.name
                          .replace(/_/g, " ")
                          .toLowerCase() // Convert to lowercase
                          .replace(/(?:^|\s)\S/g, (match: string) =>
                            match.toUpperCase()
                          )
                      }
                      variant="inverted"
                      maxCount={1}
                      className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                className="border-primary text-black gap-1 font-semibold w-full"
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
                    sort_key:"id",
                    sort_order: "desc",
                  }));
                  setOpen(false);
                }}
                className="bg-primary text-black space-x-2 font-semibold w-full"
              >
                <i className="fa fa-filter"></i>
                Apply filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ExerciseFilters;
