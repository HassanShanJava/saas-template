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
  RegisterSession,
  Salehistory,
  SaleshistoryTableType,
} from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { displayDateTime, displayValue } from "@/utils/helper";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { sessionMapper, downloadCSV } from "@/utils/helper";
import TableFilters from "@/components/ui/table/data-table-filter";
import { salesData } from "@/constants/sale_history";
import { Button } from "@/components/ui/button";

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

export default function SaleshistoryRegisterViewTable() {
  const { pos_sale_history } = JSON.parse(
    localStorage.getItem("accessLevels") as string
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [searchCriteria, setSearchCriteria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilter] = useState<Record<string, any>>({});

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
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
  const saleshistoryTableData = React.useMemo(() => {
    return Array.isArray(salesData?.data) ? salesData?.data : [];
  }, [salesData]);

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

  const actionsColumn: ColumnDef<Salehistory> = {
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

  const columns: ColumnDef<Salehistory>[] = [
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
            onClick={() => toggleSortOrder("recieptnumber")}
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
            {row.getCanExpand() && row.original.refunditems && (
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
                <span>{displayValue(row.original.receiptNumber)}</span>
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
          <p className="text-nowrap">Member</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("user")}
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
            {displayValue(row?.original.user)}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      meta: "Type",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Type</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("reciept_type")}
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
            {displayValue(row?.original.type)}
          </div>
        );
      },
    },
    {
      accessorKey: "taxrate",
      meta: "Tax Rate",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Tax Rate</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("taxrate")}
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
            <p className="capitalize cursor-pointer">
              <span>
                {displayValue(
                  `${row.original.taxName}`.length > 15
                    ? `${row.original.taxName}`.substring(0, 15) + "..."
                    : `${row.original.taxName}`
                )}
              </span>
            </p>
            {displayValue(row?.original.taxRate.toString())}%
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
            onClick={() => toggleSortOrder("taxamount")}
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
            {displayValue(row?.original.taxAmount.toFixed(2).toString())}
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
            onClick={() => toggleSortOrder("discountedamount")}
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
                    row.original.discountAmount.toFixed(2).toString()
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
      accessorKey: "totalamount",
      meta: "total amount",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Total Amount</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("totalamount")}
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
                  {displayValue(row.original.totalAmount.toFixed(2).toString())}
                </span>
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "notes",
    //   meta: "Notes",
    //   header: () => (
    //     <div className="flex items-center gap-2">
    //       <p className="text-nowrap">Notes</p>
    //       <button
    //         className=" size-5 text-gray-400 p-0 flex items-center justify-center"
    //         onClick={() => toggleSortOrder("notes")}
    //       >
    //         <i
    //           className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
    //         ></i>
    //       </button>
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex gap-2 items-center justify-between w-fit">
    //         <div className="">
    //           <TooltipProvider>
    //             <Tooltip>
    //               <TooltipTrigger asChild>
    //                 <p className="capitalize cursor-pointer">
    //                   <span>
    //                     {displayValue(
    //                       `${row.original.notes}`.length > 15
    //                         ? `${row.original.notes}`.substring(0, 15) + "..."
    //                         : `${row.original.notes}`
    //                     )}
    //                   </span>
    //                 </p>
    //               </TooltipTrigger>
    //               <TooltipContent>
    //                 <p className="capitalize text-sm">
    //                   {displayValue(`${row?.original?.notes}`)}
    //                 </p>
    //               </TooltipContent>
    //             </Tooltip>
    //           </TooltipProvider>
    //         </div>
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "status",
      meta: "Status",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Status</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("recieptnumber")}
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
            onClick={() => toggleSortOrder("createdBy")}
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
    {
      accessorKey: "date",
      meta: "date",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Created Date</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("date")}
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
                <span>{displayDateTime(row?.original.created_at)}</span>
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
    data: saleshistoryTableData as Salehistory[],
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

  const filterDisplay = [
    {
      type: "select",
      name: "visible_for",
      label: "Discrepancy",
      // options: visibleFor.map((item) => ({ id: item.value, name: item.label })),
      // function: handleVisiblity,
    },
  ];
  console.log("limit here", searchCriteria.limit, searchCriteria.offset);
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3 py-2">
        <div></div>
        {/* Buttons Container */}

        <div className="flex flex-row lg:flex-row lg:justify-center lg:items-center gap-2">
          <DataTableViewOptions table={table} action={handleExportSelected} />

          <button
            className="border rounded-full size-5 text-gray-400 p-5 flex items-center justify-center"
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
                    {row.getIsExpanded() && (
                      <TableRow>
                        {/* Refund Item Details */}
                        <TableCell
                          key={row.original.id}
                          className="h-16"
                        ></TableCell>
                        <TableCell
                          key={row.original.id}
                          className="flex gap-2 items-center justify-between w-fit h-16"
                        >
                          <div className="h-3 w-3"></div>
                          {row.original.receiptNumber}
                        </TableCell>
                        <TableCell key={row.original.user}>
                          <span className="capitalize cursor-pointer">
                            {row.original.user}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.type}>
                          <span className="capitalize cursor-pointer">
                            {row.original.type}
                          </span>
                        </TableCell>

                        <TableCell key={row.original.taxRate}>
                          <span className="capitalize cursor-pointer">
                            {row.original.taxName} {row.original.taxRate}%
                          </span>
                        </TableCell>
                        <TableCell key={row.original.taxAmount}>
                          <span className="capitalize cursor-pointer">
                            {row.original.taxAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.discountAmount}>
                          <span className="capitalize cursor-pointer">
                            {row.original.discountAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.totalAmount}>
                          <span className="capitalize cursor-pointer">
                            {row.original.totalAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.status}>
                          <span className="capitalize cursor-pointer">
                            {row.original.status}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.created_by}>
                          <span className="capitalize cursor-pointer">
                            {row.original.created_by}
                          </span>
                        </TableCell>
                        <TableCell key={row.original.created_at}>
                          <span className="capitalize cursor-pointer text-nowrap">
                            {row.original.created_at}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-4">
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                  // onClick={() => handleEdit(data)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                </DialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </Dialog>
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
