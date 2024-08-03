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

interface membersfiltertypes {
  isOpen: boolean;
  setOpen: any;
  initialValue?: any;
  setFilter?: any;
  setSearchCriteria?: any;
  filterData?: any;
  filterDisplay?: any;
}

const MemberFilters = ({
  isOpen,
  setOpen,
  initialValue,
  filterData,
  setFilter,
  setSearchCriteria,
  filterDisplay,
}: membersfiltertypes) => {
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

export default MemberFilters;
