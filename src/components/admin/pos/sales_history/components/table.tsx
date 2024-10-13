import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  lineItems,
  RegisterSession,
  Salehistory,
  SaleshistoryTableType,
  salesReportInterface,
} from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { displayDateTime, displayValue, formatDate } from "@/utils/helper";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { sessionMapper, downloadCSV } from "@/utils/helper";
import TableFilters from "@/components/ui/table/data-table-filter";
import { salesData, statusValues, typeValues } from "@/constants/sale_history";
import { Button } from "@/components/ui/button";
import { useGetAlltransactionQuery } from "@/services/registerApi";
import { Search } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useDebounce } from "@/hooks/use-debounce";
import { DatePickerWithRange } from "@/components/ui/date-range/date-rangePicker";
import { Separator } from "@/components/ui/separator";

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

export default function SaleshistoryRegisterViewTable() {
  const counter_number =
    useSelector((state: RootState) => state.counter?.counter_number) || 0;

  const { pos_sale_history } = JSON.parse(
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
  const {
    data: salesHistoryData,
    isLoading: salesDataLoading,
    refetch,
    error,
    isError,
  } = useGetAlltransactionQuery(
    {
      counter_id: counter_number,
      query: query,
    },
    {
      skip: query == "",
    }
  );

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
  const saleshistoryTableData = React.useMemo(() => {
    return Array.isArray(salesHistoryData?.data) ? salesHistoryData?.data : [];
  }, [salesHistoryData]);

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
        title: "Select atleast one row for CSV download!",
      });
      return;
    }
    // downloadCSV(selectedRows, "sale_history.csv", sessionMapper);
  };

  const actionsColumn: ColumnDef<salesReportInterface> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        access={pos_sale_history}
        // row={row.original.id}
        data={row?.original}
        // refetch={refetch}
        // handleEditMember={handleEditForm}
      />
    ),
  };

  const columns: ColumnDef<salesReportInterface>[] = [
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
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: any) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        );
      },
    },
    {
      accessorKey: "recieptnumber",
      meta: "Reciept Number",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Txn Number</p>
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
            {row.getCanExpand() && (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
                className="flex gap-1 items-center"
              >
                {row.getIsExpanded() ? (
                  <i className="fa fa-angle-down w-3 h-3"></i>
                ) : (
                  <i className="fa fa-angle-right w-3 h-3"></i>
                )}
              </button>
            )}

            <div className="">
              <p className="capitalize cursor-pointer">
                <span>{displayValue(row.original.reciept_number)}</span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user",
      meta: "user",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">SRB Number</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("tax_number")}
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
            {displayValue(row?.original.tax_number)}
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      meta: "user",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Member</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("member_name")}
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
            {displayValue(row?.original.member_name)}
          </div>
        );
      },
    },
    {
      accessorKey: "taxamount",
      meta: "Tax amount",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Tax Amount</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("tax_amt")}
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
            {displayValue(row?.original.tax_amt.toFixed(2).toString())}
          </div>
        );
      },
    },
    {
      accessorKey: "discountedamount",
      meta: "Discounted Amount",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Discount Amount</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("discount_amt")}
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
                  {displayValue(
                    row.original.discount_amt.toFixed(2).toString()
                  )}
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
      accessorKey: "type",
      meta: "Type",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Type</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("transaction_type")}
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
            {displayValue(row?.original.transaction_type)}
          </div>
        );
      },
    },

    {
      accessorKey: "totalamount",
      meta: "total amount",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Total Amount</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("total")}
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
                  {displayValue(row.original.subtotal.toFixed(2).toString())}
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
      accessorKey: "status",
      meta: "Status",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Status</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("status")}
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
                <span>{displayValue(row.original.status)}</span>
              </p>
            </div>
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
                    <p className="capitalize cursor-pointer">
                      <span>
                        {displayValue(
                          `${row.original.staff_name}`.length > 15
                            ? `${row.original.staff_name}`.substring(0, 15) +
                                "..."
                            : `${row.original.staff_name}`
                        )}
                        N/A
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize text-sm">
                      {displayValue(`${row?.original?.staff_name}`)}
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
      accessorKey: "date",
      meta: "date",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Created Date</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("transaction_date")}
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
              <p className="capitalize cursor-pointer text-nowrap">
                <span>{displayDateTime(row?.original.transaction_date)}</span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    ...(pos_sale_history !== "read" ? [actionsColumn] : []),
  ];

  // saleshistoryTableData
  const table = useReactTable({
    data: saleshistoryTableData as salesReportInterface[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const totalRecords = salesData?.filtered_counts || 0;

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

  function handleFilterChange(field: string, value: string | number) {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  const filterDisplay = [
    {
      type: "select",
      name: "status",
      label: "Status",
      options: statusValues.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("status", value),
    },
    {
      type: "select",
      name: "type",
      label: "Type",
      options: typeValues.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("type", value),
    },
  ];

  console.log("limit here", searchCriteria.limit, searchCriteria.offset);
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3 ">
        <div className="flex  flex-1 space-x-2  lg:mb-0">
          <div className="flex items-center relative w-full lg:w-auto">
            <Search className="size-4 text-gray-400 absolute left-1 z-10 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by Txn Number"
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
          <DataTableViewOptions table={table} action={handleExportSelected} />

          <button
            className="border rounded-full size-3 text-gray-400 p-4 flex items-center justify-center"
            onClick={() => setOpenFilter(true)}
          >
            <i className="fa fa-filter"></i>
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
              {/* {isLoading ? ( */}
              {false ? (
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
                    {row.original.transaction_type === "Sale" ? (
                      <TableRow>
                        <TableCell colSpan={12}>
                          <div className="py-4">
                            <h3 className="text-lg font-bold">Sale Details</h3>
                            {/* Line items */}
                            <div className="grid grid-cols-12 py-2 font-semibold">
                              <span className="col-span-1">Qty</span>
                              <span className="col-span-2">Item Type</span>
                              <span className="col-span-3">Description</span>
                              <span className="col-span-2">Price</span>
                              <span className="col-span-1">Discount</span>
                              <span className="col-span-2">Tax (Rate)</span>
                              <span className="col-span-1 text-right">
                                Total
                              </span>
                            </div>
                            {row.original.items?.map(
                              (item: lineItems, i: number) => (
                                <div key={i} className="grid grid-cols-12 py-2">
                                  <span className="col-span-1">
                                    {item.quantity}
                                  </span>
                                  <span className="col-span-2">
                                    {item.item_type}
                                  </span>
                                  <span className="col-span-3">
                                    {item.description}
                                  </span>
                                  <span className="col-span-2">
                                    Rs {item.price.toFixed(2)}
                                  </span>
                                  <span className="col-span-1">
                                    Rs {item.discount.toFixed(2)}
                                  </span>
                                  <span className="col-span-2">
                                    Rs {item.tax_amount.toFixed(2)} (
                                    {item.tax_rate}%)
                                  </span>
                                  <span className="col-span-1 text-right">
                                    Rs {item.total.toFixed(2)}
                                  </span>
                                </div>
                              )
                            )}
                            <Separator />
                            {/* Subtotal, Tax, and Total */}
                            <div className="grid grid-cols-5">
                              <div className="col-span-2">Note</div>
                              <div className="col-span-3">
                                <div className="flex justify-between py-2">
                                  <span>Subtotal</span>
                                  <span>
                                    Rs {row.original.subtotal.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between py-2">
                                  <span>Total Tax</span>
                                  <span>
                                    Rs {row.original.tax_amt.toFixed(2)}
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between py-2">
                                  <span>Sale Total</span>
                                  <span>
                                    Rs {row.original.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12}>
                          <div className="py-4">
                            <h3 className="text-lg font-bold">
                              Refund Details
                            </h3>
                            {/* Line items */}
                            <div className="grid grid-cols-12 py-2 font-semibold">
                              <span className="col-span-1">Qty</span>
                              <span className="col-span-2">Item Type</span>
                              <span className="col-span-3">Description</span>
                              <span className="col-span-2">Price</span>
                              <span className="col-span-1">Discount</span>
                              <span className="col-span-2">Tax (Rate)</span>
                              <span className="col-span-1 text-right">
                                Total
                              </span>
                            </div>
                            {row.original.items?.map(
                              (item: lineItems, i: number) => (
                                <div key={i} className="grid grid-cols-12 py-2">
                                  <span className="col-span-1">
                                    {item.quantity}
                                  </span>
                                  <span className="col-span-2">
                                    {item.item_type}
                                  </span>
                                  <span className="col-span-3">
                                    {item.description}
                                  </span>
                                  <span className="col-span-2">
                                    Rs {item.price.toFixed(2)}
                                  </span>
                                  <span className="col-span-1">
                                    Rs {item.discount.toFixed(2)}
                                  </span>
                                  <span className="col-span-2">
                                    Rs {item.tax_amount.toFixed(2)} (
                                    {item.tax_rate}%)
                                  </span>
                                  <span className="col-span-1 text-right">
                                    Rs {item.total.toFixed(2)}
                                  </span>
                                </div>
                              )
                            )}
                            <Separator />
                            <div className="grid grid-cols-5">
                              <div className="col-span-2">Note</div>
                              <div className="col-span-3">
                                <div className="flex justify-between py-2">
                                  <span>Refund Amount</span>
                                  <span>
                                    Rs {row.original.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : saleshistoryTableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {saleshistoryTableData.length > 0 && (
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
