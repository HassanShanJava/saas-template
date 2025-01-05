import React, { useEffect, useState } from "react";
import { FloatingLabelInput } from "../floatinglable/floating";
import { useDebounce } from "@/hooks/use-debounce";

type SearchCriteria = {
  limit: number;
  search_key?: string;
  offset: number;
  sort_key: string;
  sort_order: string;
};

type TableSearchFilterProps = {
  setSearchCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  placeHolder?: string;
};

const TableSearchFilter: React.FC<TableSearchFilterProps> = ({
  setSearchCriteria,
  placeHolder = "Search by Name",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce<string>(inputValue, 500);
  useEffect(() => {
    setSearchCriteria((prev) => {
      const newCriteria: SearchCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
        newCriteria.offset = 0;
        newCriteria.sort_key = "id";
        newCriteria.sort_order = "desc";
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
  }, [debouncedInputValue, setSearchCriteria]);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setInputValue(event.target.value);
  };

  const preventLeadingSpace: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    if (event.key === " " && !(event.target as HTMLInputElement).value) {
      event.preventDefault();
    }
  };
  return (
    <div className="flex items-center flex-1 space-x-2 mb-2 lg:mb-0">
      <div className="flex items-center relative w-auto">
        {/* search icon */}
        <i className="fa-solid fa-magnifying-glass size-4 text-gray-400 absolute left-1 z-10 ml-2"></i>
        <FloatingLabelInput
          id="search"
          placeholder={placeHolder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={preventLeadingSpace}
          className=" w-52 lg:w-64 pl-8 text-sm placeholder:text-sm text-gray-400 h-8"
        />
      </div>
    </div>
  );
};

export default TableSearchFilter;
