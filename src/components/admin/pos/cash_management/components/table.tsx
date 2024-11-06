import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorType, RegisterSession } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { displayDate, displayDateTime, displayValue, roundToTwoDecimals } from "@/utils/helper";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { sessionMapper, downloadCSV } from "@/utils/helper";
import TableFilters from "@/components/ui/table/data-table-filter";
import { useGetAllRegisterSessionQuery } from "@/services/registerApi";
import { discrepancy } from "@/constants/cash_register";
import { formatDate } from "@/utils/helper";
import { DatePickerWithRange } from "@/components/ui/date-range/date-rangePicker";
import { Filter, Search } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";

interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
  start_date?: string;
  end_date?: string;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

export default function CashregisterViewTable() {
  const counter_number =
    useSelector((state: RootState) => state.counter?.counter_number) || 0;

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  const [searchCriteria, setSearchCriteria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilter] = useState<Record<string, any>>({});

  useEffect(() => {
    setSearchCriteria((prev) => {
      const newCriteria = { ...prev };

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
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCriteria]);

  useEffect(() => {
    const params = new URLSearchParams();
    // Iterate through the search criteria
    for (const [key, value] of Object.entries(searchCriteria)) {
      if (value !== undefined && value !== null && value !== "") {
        // Check if the value is an array
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val); // Append each array element as a separate query parameter
          });
        } else {
          params.append(key, value); // For non-array values
        }
      }
    }

    // Create the final query string
    const newQuery = params.toString();
    console.log({ newQuery });
    if (
      (searchCriteria.start_date && searchCriteria.end_date) ||
      (!searchCriteria.start_date && !searchCriteria.end_date)
    ) {
      setQuery(newQuery); // Update the query state for API call
    }
    // setQuery(newQuery); // Update the query state for API call
  }, [searchCriteria]);

  const toggleSortOrder = (key: string) => {
    setSearchCriteria((prev) => {
      const newSortOrder =
        prev.sort_key === key
          ? prev.sort_order === "desc"
            ? "asc"
            : "desc"
          : "desc";

      return {
        ...prev,
        sort_key: key,
        sort_order: newSortOrder,
      };
    });
  };

  const {
    data: registerSessionData,
    isLoading: isRegisterSessionLoading,
    refetch,
    error,
    isError,
  } = useGetAllRegisterSessionQuery(
    {
      counter_id: counter_number,
      query: query,
    },
    {
      skip: query == "",
    }
  );

  React.useEffect(() => {
    if (isError) {
      const typedError = error as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: typedError.data?.detail ?? "Internal Server Errors",
      });
    }
  }, [isError]);

  const cashregisterTableData = React.useMemo(() => {
    return Array.isArray(registerSessionData?.data)
      ? registerSessionData?.data
      : [];
  }, [registerSessionData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleExportSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedRows.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select one or more records to perform this action.",
      });
      return;
    }
    downloadCSV(selectedRows, "cash_register.csv", sessionMapper);
  };

  const columns: ColumnDef<RegisterSession>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sessionid",
      meta: "Session Id",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Session ID</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <p className="capitalize cursor-pointer">
                <span>{displayValue(row.original.id?.toString())}</span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "openningtime",
      meta: "Opening Time",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Opening Time</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("opening_time")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDateTime(row?.original.opening_time)}
          </div>
        );
      },
    },
    {
      accessorKey: "openingbalance",
      meta: "Opening Balance",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Opening Balance</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("opening_balance")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <p className="capitalize cursor-pointer">
                <span>
                  {roundToTwoDecimals(row.original.opening_balance as number)}
                </span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "closingtime",
      meta: "Closing Time",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Closing Time</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("closing_time")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDateTime(row?.original.closing_time)}
          </div>
        );
      },
    },
    {
      accessorKey: "closingbalance",
      meta: "Closing Balance",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Closing Balance</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("closing_balance")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <p className="capitalize cursor-pointer">
                <span>
                  {roundToTwoDecimals(row.original.closing_balance as number)}
                </span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "discrepancy",
      meta: "Discrepancy",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Discrepancy</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("discrepancy")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <p className="capitalize cursor-pointer">
                <span
                  className={`${row.original.discrepancy !== 0 ? "text-red-500" : "text-black"}`}
                >
                  {roundToTwoDecimals(row.original.discrepancy as number)}
                </span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "notes",
      meta: "Notes",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Notes</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("notes")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        console.log(row?.original?.notes, "row?.original?.notes");
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="capitalize cursor-pointer">
                      <span>
                        {displayValue(
                          `${row?.original?.notes}`.length > 15
                            ? `${row?.original?.notes}`.substring(0, 15) + "..."
                            : row?.original?.notes
                        )}
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize text-sm">
                      {displayValue(`${row?.original?.notes}`)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createddate",
      meta: "CreatedDate",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Created Date</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("created_date")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.created_date)}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdBy",
      meta: "CreatedBy",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Created By</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("created_by")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="capitalize cursor-pointer text-nowrap">
                      <span>
                        {displayValue(
                          `${row.original.created_by}`.length > 15
                            ? `${row.original.created_by}`.substring(0, 15) +
                                "..."
                            : `${row.original.created_by}`
                        )}
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize text-sm">
                      {displayValue(`${row?.original?.created_by}`)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // cashregisterTableData
  const table = useReactTable({
    data: cashregisterTableData as RegisterSession[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const totalRecords = registerSessionData?.filtered_counts || 0;

  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<searchCretiriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });
  const handleDiscrepancy = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      discrepancy: value,
    }));
  };

  const handleDateRange = (dates: {
    start_date: Date | undefined;
    end_date: Date | undefined;
  }) => {
    const formattedStartDate = dates.start_date
      ? formatDate(dates.start_date)
      : "";
    const formattedEndDate = dates.end_date ? formatDate(dates.end_date) : "";

    setFilter((prev) => ({
      ...prev,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    }));

    setSearchCriteria((prev: any) => ({
      ...prev,
      start_date: formattedStartDate || undefined,
      // Only set end_date if start_date is present
      end_date:
        formattedStartDate && !formattedEndDate ? undefined : formattedEndDate,
      offset: 0,
      sort_key: "id",
      sort_order: "desc",
    }));
  };

  const filterDisplay = [
    {
      type: "select",
      name: "discrepancy",
      label: "Discrepancy",
      options: discrepancy.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: handleDiscrepancy,
    },
  ];
  console.log("limit here", searchCriteria.limit, searchCriteria.offset);
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3">
        <div className="flex  flex-1 space-x-2  lg:mb-0">
          <div className="flex items-center relative w-full lg:w-auto">
            <Search className="size-4 text-gray-400 absolute left-1 z-10 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by name"
              onChange={(event) => setInputValue(event.target.value)}
              className=" w-80 lg:w-64 pl-8 text-sm placeholder:text-sm text-gray-400 h-8"
            />
          </div>
        </div>
        {/* Buttons Container */}

        <div className="flex flex-row lg:flex-row lg:justify-center lg:items-center gap-2">
          <div className="text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2">
            <DatePickerWithRange
              name={"Date Range"}
              value={{
                start_date: filterData.start_date, // Access start_date directly
                end_date: filterData.end_date, // Access end_date directly
              }}
              onValueChange={(dates) => {
                handleDateRange(dates);
              }}
              label={"Select date range "}
              className="w-full" // Ensure full width
            />
          </div>

          <Button
            variant={"outline"}
            className="text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
            onClick={() => {
              setFilter({});
              setSearchCriteria(initialValue);
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="gap-2 flex justify-center items-center">
                    <i className="fa-solid fa-arrows-rotate"></i>
                    Reset
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset date range</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
          <DataTableViewOptions table={table} action={handleExportSelected} />

          <button
            className="border rounded-full size-3 text-gray-400 p-4 flex items-center justify-center"
            onClick={() => setOpenFilter(true)}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <i className="fa fa-filter"></i>
                </TooltipTrigger>
                <TooltipContent>
                  <p>click to apply filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </div>
      </div>

      <div className="rounded-none border border-border  ">
        <ScrollArea className="w-full relative">
          <ScrollBar
            orientation="horizontal"
            className="relative z-30 cursor-grab"
          />
          <Table className="w-full overflow-x-scroll">
            <TableHeader className="bg-secondary/80">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isRegisterSessionLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex space-x-2 justify-center items-center bg-white ">
                      <div className="size-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="size-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="size-3 bg-black rounded-full animate-bounce"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="h-24">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                ))
              ) : registerSessionData?.total_counts == 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No register closure records found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No records found for the search Criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {cashregisterTableData.length > 0 && (
        <Pagination
          limit={searchCriteria.limit}
          offset={searchCriteria.offset}
          totalItems={totalRecords}
          onLimitChange={handleLimitChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onFirstPage={handleFirstPage}
          onLastPage={handleLastPage}
          isLastPage={isLastPage}
        />
      )}

      <TableFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilter}
        setSearchCriteria={setSearchCriteria}
        filterDisplay={filterDisplay}
      />
    </div>
  );
}
