import { generateQueryString } from "@/utils/helper";
import React from "react";

// Define the SearchCriteria type with flexible values.
type SearchCriteria = Record<
  string,
  string | number | (string | number)[] | null | undefined
>;

const useTableData = <T extends SearchCriteria>(initialCriteria: T) => {
  const [searchCriteria, setSearchCriteria] =
    React.useState<T>(initialCriteria);
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    setQuery(generateQueryString(searchCriteria));
  }, [searchCriteria]);

  // Define toggleSortOrder inside the hook
  const toggleSortOrder = (key: string, order: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      sort_key: key,
      sort_order: order,
    }));
  };

  return {
    searchCriteria,
    setSearchCriteria,
    query,
    toggleSortOrder,
  };
};

export default useTableData;
