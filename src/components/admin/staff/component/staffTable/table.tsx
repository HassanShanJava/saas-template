import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, PlusIcon, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  ErrorType,
  StaffResponseType,
  staffTypesResponseList,
} from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTableViewOptions } from "./data-table-view-options";
import Papa from "papaparse";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  useGetStaffsQuery,
  useUpdateStaffMutation,
} from "@/services/staffsApi";
import { statusEnum } from "../../staffForm/form";
import { useDebounce } from "@/hooks/use-debounce";
import StaffFilters from "./data-table-filter";
import { Separator } from "@/components/ui/separator";

const downloadCSV = (data: staffTypesResponseList[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
  { value: "pending", label: "Pending", color: "bg-orange-500" },
];
enum genderEnum {
  male = "male",
  female = "female",
  other = "other",
}

interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  status?: boolean;
  search_key?: string;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
};
export default function StaffTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const navigate = useNavigate();

  const [searchCretiria, setSearchCretiria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");

  // search input
  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState({});

  useEffect(() => {
    setSearchCretiria((prev) => {
      const newCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCretiria]);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCretiria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCretiria]);

  const {
    data: staffData,
    isLoading,
    refetch,
    error,
  } = useGetStaffsQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const [updateStaff] = useUpdateStaffMutation();
  function handleRoute() {
    navigate("/admin/staff/addstaff");
  }

  const staffTableData = React.useMemo(() => {
    return Array.isArray(staffData?.data) ? staffData.data : [];
  }, [staffData]);
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});

  const [filters, setFilters] = useState<"">();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjust this based on your preference
  });

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
    downloadCSV(selectedRows, "staff_list.csv");
  };

  const displayValue = (value: string | undefined | null) =>
    value == null || value == "" ? "N/A" : value;

  const displayDate = (value: any) => {
    if (!value) {
      return "N/A";
    }
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    console.log(day, month, year);
    return `${day}-${month}-${year}`;
  };

  const handleStatusChange = async (payload: {
    own_staff_id: string;
    status: statusEnum;
    id: number;
    org_id: number;
    first_name: string;
    last_name: string;
    gender: genderEnum;
    dob: string;
    email: string;
    source_id: number;
    role_id: number;
    country_id: number;
  }) => {
    console.log("handle change status", { payload });

    try {
      if (payload.status == "pending") {
        toast({
          variant: "destructive",
          title: "Only Active/Inactive",
        });
        return;
      }
      const resp = await updateStaff(payload).unwrap();
      refetch();
      if (resp) {
        console.log({ resp });
        toast({
          variant: "success",
          title: "Updated Successfully",
        });
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };
  const columns: ColumnDef<staffTypesResponseList>[] = [
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
      accessorKey: "own_staff_id",
      header: "Gym Staff ID",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.own_staff_id)}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "full_name",
      header: "Staff Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.first_name} {row.original.last_name}
          </div>
        );
      },
    },
    {
      accessorKey: "activated_on",
      header: "Staff Since",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.activated_on)}
          </div>
        );
      },
    },
    {
      accessorKey: "role_name",
      header: "Role",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.role_name)}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: ({ table }) => <span>Status</span>,
      cell: ({ row }) => {
        const value =
          row.original?.status != null ? row.original?.status + "" : "pending";
        console.log("value of status", value);
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original.org_id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e: statusEnum) =>
              handleStatusChange({
                status: e,
                id: id,
                org_id: org_id,
                own_staff_id: row.original?.own_staff_id,
                first_name: row.original?.first_name,
                last_name: row.original?.last_name,
                gender: row.original?.gender,
                dob: row.original?.dob,
                email: row.original?.email,
                source_id: row.original?.source_id,
                role_id: row.original?.role_id,
                country_id: row.original?.country_id,
              })
            }
            disabled={value == "pending"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" className="text-gray-400">
                <span className="flex gap-2 items-center">
                  <span
                    className={`${statusLabel?.color} rounded-[50%] w-4 h-4`}
                  ></span>
                  <span>{statusLabel?.label}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {status.map((item: any) => (
                <SelectItem key={item.value + ""} value={item.value + ""}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "last_checkin",
      header: "Last Check In",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.last_checkin)}
          </div>
        );
      },
    },
    {
      accessorKey: "last_online",
      header: "Last Login",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.last_online)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DataTableRowActions data={row.original} refetch={refetch} />
      ),
    },
  ];

  const table = useReactTable({
    data: staffTableData as staffTypesResponseList[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Set your default page size here
      },
    },
    onPaginationChange: setPagination,
  });

  function handlePagination(page: number) {
    if (page < 0) return;
    // setFilters
  }

  function handleStaffStatus(value: string) {
    setFilter((prev) => ({
      ...prev,
      status: value,
    }));
  }

  const filterDisplay = [
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "active", name: "Active" },
      ],
      function: handleStaffStatus,
    },
  ];

  const toggleSortOrder = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2 px-4 py-2 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Search className="size-4 text-gray-400 absolute left-1 z-40 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by staff name"
              onChange={(event) => setInputValue(event.target.value)}
              className="w-64 pl-8 text-gray-400"
            />
          </div>
        </div>
        <Button className="bg-primary  text-black mr-1 " onClick={handleRoute}>
          <PlusIcon className="size-4" />
          Create New
        </Button>
        <DataTableViewOptions table={table} action={handleExportSelected} />
        <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={() => setOpenFilter(true)}
        >
          <i className="fa fa-filter"></i>
        </button>
        <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={toggleSortOrder}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button>
      </div>
      <div className="rounded-md border border-border ">
        <ScrollArea className="w-full relative">
          <ScrollBar orientation="horizontal" />
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
              {isLoading ? (
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
              ) : staffTableData.length > 0 ? (
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
                    No Staff Added yet!.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

       {/* pagination */}
       <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Items per page:</p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const newSize = Number(value);
                setSearchCretiria((prev) => ({ ...prev, limit: newSize }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] !border-none shadow-none">
                <SelectValue>{pagination.pageSize}</SelectValue>
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
            className="h-11 w-[1px] bg-gray-300  "
          />
          {/* <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {searchCretiria.offset + 1 + " of "}
            </p>
          </div> */}
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center space-x-2">
            <Separator
              orientation="vertical"
              className="hidden lg:flex h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-none !!disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: 0,
                  };
                })
              }
              disabled={searchCretiria.offset === 0}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Separator
              orientation="vertical"
              className="h-11 w-[0.5px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: prev.offset - 1,
                  };
                })
              }
              disabled={searchCretiria.offset === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Separator
              orientation="vertical"
              className="h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: prev.offset + 1,
                  };
                })
              }
              // disabled={
              //   searchCretiria.offset ==
              //   Math.ceil(
              //     (count?.total_members as number) / searchCretiria.limit
              //   ) -
              //     1
              // }
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Separator
              orientation="vertical"
              className="hidden lg:flex h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-none disabled:cursor-not-allowed"
              // onClick={() =>
              //   setSearchCretiria((prev) => {
              //     return {
              //       ...prev,
              //       offset:
              //         Math.ceil(
              //           (count?.total_members as number) / searchCretiria.limit
              //         ) - 1,
              //     };
              //   })
              // }
              // disabled={
              //   searchCretiria.offset ==
              //   Math.ceil(
              //     (count?.total_members as number) / searchCretiria.limit
              //   ) -
              //     1
              // }
            >
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <StaffFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilter}
        setSearchCriteria={setSearchCretiria}
        filterDisplay={filterDisplay}
      />
    </div>
  );
}
