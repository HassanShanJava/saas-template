import { type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sortKey: string; // Key to identify the column for sorting
  toggleSortOrder: (key: string, currentOrder: string) => void; // Function to toggle sort order
  searchCriteria: { sort_key: string; sort_order: string }; // Current search criteria
  sortable?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sortKey,
  toggleSortOrder,
  searchCriteria,
  sortable = true,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
  const isSorted =
    searchCriteria.sort_key && searchCriteria?.sort_key === sortKey;
  const isAsc = isSorted && searchCriteria.sort_order === "asc";
  const isDesc = isSorted && searchCriteria.sort_order === "desc";

  const handleToggleSort = () => {
    if (!sortable) return; // Skip toggling for non-sortable columns

    const nextSortOrder = isAsc ? "desc" : "asc";
    toggleSortOrder(sortKey, nextSortOrder);
  };

  return (
    <div
      className={cn(
        "font-poppins flex items-center space-x-2",
        { "cursor-pointer": sortable }, // Visual hint for non-sortable columns
        className
      )}
      role="button"
      tabIndex={0}
      onClick={handleToggleSort}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggleSort();
        }
      }}
      aria-label={(() => {
        if (!sortable) return `Not sortable`;
        if (isDesc)
          return `Sorted descending. Press Enter or Space to clear sorting.`;
        if (isAsc)
          return `Sorted ascending. Press Enter or Space to sort descending.`;
        return `Not sorted. Press Enter or Space to sort ascending.`;
      })()}
    >
      <span className="text-nowrap">{title}</span>
      {sortable &&
        (() => {
          if (isDesc) {
            return (
              <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            );
          } else if (isAsc) {
            return <ArrowUpIcon className="ml-2 h-4 w-4" aria-hidden="true" />;
          } else {
            return (
              <ChevronsUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
            );
          }
        })()}
    </div>
  );
}
