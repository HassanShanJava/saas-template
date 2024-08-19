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
// import { MemberFilterSchema, MemberTabletypes } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTableViewOptions } from "./data-table-view-options";
import { Spinner } from "@/components/ui/spinner/spinner";
import Papa from "papaparse";
import { DataTableFacetedFilter } from "./data-table-faced-filter";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetAllMemberQuery } from "@/services/memberAPi";
import {
  useGetCoachesQuery,
  useUpdateCoachMutation,
} from "@/services/coachApi";
import {
  CoachTableDataTypes,
  CoachTableTypes,
  coachUpdateInput,
  ErrorType,
} from "@/app/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Separator } from "@/components/ui/separator";
import CoachForm from "../../coachForm/Form";
import { Sheet } from "@/components/ui/sheet";
import TableFilters from "@/components/ui/table/data-table-filter";

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
  { value: "pending", label: "Pending", color: "bg-orange-500", hide: true },
];

const downloadCSV = (data: any[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  status?: boolean;
  search_key?: string;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "created_at",
};

export default function CoachTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
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
    data: coachData,
    isLoading,
    refetch,
    error,
  } = useGetCoachesQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const navigate = useNavigate();
  const [updateCoach] = useUpdateCoachMutation();

  const coachTableData = React.useMemo(() => {
    return Array.isArray(coachData?.data) ? coachData.data : [];
  }, [coachData]);
  const { toast } = useToast();
  console.log("data", { coachData, error });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});

  const [filters, setFilters] = useState<"">();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});

  const displayDate = (value: any) => {
    const date = new Date(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

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
    downloadCSV(selectedRows, "coach_list.csv");
  };

  const handleStatusChange = async (payload: {
    coach_status: string;
    id: number;
    org_id: number;
  }) => {
    console.log("handle change status", { payload });

    try {
      if (payload.coach_status == "pending") {
        toast({
          variant: "destructive",
          title: "Only Active/Inactive",
        });
        return;
      }
      const resp = await updateCoach(payload).unwrap();
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
  // const displayValue = (value: ) =>
  //   value == null || value === "" || value == undefined ? "N/A" : value;
  const displayValue = (value: string | undefined | null) =>
    value == null || value == "" ? "N/A" : value;

  const toggleSortOrder = (key: string) => {
    setSearchCretiria((prev) => {
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

  const columns: ColumnDef<CoachTableDataTypes>[] = [
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
      accessorKey: "own_coach_id",
      meta: "Gym Coach ID",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Gym Coach ID</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("own_coach_id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.own_coach_id)}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "full_name",
      meta: "Coach Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Coach Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("first_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.first_name} {row.original.last_name}
          </div>
        );
      },
    },
    {
      accessorKey: "coach_since",
      meta: "Coach Since",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Coach Since</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("coach_since")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.coach_since)}
          </div>
        );
      },
    },
    {
      accessorKey: "coach_status",
      meta: "Status",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Status</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("coach_status")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const value =
          row.original?.coach_status != null
            ? row.original?.coach_status + ""
            : "pending";
        console.log("value of status", value);
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original.org_id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e) =>
              handleStatusChange({ coach_status: e, id: id, org_id: org_id })
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
              {status.map(
                (item: any) =>
                  !item.hide && (
                    <SelectItem key={item.value + ""} value={item.value + ""}>
                      {item.label}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "check_in",
      meta: "Last Check In",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Last Check In</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("check_in")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        console.log(row?.original.check_in);
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.check_in)}
          </div>
        );
      },
    },
    {
      accessorKey: "last_online",
      meta: "Last Login",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Last Login</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("last_online")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
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
        <DataTableRowActions
          data={row.original}
          refetch={refetch}
          handleEdit={handleOpenForm}
        />
      ),
    },
  ];
  const table = useReactTable({
    data: coachTableData as CoachTableDataTypes[],
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

  function handlePagination(page: number) {
    if (page < 0) return;
    // setFilters
  }

  function handleCoachStatus(value: string) {
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
      function: handleCoachStatus,
    },
  ];

  const totalRecords = coachData?.total_counts || 0;
  const lastPageOffset = Math.max(
    0,
    Math.floor(totalRecords / searchCretiria.limit) * searchCretiria.limit
  );
  const isLastPage = searchCretiria.offset >= lastPageOffset;

  const nextPage = () => {
    if (!isLastPage) {
      setSearchCretiria((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  // Function to go to the first page
  const firstPage = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      offset: 0,
    }));
  };

  // Function to go to the last page
  const lastPage = () => {
    if (!isLastPage) {
      setSearchCretiria((prev) => ({
        ...prev,
        offset: lastPageOffset,
      }));
    }
  };

  const handleOpenForm = (coachData: coachUpdateInput | null = null) => {
    setEditCoach(coachData);
    setOpen(true);
  };

  const [open, setOpen] = useState<boolean>(false);
  const [editCoach, setEditCoach] = useState<coachUpdateInput | null>(null);
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2 px-4 py-2 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Search className="size-4 text-gray-400 absolute left-1 z-40 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by coach name"
              onChange={(event) => setInputValue(event.target.value)}
              className="w-64 pl-8 text-gray-400"
            />
          </div>
        </div>
        <Button
          className="bg-primary  text-black mr-1 "
          onClick={() => handleOpenForm()}
        >
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
        {/* <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={toggleSortOrder}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button> */}
      </div>
      <div className="rounded-none border border-border ">
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
              ) : coachTableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No coaches added yet.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No coaches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {coachTableData.length > 0 && (
        <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Items per page:</p>
              <Select
                value={searchCretiria.limit.toString()}
                onValueChange={(value) => {
                  const newSize = Number(value);
                  setSearchCretiria((prev) => ({
                    ...prev,
                    limit: newSize,
                    offset: 0, // Reset offset when page size changes
                  }));
                }}
              >
                <SelectTrigger className="h-8 w-[70px] !border-none shadow-none">
                  <SelectValue>{searchCretiria.limit}</SelectValue>
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
            <span>
              {" "}
              {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${coachData?.filtered_counts} Items  `}
            </span>
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
                onClick={firstPage}
                disabled={searchCretiria.offset === 0}
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
                onClick={prevPage}
                disabled={searchCretiria.offset === 0}
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
                onClick={nextPage}
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
                onClick={lastPage}
                disabled={isLastPage}
              >
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <TableFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilter}
        setSearchCriteria={setSearchCretiria}
        filterDisplay={filterDisplay}
      />

      <CoachForm
        coachData={editCoach}
        setCoachData={setEditCoach}
        setOpen={setOpen}
        open={open}
        refetch={refetch}
      />
    </div>
  );
}
