import { useState } from "react";

type PaginationParams = {
  limit?: number;
  totalRecords: number;
};

const usePagination = ({ limit = 10, totalRecords }: PaginationParams) => {
  const [searchCriteria, setSearchCriteria] = useState({
    limit,
    offset: 0,
  });

  const handleLimitChange = (newLimit: number) => {
    setSearchCriteria((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0,
    }));
  };

  const handleNextPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const handlePrevPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: Math.max(prev.offset - prev.limit, 0),
    }));
  };

  const handleFirstPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: 0,
    }));
  };

  const handleLastPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: totalRecords - prev.limit,
    }));
  };

  const isLastPage = searchCriteria.offset + searchCriteria.limit >= totalRecords;

  return {
    searchCriteria,
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  };
};

export default usePagination;
