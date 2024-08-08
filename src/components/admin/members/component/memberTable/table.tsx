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
import { useDebounce } from "@/hooks/use-debounce";
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
import { MoreHorizontal, PlusIcon, Rows, Search } from "lucide-react";
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
import { ErrorType, MemberTableDatatypes, MemberTabletypes } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTableViewOptions } from "./data-table-view-options";
import Papa from "papaparse";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  useGetAllMemberQuery,
  useGetMemberCountQuery,
} from "@/services/memberAPi";
import { useGetCoachesQuery, useGetCoachListQuery } from "@/services/coachApi";
import MemberFilters from "./data-table-filter";
import { useGetMembershipListQuery, useGetMembershipsQuery } from "@/services/membershipsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Separator } from "@/components/ui/separator";
import MemberForm from "../../memberForm/form";

const downloadCSV = (data: MemberTableDatatypes[], fileName: string) => {
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
  search_key?: string;
  status?: string;
  membership_plan?: string;
  coach_asigned?: string;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  // sort_key: "created_at",
};

export default function MemberTableView() {
  const [isOpen, setOpen] = useState(false)
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

  const toggleSortOrder = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "desc" ? "asc" : "desc",
    }));
  };

  const {
    data: memberData,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetAllMemberQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const { data: coachesData } = useGetCoachListQuery(orgId);

  const { data: count } = useGetMemberCountQuery(orgId);
  const { data: membershipPlans } = useGetMembershipListQuery(orgId);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      const typedError = error as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: typedError.data?.detail ?? "Internal Server Errors",
      });
    }
  }, [isError]);

  function handleRoute() {
    navigate("/admin/members/addmember");
  }
  const memberTableData = React.useMemo(() => {
    return Array.isArray(memberData?.data) ? memberData?.data : [];
  }, [memberData]);
  const { toast } = useToast();
  console.log("data", { memberData, error });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});
  const [data, setData] = useState<MemberTableDatatypes>(undefined);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjust this based on your preference
  });
  const displayValue = (value: string | undefined | null) =>
    value == null || value == undefined || value.trim() == "" ? "N/A" : value;

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
    downloadCSV(selectedRows, "members_list.csv");
  };


  const handleEditMember=(data:MemberTableDatatypes)=>{
    setData(data as MemberTableDatatypes);
    setOpen(true);
  }

  const columns: ColumnDef<MemberTableDatatypes>[] = [
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
    // {
    //   id: "id",
    //   header: () => (
    //     <span>S No.</span>
    //   ),
    //   cell: ({ row }) => (
    //     <span>{row.index + 1 + (searchCretiria.offset)}.</span>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "own_member_id",
      header: "Member Id ",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.own_member_id)}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "full_name",
      header: "Member Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.first_name} {row.original.last_name}
          </div>
        );
      },
    },
    {
      accessorKey: "business_name",
      header: "Business Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.business_name)}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.membership_plan_id,
      id: "membership_plan_id",
      header: "Membership Plan",
      cell: ({ row }) => {
        const mebershipName = membershipPlans.filter((plan) => plan.id==row.original.membership_plan_id)[0];
        console.log({mebershipName})
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(mebershipName?.name??'')}
          </div>
        );
      },
    },
    {
      accessorKey: "coaches",
      header: "Coach",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            <div>
              {row.original.coaches &&
                row.original.coaches.map((coach) => (
                  <p className="text-sm">{displayValue(coach.name)}</p>
                ))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "client_since",
      header: "Activation Date",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.client_since)}
          </div>
        );
      },
    },
    {
      accessorKey: "check_in",
      header: "Last Check In",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden text-black">
            {displayValue(row?.original?.check_in)}
          </div>
        );
      },
    },
    {
      accessorKey: "last_online",
      header: "Last Login",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden text-black">
            {displayValue(row?.original?.last_online)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row.original.id}
          data={row?.original}
          refetch={refetch}
          handleEditMember={handleEditMember}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: memberTableData as MemberTableDatatypes[],
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

  function handleMembershipplan(value: string) {
    setFilter((prev) => ({
      ...prev,
      membership_plan: value,
    }));
  }

  function handleCoachAssigned(value: string) {
    setFilter((prev) => ({
      ...prev,
      coach_assigned: value,
    }));
  }

  function handleMemberStatus(value: string) {
    setFilter((prev) => ({
      ...prev,
      status: value,
    }));
  }

  const filterDisplay = [
    {
      type: "select",
      name: "membership_plan",
      label: "Membership",
      options: membershipPlans,
      function: handleMembershipplan,
    },
    {
      type: "select",
      name: "coach_assigned",
      label: "Coach",
      options: coachesData && coachesData,
      function: handleCoachAssigned,
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "active", name: "Active" },
      ],
      function: handleMemberStatus,
    },
  ];

  console.log({ searchCretiria });
  // Function to go to the next page

  const totalRecords = memberData?.total_counts || 0;
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2 px-4 py-2 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Search className="size-4 text-gray-400 absolute left-1 z-40 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by member name"
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
              ) : memberTableData.length > 0 ? (
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
                    No Members Added yet!.
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
            {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${memberData?.filtered_counts} Items  `}
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
      {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}
      <MemberFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilter}
        setSearchCriteria={setSearchCretiria}
        filterDisplay={filterDisplay}
      />
      <MemberForm isOpen={isOpen} setOpen={setOpen} data={data} />
    </div>
  );
}
