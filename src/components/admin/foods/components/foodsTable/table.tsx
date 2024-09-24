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
import { ChevronRightIcon, PlusIcon, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateFoodTypes, ErrorType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import FoodForm from "../modal/food-form";
import { useGetFoodsQuery } from "@/services/foodsApi";
import { useDebounce } from "@/hooks/use-debounce";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { Separator } from "@/components/ui/separator";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon } from "lucide-react";
import TableFilters from "@/components/ui/table/data-table-filter";
import { visibleFor, categories, weights } from "@/constants/food";
const { VITE_VIEW_S3_URL } = import.meta.env;

// removed for enum changes
// const categoryMap = Object.fromEntries(
//   categories.map((cat) => [cat.label, cat.value])
// );
// const visibleForMap = Object.fromEntries(
//   visibleFor.map((vf) => [vf.label, vf.value])
// );
// const weightsMap = Object.fromEntries(weights.map((w) => [w.label, w.value]));

const downloadCSV = (data: CreateFoodTypes[], fileName: string) => {
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
  sort_key: "id",
};

export default function FoodsTableView() {
  const { food } = JSON.parse(localStorage.getItem("accessLevels") as string)
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [action, setAction] = useState<"add" | "edit">("add");
  const [data, setData] = useState<CreateFoodTypes | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
    data: foodData,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetFoodsQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const handleCloseDailog = () => setIsDialogOpen(false);

  const foodstableData = React.useMemo(() => {
    return Array.isArray(foodData?.data) ? foodData?.data : [];
  }, [foodData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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

  const actionsColumn: ColumnDef<CreateFoodTypes> = {
    accessorKey: "action",
    header: ({ table }) => <span>Action</span>,
    cell: ({ row }) => (
      <DataTableRowActions
        access={food}
        handleEdit={handleEdit}
        data={row.original}
        refetch={refetch}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const columns: ColumnDef<CreateFoodTypes>[] = [
    {
      accessorKey: "name",
      meta: "Name",
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
            {row.original.img_url ? (
              <img
                src={VITE_VIEW_S3_URL + "/" + row.original.img_url}
                alt={row.original.name}
                loading="lazy"
                className="size-8 bg-gray-100 object-cover rounded-sm "
              />
            ) : (
              <div className="size-8 bg-gray-100 rounded-sm"></div>
            )}
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="capitalize cursor-pointer">
                      <span>{displayValue(
                        `${row.original.name}`.length > 15
                          ? `${row.original.name}`.substring(0, 15) + "..."
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
      accessorKey: "brand",
      meta: "Brand",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Brand</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("brand")}
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
                    <span>{displayValue(
                      `${row.original.brand}`.length > 8
                        ? `${row.original.brand}`.substring(0, 8) + "..."
                        : `${row.original.brand}`
                    )}</span>
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize text-sm">
                    {displayValue(`${row?.original?.brand}`)}
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
    // {
    //   accessorKey: "weight_unit",
    //   meta: "weight_unit",
    //   header: () => (
    //     <div className="flex items-center gap-2">
    //       <p>Weight/Unit</p>
    //       <button
    //         className=" size-5 text-gray-400 p-0 flex items-center justify-center"
    //         onClick={() => toggleSortOrder("brand")}
    //       >
    //         <i
    //           className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
    //         ></i>
    //       </button>
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     return <span className="capitalize">{row.original.weight_unit}</span>;
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "category",
      meta: "Category",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Category</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("category")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.category}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "total_nutrition",
      meta: "Total Nutrition (g)",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Total Nutrition (g)</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("total_nutrition")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.total_nutrition}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fat",
      meta: "Total Fat",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Total Fat</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("fat")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.fat}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    ...(food !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: foodstableData as CreateFoodTypes[],
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
  };

  const handleEdit = (data: CreateFoodTypes) => {
    setAction("edit");
    setData(data);
    setIsDialogOpen(true);
  };

  const totalRecords = foodData?.filtered_counts || 0;
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

  const handleTotalNutritions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter((prev) => {
      const newFilter = { ...prev };

      if (value.trim() == "") {
        delete newFilter.total_nutrition;
      } else {
        newFilter.total_nutrition = value;
      }

      return newFilter;
    });
  };

  const handleFat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter((prev) => {
      const newFilter = { ...prev };

      if (value.trim() == "") {
        delete newFilter.total_fat;
      } else {
        newFilter.total_fat = value;
      }

      return newFilter;
    });
  };

  const handleCategory = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const filterDisplay = [
    {
      type: "select",
      name: "category",
      label: "Food Category",
      options: categories.map((item) => ({ id: item.label, name: item.label })),
      function: handleCategory,
    },
    {
      type: "number",
      name: "total_nutrition",
      label: "Total Nutrition",
      function: handleTotalNutritions,
    },
    {
      type: "number",
      name: "fat",
      label: "Total Fat",
      function: handleFat,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3 py-2">
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
          {food !=="read"&&<Button
            className="bg-primary text-xs lg:text-base  text-black flex items-center gap-1  lg:mb-0"
            onClick={handleOpen}
          >
            <PlusIcon className="size-4" />
            Create New
          </Button>}
          <button
            className="border rounded-full size-5 text-gray-400 p-5 flex items-center justify-center"
            onClick={() => setOpenFilter(true)}
          >
            <i className="fa fa-filter"></i>
          </button>
        </div>
      </div>
      <div className="rounded-none border border-border  ">
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

      {/* pagination */}
      {foodstableData.length > 0 && (
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
              {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${foodData?.filtered_counts} Items  `}
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

      <FoodForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        action={action}
        setAction={setAction}
        data={data}
        setData={setData}
        refetch={refetch}
      />
    </div>
  );
}
