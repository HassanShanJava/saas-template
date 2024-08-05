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
import { useGetMembershipsQuery, useUpdateMembershipsMutation } from "@/services/membershipsApi";
import { useGetIncomeCategoryQuery } from "@/services/incomeCategoryApi";
import { useGetSalesTaxQuery } from "@/services/salesTaxApi";
import { useGetGroupQuery } from "@/services/groupsApis";
import { preventContextMenu } from "@fullcalendar/core/internal";
import MembershipFilters from "./data-table-filter";
// import { DataTableFacetedFilter } from "./data-table-faced-filter";

const status = [
  { value: "true", label: "Active", color: "bg-green-500" },
  { value: "false", label: "Inactive", color: "bg-blue-500" },
];


const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
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
interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
}

export default function MembershipsTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
    const [searchCretiria, setSearchCretiria] = useState<searchCretiriaType>({
      limit: 10,
      offset: 0,
      sort_order: "desc",
    });
    const [query, setQuery] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [filterData, setFilter] = useState({});

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
    data: membershipsData,
    isLoading,
    refetch,
  } = useGetMembershipsQuery({ org_id: orgId, query: query },
    {
      skip: query == "",
    });
  const [updateMemberships]=useUpdateMembershipsMutation()

  const { data: groupData } = useGetGroupQuery(orgId);

  const { data: incomeCatData } = useGetIncomeCategoryQuery({org_id:orgId,query:""});

  const { data: salesTaxData } = useGetSalesTaxQuery({org_id:orgId,query:""});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction]=useState<'add'|'edit'>('add')

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState({});
  
  const toggleSortOrder = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "desc" ? "asc" : "desc",
    }));
  };

  const membershipstableData = React.useMemo(() => {
    return Array.isArray(membershipsData) ? membershipsData : [];
  }, [membershipsData]);

  const { toast } = useToast();

  const [data, setData] = useState<membeshipsTableType|undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});
  const [filters, setFilters] = useState<any>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjust this based on your preference
  });

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

  const handleStatusChange=async(payload:{status:string, id:number, org_id:number})=>{
    console.log({payload})
    try {
      // payload.status=Boolean(payload.status)
      const resp = await updateMemberships(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
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

  }

  const handleEditMembership=(data:membeshipsTableType)=>{
    const updatedObject = {
      ...data,
      ...data.access_time,
      ...data.renewal_details
    };
    setData(updatedObject)
    setAction('edit')
    setIsDialogOpen(true)
  }

  const columns: ColumnDef<membeshipsTableType>[] = [
    {
      accessorKey: "name",
      header: ({ table }) => <span>Membership Name</span>,
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "group_id",
      header: ({ table }) => <span>Group</span>,
      cell: ({ row }) => {
        const group = groupData?.filter(
          (item) => item.value == row.original.group_id
        )[0];
        return <span>{group?.label}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "duration",
      header: ({ table }) => <span>Duration</span>,
      cell: ({ row }) => {
        const { duration_no, duration_type } = row.original.access_time as AccessTime;
        return <span>{`${duration_no} ${durationLabels[duration_type]}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "income_category_id",
      header: ({ table }) => <span>Income Category</span>,
      cell: ({ row }) => {
        const incomeCat = incomeCatData?.filter(
          (item) => item.id == row.original.income_category_id
        )[0];
        return <span>{`${incomeCat?.name}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "net_price",
      header: ({ table }) => <span>Net Price</span>,
      cell: ({ row }) => {
        const { net_price } = row.original;
        return <span>{`Rs. ${net_price}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "discount",
      header: ({ table }) => <span>Discount</span>,
      cell: ({ row }) => {
        const { discount } = row.original;

        return <span>{`${discount?.toFixed(2)}%`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tax_rate",
      header: ({ table }) => <span>Tax/VAT Rate</span>,
      cell: ({ row }) => {
        const incomeCat = incomeCatData?.filter(
          (item) => item.id == row.original.income_category_id
        )[0];
        const saleTax = salesTaxData?.filter(
          (item) => item.id == incomeCat?.sale_tax_id
        )[0];
        return <span>{`SRB (${saleTax?.percentage.toFixed(2)}%) `}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "total_price",
      header: ({ table }) => <span>Total Amount</span>,
      cell: ({ row }) => {
        const { total_price } = row.original;
        return <span>{`Rs. ${total_price}`}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: ({ table }) => <span>Status</span>,
      cell: ({ row }) => {
        const value = row.original?.status != null ? row.original?.status + "" : "false";
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original.org_id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e) =>
              handleStatusChange({ status: e, id: id, org_id: org_id })
            }
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
    {
      id: "actions",
      header: "Actions",
      maxSize: 100,
      cell: ({ row }) => (
        <DataTableRowActions
          data={row.original}
          refetch={refetch}
          handleEdit={handleEditMembership}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: membershipstableData as membeshipsTableType[],
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

  const handleOpen=()=>{
    setAction('add')
    setIsDialogOpen(true)
    setData(undefined)
  }

  const handleStatus =(value:string)=>{
    setFilter(prev=>({
      ...prev,
      status:value
    }))
  }
  const handleGroup =(value:number)=>{
    console.log("grop")
    setFilter(prev=>({
      ...prev,
        group_id:value
    }))
  }


  const filterDisplay = [
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [{id:"true", name:"Active"},{id:"false",name:"Inactive"}],
      function: handleStatus,
    },
    {
      type: "combobox",
      name: "group",
      label: "Group",
      options: groupData,
      function: handleGroup,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-1 items-center  ">
          <p className="font-semibold text-2xl">Memberships</p>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1 font-semibold"
          onClick={handleOpen}
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>
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
          <i className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order=='desc'?"rotate-180":"-rotate-180"}`}></i>
        </button>
        {/* <DataTableViewOptions table={table} action={handleExportSelected} /> */}
      </div>
      <div className="rounded-none  ">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 flex w-[100px] items-center justify-start text-sm font-medium">
          {/* {count?.total_members} */}
        </div>

        <div className="flex items-center justify-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const newSize = Number(value);
                setSearchCretiria((prev) => ({ ...prev, limit: newSize }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{pagination.pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
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
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
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
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
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

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex "
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

      <MembershipForm isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} data={data} setData={setData} refetch={refetch} action={action} setAction={setAction}/>
      <MembershipFilters
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
