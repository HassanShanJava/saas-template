import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Assuming you have these components
import { Separator } from "@/components/ui/separator"; // Assuming this is imported
import { Button } from "@/components/ui/button"; // Assuming your button component
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

type PaginationProps = {
  limit: number;
  offset: number;
  totalItems: number;
  onLimitChange: (newLimit: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
  limit,
  offset,
  totalItems,
  onLimitChange,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
}) => {
  const isLastPage = offset + limit >= totalItems;

  return (
    <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Items per page:</p>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px] !border-none shadow-none">
              <SelectValue>{limit}</SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator
          orientation="vertical"
          className="h-11 w-[1px] bg-gray-300"
        />
        <span>{`${offset + 1} - ${Math.min(offset + limit, totalItems)} of ${totalItems} Items`}</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center space-x-2">
          <Separator
            orientation="vertical"
            className="hidden lg:flex h-11 w-[1px] bg-gray-300"
          />

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-none !disabled:cursor-not-allowed"
            onClick={onFirstPage}
            disabled={offset === 0}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>

          <Separator
            orientation="vertical"
            className="h-11 w-[0.5px] bg-gray-300"
          />

          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
            onClick={onPrevPage}
            disabled={offset === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Separator
            orientation="vertical"
            className="h-11 w-[1px] bg-gray-300"
          />

          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
            onClick={onNextPage}
            disabled={isLastPage}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <Separator
            orientation="vertical"
            className="hidden lg:flex h-11 w-[1px] bg-gray-300"
          />

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-none disabled:cursor-not-allowed"
            onClick={onLastPage}
            disabled={isLastPage}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
