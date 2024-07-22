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

interface tranformData {
  id: number;
  total_credits: number;
  credits: number;
  count: number;
  validity: {
    duration_type: string | undefined;
    duration_no: number | undefined;
  };
}
interface payloadData {
  id: number;
  total_credits: number;
  validity: {
    duration_type: string | undefined;
    duration_no: number | undefined;
  };
}

export default function CreditsTableView({
  setFacilities,
}: {
  setFacilities: any;
}) {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: creditsData, isLoading } = useGetCreditsQuery(orgId);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  const [count, setCount] = useState(1);
  const creditstableData = React.useMemo(() => {
    return Array.isArray(creditsData) ? creditsData : [];
  }, [creditsData]);

  const { toast } = useToast();

  const [transformedCredits, setTransformedCredits] = useState<
    tranformData[] | undefined
  >([]);
  const [payload, setPayload] = useState<payloadData[] | undefined>([]);

  useEffect(() => {
    const data = creditsData?.map((item) => ({
      id: item.id,
      count: 1,
      credits: item.min_limit,
      total_credits: item.min_limit,
      validity: {
        duration_type: undefined,
        duration_no: undefined,
      },
    }));
    setTransformedCredits(data);
  }, [creditsData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});
  const [filters, setFilters] = useState<any>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleChangeRowInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    key: string
  ) => {
    e.preventDefault();
    const { value } = e.target;
    console.log(value, id, key, "input change");

    setTransformedCredits((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.id === id) {
          return {
            ...credit,
            validity: {
              ...credit.validity,
              [key]: Number(value),
            },
          };
        }
        return credit;
      });
    });
  };

  useEffect(() => {
    if (transformedCredits && transformedCredits?.length > 0) {
      const selectedIndexes = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
      );

      const selectedCredits = transformedCredits
        ?.filter((_, index) => selectedIndexes.includes(index.toString()))
        .map(({ id, total_credits, validity }) => ({
          id,
          total_credits,
          validity,
        }))
        .filter((item): item is payloadData => item !== null);

      setFacilities(selectedCredits);
    }
  }, [rowSelection, transformedCredits]);

  const handleChangeRowSelect = (value: string, id?: number, key?: string) => {
    console.log(value, id, key, "input change");

    setTransformedCredits((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.id === id) {
          return {
            ...credit,
            validity: {
              ...credit.validity,
              [key!]: value,
            },
          };
        }
        return credit;
      });
    });
  };
  const updateCredit = (id?: number, key?: string) => {
    if (!id || !key) return;

    setTransformedCredits((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.id === id) {
          if (key === "decrement") {
            if (credit.count === 1) {
              toast({
                variant: "destructive",
                title: "Minumum credits reached.",
              });
              return credit;
            }
            const updatedCount = credit.count - 1;
            const updatedTotalCredits = updatedCount * credit.credits;

            return {
              ...credit,
              count: updatedCount,
              total_credits: updatedTotalCredits,
            };
          } else if (key === "increment") {
            const updatedCount = credit.count + 1;
            const updatedTotalCredits = updatedCount * credit.credits;

            return {
              ...credit,
              count: updatedCount,
              total_credits: updatedTotalCredits,
            };
          }
        }
        return credit;
      });
    });
  };

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
        const id = row.original.id;
        const totalCredit = transformedCredits
          ?.filter((data) => data?.id == id)
          .map((item) => item.total_credits);
        return row.getIsSelected() ? (
          <div className="flex gap-2 items-center">
            <span className="text-xs">
              (Min. required credit: {row?.original?.min_limit}){" "}
            </span>

            <div className="flex items-center gap-4 bg-white  border border-primary rounded-lg p-2">
              <button
                onClick={() => updateCredit(id, "decrement")}
                className="text-black bg-white border border-primary rounded-lg px-2 py-1"
              >
                <i className="fa fa-minus font-semibold"></i>
              </button>

              <div className="text-black ">{totalCredit}</div>

              <button
                onClick={() => updateCredit(id, "increment")}
                className="text-white bg-primary rounded-lg px-2 py-1"
              >
                <i className="fa fa-plus font-semibold"></i>
              </button>
            </div>
          </div>
        ) : null;
      },
    },
    {
      id: "validity",
      header: "Validity",
      maxSize: 100,
      cell: ({ row }) => {
        const id = row.original.id;
        const creditData = transformedCredits?.find(
          (credit) => credit.id === id
        );

        return row.getIsSelected() ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={15}
              className="number-input w-10"
              value={creditData?.validity?.duration_no || ""}
              onChange={(e) => handleChangeRowInput(e, id, "duration_no")}
            />
            <Select
              onValueChange={(value) =>
                handleChangeRowSelect(value, id, "duration_type")
              }
              value={creditData?.validity?.duration_type || ""}
            >
              <SelectTrigger className="bg-white">
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
        pageSize: 10,
        pageIndex: 0,
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
