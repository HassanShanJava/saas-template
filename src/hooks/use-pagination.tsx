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
  const lastPageOffset = Math.max(
    0,
    Math.floor((totalRecords - 1) / searchCriteria.limit) * searchCriteria.limit
  );
  const isLastPage = searchCriteria.offset >= lastPageOffset;

  const handleLimitChange = (newLimit: number) => {
    setSearchCriteria((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0, // Reset offset on limit change
    }));
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setSearchCriteria((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const handlePrevPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  const handleFirstPage = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      offset: 0,
    }));
  };

  const handleLastPage = () => {
    if (!isLastPage) {
      setSearchCriteria((prev) => ({
        ...prev,
        offset: lastPageOffset,
      }));
    }
  };

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
