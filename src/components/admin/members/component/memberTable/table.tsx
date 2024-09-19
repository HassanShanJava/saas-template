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
import { Edit, PlusIcon, Search } from "lucide-react";
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
  MemberInputTypes,
  MemberTableDatatypes,
  MemberTabletypes,
} from "@/app/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { DataTableViewOptions } from "./data-table-view-options";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  useGetAllMemberQuery,
  useUpdateMemberMutation,
} from "@/services/memberAPi";
import { useGetMembershipListQuery } from "@/services/membershipsApi";
import { Separator } from "@/components/ui/separator";
import MemberForm from "../../memberForm/form";
import TableFilters from "@/components/ui/table/data-table-filter";
import {
  displayDate,
  displayDateTime,
  downloadCSV,
  membersMapper,
} from "@/utils/helper";
const { VITE_VIEW_S3_URL } = import.meta.env;

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
  sort_key: "id",
};

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
  { value: "pending", label: "Pending", color: "bg-orange-500", hide: true },
];
export default function MemberTableView() {
  const { member } = JSON.parse(localStorage.getItem("accessLevels") as string)
  const [action, setAction] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState<boolean>(false);
  const [editMember, setEditMember] = useState<MemberTableDatatypes | null>(
    null
  );
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
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
        newCriteria.offset = 0;
        newCriteria.sort_key = "id";
        newCriteria.sort_order = "desc";
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

  const { data: membershipPlans } = useGetMembershipListQuery(orgId);

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

  function handleOpenForm() {
    setAction("add");
    setEditMember(null);
    setOpen(true);
  }

  function handleEditForm(data: MemberTableDatatypes) {
    setAction("edit");
    setEditMember(data);
    setOpen(true);
  }

  function openFormHandle() {
    setOpen(true);
  }

  const memberTableData = React.useMemo(() => {
    return Array.isArray(memberData?.data) ? memberData?.data : [];
  }, [memberData]);
  const { toast } = useToast();
  console.log("data", { memberData, error });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<MemberTableDatatypes | undefined>(undefined);

  const displayValue = (value: string | undefined | null) =>
    value == null || value == undefined || value.trim() == "" ? "N/A" : value;

  const handleExportSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedRows.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select one or more record(s) to perform this action",
      });
      return;
    }
    console.log({ selectedRows }, typeof selectedRows);
    const updatedSelectedRows = selectedRows.map((row) => ({
      ...row,
      membership_plan_id: membershipPlans.filter(
        (plan: any) => plan.id == row.membership_plan_id
      )[0].name,
    }));

    downloadCSV(updatedSelectedRows, "members_list.csv", membersMapper);
  };

  const [updateMember] = useUpdateMemberMutation();

  const handleStatusChange = async (payload: {
    client_status: string;
    id: number;
    org_id: number;
    source_id: number;
    country_id: number;
    business_id: number;
    membership_plan_id: number;
  }) => {
    try {
      const resp = await updateMember(payload).unwrap();
      if (resp) {
        refetch();
        toast({
          variant: "success",
          title: "Member Updated Successfully",
        });
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail,
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

  const actionsColumn: ColumnDef<MemberTableDatatypes> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        access={member}
        row={row.original.id}
        data={row?.original}
        refetch={refetch}
        handleEditMember={handleEditForm}
      />
    ),
  };

  const columns: ColumnDef<MemberTableDatatypes>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value: any) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        </div>
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
      accessorKey: "own_member_id",
      meta: "Member Id",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Member Id</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("id")}
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
            {/* {`${orgName?.slice(0, 2)}-${row?.original?.id}`} */}
            {displayValue(row?.original.own_member_id)}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "full_name",
      meta: "Member Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Member Name</p>
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
        console.log(
          row.original.profile_img,
          VITE_VIEW_S3_URL + "/" + row.original.profile_img
        );
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            <div className="w-14 h-14 flex gap-2 items-center justify-between">
              {row.original.profile_img ? (
                <img
                  src={VITE_VIEW_S3_URL + "/" + row.original.profile_img}
                  loading="lazy"
                  className="w-14 h-14 bg-gray-100 object-contain rounded-sm "
                />
              ) : (
                <div className="size-14 bg-gray-100 rounded-sm"></div>
              )}
            </div>
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="capitalize cursor-pointer">
                      {/* Display the truncated name */}
                      {displayValue(
                        `${row.original.first_name} ${row.original.last_name}`
                          .length > 8
                          ? `${row.original.first_name} ${row.original.last_name}`.substring(
                            0,
                            8
                          ) + "..."
                          : `${row.original.first_name} ${row.original.last_name}`
                      )}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {/* Display the full name in the tooltip */}
                    <p className="capitalize text-sm">
                      {displayValue(
                        `${row.original.first_name} ${row.original.last_name}`
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "business_name",
      meta: "Business Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Business Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("business_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="capitalize cursor-pointer">
                    {/* Display the truncated name */}
                    {!row.original.is_business &&
                      row.original.business_id == undefined
                      ? "N/A"
                      : displayValue(
                        `${row.original.business_name}`.length > 8
                          ? `${row.original.business_name}`.substring(0, 8) +
                          "..."
                          : `${row.original.business_name}`
                      )}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize text-sm">
                    {!row.original.is_business &&
                      row.original.business_id == undefined
                      ? "N/A"
                      : displayValue(`${row.original.business_name}`)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.membership_plan_id,
      id: "membership_plan_id",
      meta: "Membership Plan",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Membership Plan</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("membership_plan_id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const mebershipName =
          membershipPlans &&
          membershipPlans.filter(
            (plan: any) => plan.id == row.original.membership_plan_id
          )[0];
        return (
          <div className="capitalize flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(mebershipName?.name ?? "")}
          </div>
        );
      },
    },
    {
      accessorKey: "client_status",
      meta: "Status",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Status</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("client_status")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const value = row.original?.client_status;
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original?.org_id);
        const source_id = Number(row.original.source_id);
        const country_id = Number(row.original.country_id);
        const business_id = Number(row.original?.business_id);
        const membership_plan_id = Number(row.original?.membership_plan_id);
        return (
          <Select
            defaultValue={value}
            onValueChange={(e) =>
              handleStatusChange({
                client_status: e,
                id: id,
                org_id: org_id,
                source_id: source_id,
                country_id: country_id,
                business_id: business_id,
                membership_plan_id: membership_plan_id,
              })
            }
            disabled={statusLabel.hide}
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
                (item) =>
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
      accessorKey: "activated_on",
      meta: "Activation Date",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Activation Date</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("activated_on")}
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
            {displayDate(row?.original.activated_on)}
          </div>
        );
      },
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
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden text-black">
            {displayDateTime(row?.original?.check_in)}
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
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden text-black">
            {displayDateTime(row?.original?.last_online)}
          </div>
        );
      },
    },
    ...(member !== "read" ? [actionsColumn] : []),
  ];
  
  const table = useReactTable({
    data: memberTableData as MemberTableDatatypes[],
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

  function handleMembershipplan(value: string) {
    setFilter((prev) => ({
      ...prev,
      membership_plan: value,
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

  const totalRecords = memberData?.filtered_counts || 0;
  const lastPageOffset = Math.max(
    0,
    Math.floor((totalRecords - 1) / searchCretiria.limit) * searchCretiria.limit
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center flex-1 space-x-2 mb-2 lg:mb-0">
          <div className="flex items-center relative w-full lg:w-auto">
            <Search className="size-4 text-gray-400 absolute left-1 z-10 ml-2" />
            <FloatingLabelInput
              id="search"
              placeholder="Search by name"
              onChange={(event) => setInputValue(event.target.value)}
              className=" w-80 lg:w-64 pl-8 text-gray-400"
            />
          </div>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-row lg:flex-row lg:justify-center lg:items-center gap-2">
          {member !=="read"&&<Button
            className="bg-primary text-xs lg:text-base  text-black flex items-center gap-1  lg:mb-0"
            onClick={handleOpenForm}
          >
            <PlusIcon className="size-4" />
            Create New
          </Button>}
          <DataTableViewOptions table={table} action={handleExportSelected} />
          <button
            className="border rounded-full size-5 text-gray-400 p-5 flex items-center justify-center"
            onClick={() => setOpenFilter(true)}
          >
            <i className="fa fa-filter"></i>
          </button>
        </div>
      </div>

      <div className="rounded-none border border-border ">
        <ScrollArea className="w-full relative">
          <ScrollBar
            orientation="horizontal"
            className="relative z-30 cursor-grab"
          ></ScrollBar>
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
                    No members added yet.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {memberTableData.length > 0 && (
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
      <MemberForm
        open={open}
        setOpen={setOpen}
        memberData={editMember}
        setMemberData={setEditMember}
        action={action}
        setAction={setAction}
        refetch={refetch}
      />
    </div>
  );
}
