import React, { useEffect, useMemo, useState } from "react";
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
import {
  ErrorType,
  MultiSelectOption,
  Option,
  Workout,
  WorkoutPlanView,
} from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import WorkoutPlanForm from "../workoutform/workout-form";
import { useNavigate } from "react-router-dom";
import { initialValue, displayValue } from "@/utils/helper";
import { searchCritiriaType } from "@/constants/workout/index";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useGetAllWorkoutDayQuery,
  visibleFor,
  workoutGoals,
} from "@/lib/constants/workout";
import { useGetAllWorkoutQuery } from "@/services/workoutService";
import { Separator } from "@/components/ui/separator";
import TableFilters from "@/components/ui/table/data-table-filter";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { LevelsOptions, visibilityOptions } from "@/utils/Enums";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
export default function WorkoutPlansTableView() {
  const navigate = useNavigate();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { toast } = useToast();

  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState({});

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchCritiria, setSearchCritiria] =
    useState<searchCritiriaType>(initialValue);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSearchCritiria((prev) => {
      const newCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
        newCriteria.offset = 0;
        newCriteria.sort_order = "desc";
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCritiria]);

  useEffect(() => {
    const params = new URLSearchParams();
    // Iterate through the search criteria
    for (const [key, value] of Object.entries(searchCritiria)) {
      console.log("just checking here", [key, value]);
      if (value !== undefined && value !== null) {
        // Check if the value is an array
        if (Array.isArray(value)) {
          value.forEach((val) => {
            params.append(key, val); // Append each array element as a separate query parameter
          });
        } else {
          params.append(key, value); // For non-array values
        }
      }
    }

    // Create the final query string
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery); // Update the query state for API call
  }, [searchCritiria]);

  const toggleSortOrder = (key: string) => {
    setSearchCritiria((prev) => {
      const newSortOrder = "desc";
      prev.sort_key === key
        ? prev.sort_order === "desc"
          ? "asc"
          : "desc"
        : "desc";

      return {
        ...prev,
        sort_key: key,
        sort_order: newSortOrder,
      };
    });
  };

  const {
    data: workoutdata,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetAllWorkoutQuery(
    {
      org_id: orgId,
      query: query,
    },
    {
      skip: query == "", //query == "", need to do this
    }
  );

  useEffect(() => {
    if (isError) {
      const typedError = error as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: typedError.data?.detail ?? "Internal Server Error",
      });
    }
  }, [isError]);

  const WorkoutTableData = useMemo(() => {
    return Array.isArray(workoutdata?.data) ? workoutdata?.data : [];
  }, [workoutdata]);

  const columns: ColumnDef<WorkoutPlanView>[] = [
    {
      accessorKey: "Plan name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Plan Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("plan_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCritiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex px-2 text-ellipsis whitespace-nowrap overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="capitalize cursor-pointer">
                    {displayValue(
                      `${row.original.workout_name}`.length > 8
                        ? `${row.original.workout_name}`.substring(0, 8) + "..."
                        : `${row.original.workout_name}`
                    )}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{displayValue(`${row?.original?.workout_name}`)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "goals",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Goal</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("goal")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCritiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.goals)}
          </div>
        );
      },
    },
    {
      accessorKey: "level",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Level</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("level")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCritiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.level)}
          </div>
        );
      },
    },
    {
      accessorKey: "visible_for",
      meta: "Visible For",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Visible For</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("visible_for")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCritiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex px-2 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row.original.visible_for)}
          </div>
        );
      },
    },

    {
      accessorKey: "week",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Week(X)</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("week")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCritiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.weeks.toString())}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: ({ table }) => <span>Actions</span>,
      cell: ({ row }) => {
        <DataTableRowActions
          row={row.original.id}
          data={row?.original}
          refetch={refetch}
        />;
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: WorkoutTableData as WorkoutPlanView[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  const handleOpen = () => {
    navigate("/admin/workoutplans/add/step/1");
  };

  const totalRecords = workoutdata?.filtered_counts || 0;
  const {
    searchCriteria,
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
  } = usePagination({ totalRecords });
  // const lastPageOffset = Math.max(
  //   0,
  //   Math.floor((totalRecords - 1) / searchCritiria.limit) * searchCritiria.limit
  // );
  // const isLastPage = searchCritiria.offset >= lastPageOffset;
  // const nextPage = () => {
  //   if (!isLastPage) {
  //     setSearchCritiria((prev) => ({
  //       ...prev,
  //       offset: prev.offset + prev.limit,
  //     }));
  //   }
  // };

  // // Function to go to the previous page
  // const prevPage = () => {
  //   setSearchCritiria((prev) => ({
  //     ...prev,
  //     offset: Math.max(0, prev.offset - prev.limit),
  //   }));
  // };

  // // Function to go to the first page
  // const firstPage = () => {
  //   setSearchCritiria((prev) => ({
  //     ...prev,
  //     offset: 0,
  //   }));
  // };

  // // Function to go to the last page
  // const lastPage = () => {
  //   if (!isLastPage) {
  //     setSearchCritiria((prev) => ({
  //       ...prev,
  //       offset: lastPageOffset,
  //     }));
  //   }
  // };

  interface Filter {
    visible_for?: string;
    goals?: string[];
    level?: string; // Keep this as string
  }

  type FilterDisplayItem =
    | {
        type: "select";
        name: "visible_for" | "level";
        label: string;
        options?: Option[];
        function: (value: string) => void;
      }
    | {
        type: "multiselect";
        name: "goals";
        label: string;
        options?: Option[];
        function: (value: string[]) => void;
      };

  const handleFilterChange = <T extends keyof Filter>(
    key: T,
    value: Filter[T]
  ) => {
    setFilter((prev: Filter) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filterDisplay: FilterDisplayItem[] = [
    {
      type: "multiselect",
      name: "goals",
      label: "Goals",
      // options: workoutGoals.map((food) => ({ value: food.value, label: food.name })),
      function: (value: string[]) => handleFilterChange("goals", value),
    },
    {
      type: "select",
      name: "visible_for",
      label: "Visible For",
      options: visibleFor.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("visible_for", value),
    },
    {
      type: "select",
      name: "level",
      label: "Level",
      options: LevelsOptions.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("level", value),
    },
  ];
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
            onClick={() => handleOpen()}
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
              {true ? (
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
              ) : WorkoutTableData.length > 0 ? (
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
      {WorkoutTableData.length > 0 && (
        // <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
        //   <div className="flex items-center justify-center gap-2">
        //     <div className="flex items-center gap-2">
        //       <p className="text-sm font-medium">Items per page:</p>
        //       <Select
        //         value={searchCritiria.limit.toString()}
        //         onValueChange={(value) => {
        //           const newSize = Number(value);
        //           setSearchCritiria((prev) => ({
        //             ...prev,
        //             limit: newSize,
        //             offset: 0, // Reset offset when page size changes
        //           }));
        //         }}
        //       >
        //         <SelectTrigger className="h-8 w-[70px] !border-none shadow-none">
        //           <SelectValue>{searchCritiria.limit}</SelectValue>
        //         </SelectTrigger>
        //         <SelectContent side="bottom">
        //           {[5, 10, 20, 30, 40, 50].map((pageSize) => (
        //             <SelectItem key={pageSize} value={pageSize.toString()}>
        //               {pageSize}
        //             </SelectItem>
        //           ))}
        //         </SelectContent>
        //       </Select>
        //     </div>
        //     <Separator
        //       orientation="vertical"
        //       className="h-11 w-[1px] bg-gray-300"
        //     />
        //     <span>
        //       {" "}
        //       {`${searchCritiria.offset + 1} - ${searchCritiria.limit} of ${workoutdata?.filtered_counts} Items  `}
        //     </span>
        //   </div>

        //   <div className="flex items-center justify-center gap-2">
        //     <div className="flex items-center space-x-2">
        //       <Separator
        //         orientation="vertical"
        //         className="hidden lg:flex h-11 w-[1px] bg-gray-300"
        //       />

        //       <Button
        //         variant="outline"
        //         className="hidden h-8 w-8 p-0 lg:flex border-none !disabled:cursor-not-allowed"
        //         onClick={firstPage}
        //         disabled={searchCritiria.offset === 0}
        //       >
        //         <DoubleArrowLeftIcon className="h-4 w-4" />
        //       </Button>

        //       <Separator
        //         orientation="vertical"
        //         className="h-11 w-[0.5px] bg-gray-300"
        //       />

        //       <Button
        //         variant="outline"
        //         className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
        //         onClick={prevPage}
        //         disabled={searchCritiria.offset === 0}
        //       >
        //         <ChevronLeftIcon className="h-4 w-4" />
        //       </Button>

        //       <Separator
        //         orientation="vertical"
        //         className="h-11 w-[1px] bg-gray-300"
        //       />

        //       <Button
        //         variant="outline"
        //         className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
        //         onClick={nextPage}
        //         disabled={isLastPage}
        //       >
        //         <ChevronRightIcon className="h-4 w-4" />
        //       </Button>

        //       <Separator
        //         orientation="vertical"
        //         className="hidden lg:flex h-11 w-[1px] bg-gray-300"
        //       />

        //       <Button
        //         variant="outline"
        //         className="hidden h-8 w-8 p-0 lg:flex border-none disabled:cursor-not-allowed"
        //         onClick={lastPage}
        //         disabled={isLastPage}
        //       >
        //         <DoubleArrowRightIcon className="h-4 w-4" />
        //       </Button>
        //     </div>
        //   </div>
        // </div>
        <Pagination
          limit={searchCriteria.limit}
          offset={searchCriteria.offset}
          totalItems={totalRecords}
          onLimitChange={handleLimitChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onFirstPage={handleFirstPage}
          onLastPage={handleLastPage}
        />
      )}

      <TableFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilter}
        setSearchCriteria={setSearchCritiria}
        filterDisplay={filterDisplay}
      />
    </div>
  );
}
