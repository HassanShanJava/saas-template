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
import { Button } from "@/components/ui/button";

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
import { ChevronRightIcon, PlusIcon, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CounterDataType } from "@/app/types/pos/counter";
import { ErrorType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { useDebounce } from "@/hooks/use-debounce";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import { displayValue } from "@/utils/helper";
import AssignCounter from "../modal/assign-counter";
import CounterForm from "../modal/counter-form";
import {
  useGetCountersQuery,
  useUpdateCountersMutation,
} from "@/services/counterApi";
import TableFilters from "@/components/ui/table/data-table-filter";
import { useGetStaffListQuery, useGetStaffsQuery } from "@/services/staffsApi";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { Badge } from "@/components/ui/badge";
import { status } from "@/constants/global";

const downloadCSV = (data: CounterDataType[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface SearchCriteriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
  counter_name?: string;
  staff_id?: number;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

export default function CounterTableView() {
  const pos_count = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).pos_count ??
        "no_access"
      );
    } catch {
      return "no_access";
    }
  })();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [action, setAction] = useState<"add" | "edit">("add");
  const { data: staffList } = useGetStaffListQuery(orgId);
  const { data: staffData } = useGetStaffsQuery({ org_id: orgId, query: "" });

  // counter form
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // assign counter form
  const [assignCounter, setAssignCounter] = useState<boolean>(false);

  const [searchCriteria, setSearchCriteria] =
    useState<SearchCriteriaType>(initialValue);
  const [query, setQuery] = useState("");

  // search input
  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState<Record<string, any>>({});

  useEffect(() => {
    setSearchCriteria((prev) => {
      const newCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        // search counter name
        newCriteria.counter_name = debouncedInputValue;
        newCriteria.offset = 0;
        newCriteria.sort_key = "id";
        newCriteria.sort_order = "desc";
      } else {
        delete newCriteria.counter_name;
      }

      return newCriteria;
    });
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCriteria]);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    const newQuery = params.toString();
    setQuery(newQuery);
  }, [searchCriteria]);

  const toggleSortOrder = (key: string) => {
    setSearchCriteria((prev) => {
      const newSortOrder =
        prev.sort_key === key
          ? prev.sort_order === "desc"
            ? "asc"
            : "desc"
          : "desc"; // Default to descending order if the key is different

      return {
        ...prev,
        sort_key: key,
        sort_order: newSortOrder,
      };
    });
  };

  const {
    data: counterList,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetCountersQuery(
    { query: query },
    {
      skip: query == "",
    }
  );

  const [updateCounter] = useUpdateCountersMutation();
  console.log({ counterList });

  const handleCloseDailog = () => setIsDialogOpen(false);

  const counterTableData = React.useMemo(() => {
    return Array.isArray(counterList?.data) ? counterList?.data : [];
  }, [counterList]);

  const staffDataList = React.useMemo(() => {
    return Array.isArray(staffData?.data) ? staffData?.data : [];
  }, [staffData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<CounterDataType | undefined>(undefined);
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
    downloadCSV(selectedRows, "selected_data.csv");
  };

  const actionsColumn: ColumnDef<CounterDataType> = {
    accessorKey: "action",
    header: ({ table }) => <span>Action</span>,
    cell: ({ row }) => (
      <DataTableRowActions
        access={pos_count}
        handleEdit={handleEdit}
        data={row.original}
        refetch={refetch}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const columns: ColumnDef<CounterDataType>[] = [
    {
      accessorKey: "name",
      meta: "Counter Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Counter Name</p>
          <button
            className=" size-5 transition-transform duration-1000 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("name")}
          >
            <i
              className={`fa fa-sort   ${searchCriteria.sort_order == "desc" ? "rotate-0" : "rotate-180"}`}
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
                          `${row.original.name}`.length > 15
                            ? `${row.original.name}`.substring(0, 15) + "..."
                            : `${row.original.name}`
                        )}
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize text-sm">
                      {displayValue(`${row?.original?.name}`)}
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
      accessorKey: "staff",
      meta: "Assigned Cashiers",
      header: () => <p className="text-nowrap">Assigned Cashiers</p>,
      cell: ({ row }) => {
        return (
          <Button
            className="h-8"
            onClick={() => handleViewCashier(row?.original)}
          >
            View Cashiers
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "is_open",
      meta: "Status",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Open/ Close Status</p>
          {/* <button
            className=" size-5 transition-transform duration-1000 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("staff_id")}
          >
            <i
              className={`fa fa-sort   ${searchCriteria.sort_order == "desc" ? "rotate-0" : "rotate-180"}`}
            ></i>
          </button> */}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center ">
            <Badge
              className={`${row.original?.is_open ? "bg-blue-600" : "bg-red-500"} text-white font-medium`}
            >
              {row.original?.is_open ? "Open" : "Close"}
            </Badge>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "staff_id",
      meta: "Used By",
      header: () => <p className="text-nowrap">Staff</p>,
      cell: ({ row }) => {
        const staff = staffDataList.find(
          (staff) => staff.id === row.original.staff_id
        );
        return row.original.staff_id ? (
          <div className="flex flex-col items-left text-ellipsis whitespace-nowrap overflow-hidden">
            <p className="capitalize text-xs">
              {staff?.first_name + " " + (staff?.last_name ?? "")}
            </p>
            <p className="text-xs text-gray-400">{staff?.email}</p>
          </div>
        ) : (
          <p>N/A</p>
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
          <p>Status</p>
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
        const value =
          row.original?.status != null ? row.original?.status : "inactive";
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e) => handleStatusChange({ status: e, id: id })}
            disabled={pos_count == "read"}
          >
            <SelectTrigger className="h-8 max-w-36">
              <SelectValue
                placeholder="Status"
                className="text-gray-400 max-w-48 "
              >
                <span className="flex gap-2 items-center">
                  <span
                    className={`${statusLabel?.color} rounded-[50%] w-4 h-4`}
                  ></span>
                  <span>{statusLabel?.label}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {status.map((item) => (
                <SelectItem key={item.value + ""} value={item.value + ""}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    ...(pos_count !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: counterTableData as CounterDataType[],
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

  const handleStatusChange = async (payload: {
    status: string;
    id: number;
  }) => {
    console.log({ payload });
    try {
      const resp = await updateCounter(payload).unwrap();
      if (!resp.error) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Counter Updated Successfully",
        });
      } else {
        throw resp.error;
      }
    } catch (error) {
      console.error("Error", error);
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        console.error("Error", typedError);
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail || typedError.data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };
  const handleOpen = () => {
    setAction("add");
    setIsDialogOpen(true);
  };

  const handleEdit = (data: CounterDataType) => {
    setAction("edit");
    setData(data);
    setIsDialogOpen(true);
  };

  const handleViewCashier = (data: CounterDataType) => {
    setData(data);
    setAssignCounter(true);
  };

  const totalRecords = counterList?.filtered_counts || 0;
  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<SearchCriteriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });

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
      options: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
      ],
      function: (value: string) => handleFilterChange("status", value),
    },
    {
      type: "combobox",
      name: "staff_id",
      label: "Staff",
      options: staffList,
      function: (value: string) => handleFilterChange("staff_id", value),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3">
        <div className="flex  flex-1 space-x-2 mb-2 lg:mb-0">
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
          {pos_count !== "read" && (
            <Button
              className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
              onClick={handleOpen}
            >
              <PlusIcon className="size-4" />
              Create New
            </Button>
          )}
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No counter found.
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
      {counterTableData.length > 0 && (
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

      <AssignCounter
        isOpen={assignCounter}
        setOpen={setAssignCounter}
        data={data}
        setData={setData}
        refetch={refetch}
      />

      <CounterForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        action={action}
        setAction={setAction}
        data={data}
        setData={setData}
        refetch={refetch}
      />

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
