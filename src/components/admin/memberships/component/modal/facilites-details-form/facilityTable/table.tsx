
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// ui 
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
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// api and types
import { creditDetailsTablestypes, creditTablestypes, facilitiesData } from "@/app/types";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetCreditsListQuery, useGetCreditsQuery } from "@/services/creditsApi";
import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "@/types/hook-stepper";

interface TranformFacilitiesData {
  facility_id: number;
  total_credits: number;
  credits: number;
  credit_type?: string;
  count: number;
  validity: {
    type: string | undefined;
    duration: number | undefined;
  };
}
interface PayloadData {
  facility_id: number;
  credit_type: string;
  total_credits: number;
  validity: {
    type: string;
    duration: number;
  };
}

const findIndex = (id: number, array: creditTablestypes[]) => {
  return array?.findIndex((item) => item.id === id);
};


export default function FacilityTableView({
  setFacilities,
}: {
  setFacilities: any;
}) {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { getValues } = useFormContext<StepperFormValues>();
  const { data: facilitiesData, isLoading } = useGetCreditsListQuery(orgId);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});

  const facilitiestableData = React.useMemo(() => {
    return Array.isArray(facilitiesData) ? facilitiesData : [];
  }, [facilitiesData]);

  const { toast } = useToast();

  const [transformedFacilities, setTransformedFacilities] = useState<
    TranformFacilitiesData[] | undefined
  >([]);

  const [payload, setPayload] = useState<facilitiesData[]>(getValues("facilities") ? getValues("facilities") : []);

  useEffect(() => {
    const data = facilitiesData?.map((item) => ({
      facility_id: item.id,
      count: 1,
      credits: item.min_limit,
      credit_type: undefined,
      total_credits: item.min_limit,
      validity: {
        type: undefined,
        duration: undefined,
      },
    }));



    if (payload.length > 0) {
      const newRowSelection: Record<number, boolean> = {};
      payload.forEach(item => {
        const index = findIndex(item.facility_id, facilitiesData as creditTablestypes[]);
        if (index !== -1) {
          newRowSelection[index] = true;
        }
      });

      const result = data?.map((item) => {
        const updatedItem = payload.find(payloadItem => payloadItem.facility_id === item.facility_id);

        if (updatedItem) {
          const count = updatedItem.total_credits as number / item.credits;
          return {
            ...item,
            ...updatedItem,
            count: count,
            credits: item.credits,
          };
        }

        return item;
      }) || [];

      setRowSelection(newRowSelection)
      console.log({ result })
      setTransformedFacilities(result as TranformFacilitiesData[]);
    } else {
      setTransformedFacilities(data as TranformFacilitiesData[]);
    }

  }, [facilitiesData, payload]);

  const handleCreditType = (value: string, id?: number) => {

    setTransformedFacilities((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.facility_id === id) {
          return {
            ...credit,
            credit_type: value,
          };
        }
        return credit;
      });
    });
  }

  const handleChangeRowInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    key: string
  ) => {
    const { value } = e.target;
    console.log(value, id, key, "input change");

    setTransformedFacilities((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.facility_id === id) {
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

  const handleChangeRowSelect = (value: string, id?: number, key?: string) => {
    console.log(value, id, key, "input change");

    setTransformedFacilities((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.facility_id === id) {
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

    setTransformedFacilities((prevCredits) => {
      return prevCredits?.map((credit) => {
        if (credit.facility_id === id) {
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


  useEffect(() => {
    // when ever transformCredits changes it is updated in payload
    if (transformedFacilities && transformedFacilities?.length > 0) {
      const selectedIndexes = Object.keys(rowSelection).filter(
        (key) => rowSelection[Number(key)]
      );

      const selectedCredits = transformedFacilities
        ?.filter((_, index) => selectedIndexes.includes(index.toString()))
        .map(({ facility_id, total_credits, validity, credit_type }) => ({
          facility_id,
          total_credits,
          credit_type,
          validity: credit_type === "unlimited" ? {
            type:"",
            duration: 0,
          } : validity, // Set validity to {} if credit_type is "unlimited"
        }))
        .filter((item): item is PayloadData => item !== null);

      setFacilities(selectedCredits);
      console.log({ rowSelection, transformedFacilities });
    }
  }, [rowSelection, transformedFacilities]);



  console.log({ transformedFacilities })
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
      header: ({ table }) => <p>Name</p>,
      cell: ({ row }) => {
        return <p className="text-nowrap capitalize">{row.original.name}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "amount",

      header: ({ table }) => (
        <p className="text-nowrap">Credit Type</p>
      ),
      cell: ({ row }) => {
        const Credit = transformedFacilities?.find(credit => credit.facility_id == row.original.id);
        return row.getIsSelected() && (
          <Select
            defaultValue={Credit?.credit_type}
            onValueChange={(value) => handleCreditType(value, Credit?.facility_id)}
            
          >
            <SelectTrigger
              className="h-8 w-32"
            >
              <SelectValue
                placeholder={"Select type"}
                
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                value={'amount'}
              >
                Amount
              </SelectItem>
              <SelectItem
                value={'unlimited'}
              >
                Unlimited
              </SelectItem>
            </SelectContent>
          </Select>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "credits_include",
      header: "Credits Included",
      cell: ({ row }) => {
        const id = row.original.id;
        const Credit = transformedFacilities
          ?.find((data) => data?.facility_id == id)

        return row.getIsSelected() && Credit?.credit_type === "amount" ? (
          <div className="flex   items-center gap-2 justify-between !max-w-4xl">
            <span className="text-xs text-nowrap w-full max-w-40">
              (Min. required credit: {row?.original?.min_limit})
            </span>

            <div className="flex h-8  items-center justify-between gap-2 w-full max-w-36 bg-white  border border-primary rounded-lg p-2">
              <button
                onClick={() => updateCredit(id, "decrement")}
                className="text-black bg-white border border-primary rounded-lg h-6 px-1 "
              >
                <i className="fa fa-minus font-semibold"></i>
              </button>

              <div className="text-black ">{Credit?.total_credits}</div>

              <button
                onClick={() => updateCredit(id, "increment")}
                className="text-white bg-primary rounded-lg h-6 px-1"
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
        const creditData = transformedFacilities?.find(
          (credit) => credit.facility_id === id
        );

        return row.getIsSelected() && creditData?.credit_type === "amount" ? (
          <div className="flex items-center gap-2">
            {creditData?.validity.type !== "contract_duration" && <Input
              type="number"

              min={1}
              max={15}
              className="h-8 w-20"
              autoFocus
              value={creditData?.validity?.duration || ""}
              onChange={(e) => handleChangeRowInput(e, id, "duration")}
            />}
            <Select
              onValueChange={(value) =>
                handleChangeRowSelect(value, id, "type")
              }
              value={creditData?.validity?.type || ""}
            >
              <SelectTrigger className="bg-white h-8">
                <SelectValue placeholder="Select validity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"contract_duration"}>Contract Duration</SelectItem>
                <SelectItem value={"week"}>Weekly</SelectItem>
                <SelectItem value={"month"}>Monthly</SelectItem>
                <SelectItem value={"quarter"}>Quarterly</SelectItem>
                {/* <SelectItem value={"bi_annual"}>Bi-Annually</SelectItem> */}
                <SelectItem value={"year"}>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null;
      },
    },
  ];

  const table = useReactTable({
    data: facilitiestableData as creditTablestypes[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    }
  });



  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between ">
        <div className="flex flex-1 items-center  ">
          <div className="flex flex-1 items-center gap-4 ">
            <h1 className="font-semibold text-[#2D374] text-xl">
              Facility details
            </h1>

            <div className="flex items-center  gap-2 px-3 py-1 rounded-md border text-sm border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
              <Search className="w-[14px] h-[14px] text-gray-400 m-auto " />
              <input
                type="text"
                placeholder="Search by Name"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-7  outline-none"
                maxLength={50}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-none  ">
        <ScrollArea className="w-full relative">
          <ScrollBar orientation="horizontal" />
          <Table className="w-full" containerClassname="h-fit max-h-[27rem]  ">
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
              ) : facilitiestableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No facility found.
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
