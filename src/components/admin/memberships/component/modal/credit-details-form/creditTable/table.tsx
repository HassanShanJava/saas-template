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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { creditDetailsTablestypes, creditTablestypes } from "@/app/types";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetCreditsQuery } from "@/services/creditsApi";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { facilites } from "..";

export default function CreditsTableView({
  facilities,
  setFacilities,
}: {
  facilities: facilites[];
  setFacilities: any;
}) {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: creditsData, isLoading } = useGetCreditsQuery(orgId);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  const creditstableData = React.useMemo(() => {
    return Array.isArray(creditsData) ? creditsData : [];
  }, [creditsData]);

  const { toast } = useToast();

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

  const columns: ColumnDef<creditDetailsTablestypes>[] = [
    {
      id: "select",
      maxSize: 50,
      size: 50,
      minSize: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px] "
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
      header: ({ table }) => <p>Credit Name</p>,
      cell: ({ row }) => {
        return <p>{row.original.name}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "credits_include",
      header: "Credits Included",
      maxSize: 100,
      cell: ({ row }) => {
        return row.getIsSelected() ? <CreditIncludes row={row} /> : null;
      },
    },
    {
      id: "validity",
      header: "Validity",
      maxSize: 100,
      cell: ({ row }) => {
        return row.getIsSelected() ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={15}
              className="number-input w-10"
            />
            <Select>
              <SelectTrigger name="contract_duration" className="bg-white">
                <SelectValue placeholder="Select contract duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"monthly"}>Monthly</SelectItem>
                <SelectItem value={"quarterly"}>Quarterly</SelectItem>
                <SelectItem value={"bi_annually"}>Bi-Annually</SelectItem>
                <SelectItem value={"yearly"}>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null;
      },
    },
  ];

  const table = useReactTable({
    data: creditstableData as creditTablestypes[],
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between ">
        <div className="flex flex-1 items-center  ">
          <div className="flex flex-1 items-center gap-4 ">
            <h1 className="font-semibold text-[#2D374] text-xl">
              Credit details
            </h1>

            <div className="flex items-center  gap-2 px-3 py-1 rounded-md border text-sm border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
              <Search className="w-[14px] h-[14px] text-gray-400 m-auto " />
              <input
                placeholder="Search by Name"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-7  outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-none  ">
        <ScrollArea className="w-full relative">
          <ScrollBar orientation="horizontal" />
          <Table
            className=""
            containerClassname="h-fit max-h-80 overflow-y-auto relative custom-scrollbar "
          >
            <TableHeader className="bg-gray-100 sticky top-0 z-50">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                      >
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
            <TableBody className="">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center "
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
              ) : creditstableData.length > 0 ? (
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
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

const CreditIncludes = ({ row }: any) => {
  const [count, setCount] = useState(1);

  return (
    <div className="flex gap-2 items-center">
      <span>(Minimum credit: {row?.original?.min_limit}) </span>

      <button
        onClick={() => setCount((prev) => 1 - prev)}
        className="text-black bg-white border border-primary rounded-lg px-3 py-2"
      >
        <i className="fa fa-minus font-semibold"></i>
      </button>

      <div className="text-black bg-white border border-primary rounded-lg px-3 py-2">
        {count * Number(row?.original?.min_limit)}
      </div>

      <button
        onClick={() => setCount((prev) => 1 + prev)}
        className="text-white bg-primary rounded-lg px-3 py-2"
      >
        <i className="fa fa-plus font-semibold"></i>
      </button>
    </div>
  );
};

