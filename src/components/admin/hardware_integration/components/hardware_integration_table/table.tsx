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
import {
  ErrorType,
  hardwareIntegrationInterface,
  RegisterSession,
} from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { displayDateTime, displayValue } from "@/utils/helper";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
import { sessionMapper, downloadCSV } from "@/utils/helper";
import TableFilters from "@/components/ui/table/data-table-filter";
import { useGetAllRegisterSessionQuery } from "@/services/registerApi";
import { discrepancy } from "@/constants/cash_register";
import { formatDate } from "@/utils/helper";
import { DatePickerWithRange } from "@/components/ui/date-range/date-rangePicker";
import { Filter, PlusIcon, Search } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import HardwareIntegrationForm from "../hardware_integrationForm/hardware_integration";

interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

export default function HardwareIntegrationTable() {
  const { hard_int } = JSON.parse(
    localStorage.getItem("accessLevels") as string
  );

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  const [searchCriteria, setSearchCriteria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilter] = useState<Record<string, any>>({});
  const [action, setAction] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<any | undefined>(undefined);

  function handleRoute() {
    setAction("add");
    setIsDialogOpen(true);
  }

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

    setQuery(newQuery);
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

  // const {
  //   data: registerSessionData,
  //   isLoading: isRegisterSessionLoading,
  //   refetch,
  //   error,
  //   isError,
  // } = useGetAllRegisterSessionQuery(
  //   {
  //     counter_id: counter_number,
  //     query: query,
  //   },
  //   {
  //     skip: query == "",
  //   }
  // );

  React.useEffect(() => {
    if (false) {
      // error state
      const typedError = "" as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: typedError.data?.detail ?? "Internal Server Errors",
      });
    }
  }, [false]);

  const cashregisterTableData = React.useMemo(() => {
    return Array.isArray([]) ? [] : [];
  }, []);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const actionsColumn: ColumnDef<hardwareIntegrationInterface> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        access={hard_int}
        row={row.original.id}
        data={row?.original}
        // refetch={refetch}
        // hanleEditExercise={handleEditExercise}
      />
    ),
  };
  const columns: ColumnDef<hardwareIntegrationInterface>[] = [
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
      accessorKey: "name",
      meta: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Name</p>
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
                <span>{displayValue(row.original.name?.toString())}</span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      meta: "Description",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Description</p>
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
            {displayValue(row?.original.description)}
          </div>
        );
      },
    },
    {
      accessorKey: "facility_name",
      meta: "Facility Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Facility Name</p>
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
                  {displayValue(row.original.facility_name?.toString())}
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
      accessorKey: "connection_key",
      meta: "Connection Key",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Connection Key</p>
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
            {displayValue(row?.original.connection_key)}
          </div>
        );
      },
    },

    ...(hard_int !== "read" ? [actionsColumn] : []),
  ];

  // cashregisterTableData
  const table = useReactTable({
    data: cashregisterTableData as hardwareIntegrationInterface[],
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

  const totalRecords = 0; //registerSessionData?.filtered_counts ||

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

  const filterDisplay = [{}];
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

        <div className="flex flex-row lg:flex-row lg:justify-center lg:items-center gap-2">
          <Button
            className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
            onClick={handleRoute}
          >
            <PlusIcon className="size-4" />
            Create New
          </Button>

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
              {true ? ( //isRegisterSessionLoading loading state
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
              ) : 0 ? ( // registerSessionData?.total_counts ==
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
      <HardwareIntegrationForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        action={action}
        setAction={setAction}
        data={data}
        refetch={() => console.log("Hello")}
      />
    </div>
  );
}
