import { useState } from "react";

type PaginationParams<T> = {
  totalRecords: number;
  searchCriteria: T;
  setSearchCriteria: React.Dispatch<React.SetStateAction<T>>;
};

const usePagination = <T extends { limit: number; offset: number }>({
  totalRecords,
  searchCriteria,
  setSearchCriteria,
}: PaginationParams<T>) => {
  const handleLimitChange = (newLimit: number) => {
    setSearchCriteria((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0, // Reset offset on limit change
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

  const isLastPage =
    searchCriteria.offset + searchCriteria.limit >= totalRecords;

  return {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  };
};

export default usePagination;
