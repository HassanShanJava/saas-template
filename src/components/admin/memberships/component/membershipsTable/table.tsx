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
const displayValue = (value: any) => (value === null ? "N/A" : value);
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
import { PlusIcon } from "lucide-react";
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
import { ErrorType, membeshipsTableType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import MembershipForm from "../modal/membership-form";
import {
  useGetMembershipsQuery,
  useUpdateMembershipsMutation,
} from "@/services/membershipsApi";
import { useGetIncomeCategorListQuery } from "@/services/incomeCategoryApi";
import { useGetSalesTaxListQuery } from "@/services/salesTaxApi";
import { useGetGroupQuery } from "@/services/groupsApis";
import { Separator } from "@/components/ui/separator";
import TableFilters from "@/components/ui/table/data-table-filter";
import { Search } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useDebounce } from "@/hooks/use-debounce";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { roundToTwoDecimals } from "@/utils/helper";

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
];

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  // sort_key: "created_at",
  sort_key: "id",
};

const durationLabels = {
  weekly: "Weeks",
  monthly: "Months",
  yearly: "Years",
} as const;

interface AccessTime {
  duration_no: number;
  duration_type: keyof typeof durationLabels; // ensures duration_type is one of the keys in durationLabels
}

const downloadCSV = (data: membeshipsTableType[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
interface searchCriteriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
}

export default function MembershipsTableView() {
  const { membership } = JSON.parse(
    localStorage.getItem("accessLevels") as string
  );

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [searchCriteria, setSearchCriteria] =
    useState<searchCriteriaType>(initialValue);
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filterData, setFilter] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchCriteria((prev) => {
      const newCriteria = { ...prev };
      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
        newCriteria.offset = 0;
        newCriteria.sort_key = "id";
        // newCriteria.sort_key = "created_at";

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
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val); // Append each array element as a separate query parameter
          });
        } else {
          params.append(key, value); // For non-array values
        }
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCriteria]);

  const {
    data: membershipsData,
    isLoading,
    refetch,
  } = useGetMembershipsQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );
  const [updateMemberships] = useUpdateMembershipsMutation();

  const { data: groupData } = useGetGroupQuery(orgId);

  const { data: incomeCatData } = useGetIncomeCategorListQuery(orgId);

  const { data: salesTaxData } = useGetSalesTaxListQuery(orgId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState<"add" | "edit">("add");

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState({});

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

  const membershipstableData = React.useMemo(() => {
    return Array.isArray(membershipsData?.data) ? membershipsData.data : [];
  }, [membershipsData]);

  const { toast } = useToast();

  const [data, setData] = useState<membeshipsTableType | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});
  const [filters, setFilters] = useState<any>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value }, "name,value");
    let finalValue: number | string = value;
    if (name == "sale_tax_id") {
      finalValue = Number(value);
    }
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: finalValue };
      console.log("After update:", updatedData);
      return updatedData;
    });
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
    downloadCSV(selectedRows, "selected_data.csv");
  };

  const handleStatusChange = async (payload: {
    status: string;
    id: number;
    org_id: number;
  }) => {
    console.log({ payload });
    try {
      // payload.status=Boolean(payload.status)
      const resp = await updateMemberships(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Membership Updated Successfully",
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

  const handleEditMembership = (data: membeshipsTableType) => {
    const updatedObject = {
      ...data,
      ...data.access_time,
      ...data.renewal_details,
    };
    setData(updatedObject);
    setAction("edit");
    setIsDialogOpen(true);
  };

  const actionsColumn: ColumnDef<membeshipsTableType> = {
    id: "actions",
    header: "Actions",
    maxSize: 100,
    cell: ({ row }) => (
      <DataTableRowActions
        access={membership}
        data={row.original}
        refetch={refetch}
        handleEdit={handleEditMembership}
      />
    ),
  };

  const columns: ColumnDef<membeshipsTableType>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex  items-center gap-2">
          <p className="text-nowrap">Membership Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
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
                    <span>
                      {displayValue(
                        `${row.original.name}`.length > 8
                          ? `${row.original.name}`.substring(0, 8) + "..."
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
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "group_id",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Group</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("group_id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const group = groupData?.filter(
          (item) => item.value == row.original.group_id
        )[0];
        return <span className="capitalize">{group?.label}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "duration",
      header: ({ table }) => <span className="text-nowrap">Duration</span>,
      cell: ({ row }) => {
        const { duration_no, duration_type } = row.original
          .access_time as AccessTime;
        return (
          <span className="text-nowrap">{`${duration_no} ${durationLabels[duration_type]}`}</span>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "income_category_id",
      header: () => (
        <div className="flex  items-center gap-2">
          <p className="text-nowrap">Income Category</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("income_category_id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const incomeCat = incomeCatData?.filter(
          (item) => item.id == row.original.income_category_id
        )[0];
        return (
          <span className="text-nowrap capitalize">{`${incomeCat?.name}`}</span>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "net_price",
      header: () => (
        <div className="flex  items-center gap-2">
          <p className="text-nowrap">Net Price</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("net_price")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const { net_price } = row.original;
        return <span>{`Rs. ${net_price}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "discount",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Discount</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("discount")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const { discount } = row.original;

        return <span>{`${discount?.toFixed(2)}%`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "payment_method",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Payment Method</p>
        </div>
      ),
      cell: ({ row }) => {
        const { payment_method } = row.original;

        return <span className="capitalize">{payment_method}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tax_rate",
      header: ({ table }) => <span className="text-nowrap">Tax/VAT Rate</span>,
      cell: ({ row }) => {
        const incomeCat = incomeCatData?.filter(
          (item) => item.id == row.original.income_category_id
        )[0];
        const saleTax = salesTaxData?.filter(
          (item) => item.id == incomeCat?.sale_tax_id
        )[0];
        return (
          <span className="text-nowrap">{`SRB (${saleTax?.percentage.toFixed(2)}%) `}</span>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "total_price",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Total Amount</p>
          <button
            className=" size-5 text-gray-400 p-2 flex items-center justify-center"
            onClick={() => toggleSortOrder("total_price")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const { total_price } = row.original;
        return <span className="text-nowrap">{`Rs. ${total_price}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
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
          row.original?.status != null ? row.original?.status + "" : "false";
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original.org_id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e) =>
              handleStatusChange({ status: e, id: id, org_id: org_id })
            }
            disabled={membership == "read"}
          >
            <SelectTrigger className="h-8">
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
    ...(membership !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: membershipstableData as membeshipsTableType[],
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

  const handleOpen = () => {
    setAction("add");
    setIsDialogOpen(true);
    setData(undefined);
  };

  const handleFilterChange = (
    field: string,
    value: string | number | React.ChangeEvent<HTMLInputElement>
  ) => {
    let newValue;
    // Check if the value is coming from an input event or passed directly
    if (typeof value === "string" || typeof value === "number") {
      newValue = value;
    } else {
      newValue = value.target.value;
    }

    if (field === "discount_percentage") {
      newValue = Math.min(Number(newValue), 100); // Capping the discount percentage to 100
    }

    // Update the filter state based on field and value
    setFilter((prev) => {
      const newFilter = { ...prev };

      if (String(newValue).trim() === "") {
        delete newFilter[field];
      } else {
        newFilter[field] = newValue;
      }

      return newFilter;
    });
  };

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
      name: "group_id",
      label: "Group",
      options: groupData,
      function: (value: number) => handleFilterChange("group_id", value),
    },
    {
      type: "combobox",
      name: "income_category_id",
      label: "Income Category",
      options: incomeCatData?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
      function: (value: number) =>
        handleFilterChange("income_category_id", value),
    },
    {
      type: "percentage",
      name: "discount_percentage",
      label: "Discount Percentage",
      function: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFilterChange("discount_percentage", e),
    },
    {
      type: "number",
      name: "total_amount",
      label: "Total Amount",
      function: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFilterChange("total_amount", e),
    },
  ];

  const totalRecords = membershipsData?.filtered_counts || 0;
  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<searchCriteriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });

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
          {membership !== "read" && (
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
        <ScrollArea className="max-w-full relative">
          <ScrollBar
            orientation="horizontal"
            className="relative z-30 cursor-grab"
          />
          <Table className=" w-full   overflow-x-scroll">
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
              ) : membershipstableData.length > 0 ? (
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
      {membershipstableData.length > 0 && (
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

      <MembershipForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        data={data}
        setData={setData}
        refetch={refetch}
        action={action}
        setAction={setAction}
      />
    </div>
  );
}
