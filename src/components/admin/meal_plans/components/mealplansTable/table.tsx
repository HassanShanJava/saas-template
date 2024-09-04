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
import { PlusIcon, Search } from "lucide-react";
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
import { ErrorType, mealPlanDataType, membeshipsTableType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import MealPlanForm from "../modal/meal-plan-form";
import { useGetMealPlansQuery } from "@/services/mealPlansApi";
import { useDebounce } from "@/hooks/use-debounce";
import { Separator } from "@/components/ui/separator";
import TableFilters from "@/components/ui/table/data-table-filter";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { useGetFoodsQuery } from "@/services/foodsApi";
import { useGetMembersListQuery } from "@/services/memberAPi";
import { visibleFor } from "@/constants/meal_plans";

const visibleForMap = Object.fromEntries(
  visibleFor.map((vf) => [vf.label, vf.value])
);

const { VITE_VIEW_S3_URL } = import.meta.env;

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
  sort_key?: string;
  search_key?: string;
  total_nutrition?: number;
  fat?: number;
}

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  // sort_key: "created_at",
  sort_key: "id",
};

export default function MealPlansTableView() {
  const { toast } = useToast();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [action, setAction] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<mealPlanDataType | undefined>(undefined);
  const [searchCretiria, setSearchCretiria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");

  // search input
  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState<Record<string, any>>({});

  useEffect(() => {
    setSearchCretiria((prev) => {
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
  }, [debouncedInputValue, setSearchCretiria]);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCretiria)) {
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
    data: mealsData,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetMealPlansQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const { data: foodData } = useGetFoodsQuery(
    { org_id: orgId, query: `sort_order=desc&sort_key=created_at` },
    {
      skip: query == "",
    }
  );

  const { data: membersData } = useGetMembersListQuery(orgId);

  const mealstableData = React.useMemo(() => {
    return Array.isArray(mealsData?.data) ? mealsData?.data : [];
  }, [mealsData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<mealPlanDataType>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center justify-between w-fit">
            {row.original.profile_img ? (
              <img
                src={VITE_VIEW_S3_URL + "/" + row.original.profile_img}
                alt={row.original.name}
                loading="lazy"
                className="size-14 bg-gray-100 object-contain rounded-sm "
              />
            ) : (
              <div className="size-14 bg-gray-100 rounded-sm"></div>
            )}
            <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="capitalize cursor-pointer">
                    <span>{displayValue(
                      `${row.original.name}`.length > 8
                        ? `${row.original.name}`.substring(0, 8) + "..."
                        : `${row.original.name}`
                    )}</span>
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
      accessorKey: "visible_for",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Visible for</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("visible_for")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.visible_for}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "carbs",
      header: () => <div className="flex items-center gap-2">
        <p>Carbs</p>
        <button
          className=" size-5 text-gray-400 p-0 flex items-center justify-center"
          onClick={() => toggleSortOrder("carbs")}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button>
      </div>,
      cell: ({ row }) => {
        return <span>{row.original.carbs}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "protein",
      header: () => <div className="flex items-center gap-2">
        <p>Protein</p>
        <button
          className=" size-5 text-gray-400 p-0 flex items-center justify-center"
          onClick={() => toggleSortOrder("protein")}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button>
      </div>,
      cell: ({ row }) => {
        return <span>{row.original.protein}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fats",
      header: () => <div className="flex items-center gap-2">
        <p>Name</p>
        <button
          className=" size-5 text-gray-400 p-0 flex items-center justify-center"
          onClick={() => toggleSortOrder("name")}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button>
      </div>,
      cell: ({ row }) => {
        return <span>{row.original.fats}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "actions",
      header: ({ table }) => <span>Action</span>,
      cell: ({ row }) => {
        return (
          <DataTableRowActions
            handleEdit={handleEdit}
            data={row.original}
            refetch={refetch}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: mealstableData as mealPlanDataType[],
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

  const handleOpen = () => {
    setAction("add");
    setData(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (data: mealPlanDataType) => {
    console.log({ data }, 'edit modal')
    const payload = {
      ...data,
      visible_for: visibleForMap[data.visible_for!],
    };
    setData(payload);
    setAction("edit");
    setData(payload);
    setIsDialogOpen(true);
  };

  const handleVisiblity = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      visible_for: value,
    }));
  };
  const handleFoods = (value: any) => {
    setFilter((prev) => ({
      ...prev,
      food_id: value,
    }));
  };
  const handleMembers = (value: any) => {
    setFilter((prev) => ({
      ...prev,
      member_id: value,
    }));
  };

  const filterDisplay = [
    {
      type: "select",
      name: "visible_for",
      label: "Visible For",
      options: visibleFor.map((item) => ({ id: item.value, name: item.label })),
      function: handleVisiblity,
    },
    {
      type: "multiselect",
      name: "food_id",
      label: "Food",
      options:
        foodData?.data &&
        foodData?.data.map((food) => ({ value: food.id, label: food.name })),
      function: handleFoods,
    },
    {
      type: "multiselect",
      name: "member_id",
      label: "Members",
      options: membersData,
      function: handleMembers,
    },
  ];



  const totalRecords = mealsData?.filtered_counts || 0;
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
        <div className="flex  flex-1 space-x-2 mb-2 lg:mb-0">
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
          <Button
            className="bg-primary text-xs lg:text-base  text-black flex items-center gap-1  lg:mb-0"
            onClick={handleOpen}
          >
            <PlusIcon className="size-4" />
            Create New
          </Button>
          <button
            className="border rounded-full size-5 text-gray-400 p-5 flex items-center justify-center"
            onClick={() => setOpenFilter(true)}
          >
            <i className="fa fa-filter"></i>
          </button>
        </div>
      </div>
      <div className="rounded-none  ">
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
              ) : isLoading ? (
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

      {mealstableData.length > 0 && (
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
              {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${mealsData?.filtered_counts} Items  `}
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

      <MealPlanForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        action={action}
        setAction={setAction}
        refetch={refetch}
        data={data}
      />
    </div>
  );
}
