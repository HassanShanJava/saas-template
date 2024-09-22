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
  difficultyEnum,
  ErrorType,
  Option,
  WorkoutPlansTableResponse,
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
  workoutLevels,
} from "@/lib/constants/workout";
import { useGetAllWorkoutQuery, useUpdateWorkoutgridMutation } from "@/services/workoutService";
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
  const [searchCriteria, setSearchCriteria] =
    useState<searchCritiriaType>(initialValue);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSearchCriteria((prev) => {
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
  }, [debouncedInputValue, setSearchCriteria]);

  useEffect(() => {
    const params = new URLSearchParams();
    // Iterate through the search criteria
    for (const [key, value] of Object.entries(searchCriteria)) {
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
  }, [searchCriteria]);

  const toggleSortOrder = (key: string) => {
    setSearchCriteria((prev) => {
      const newSortOrder =
        prev.sort_key === key && prev.sort_order === "desc" ? "asc" : "desc";

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
      skip: query == "",
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
    return (workoutdata?.data ?? []) as WorkoutPlanView[];
  }, [workoutdata]);
    const [updateGrid]=useUpdateWorkoutgridMutation();
  // const handleLevelChange = async (payload: {
  //   level: difficultyEnum;
  //   id: number;
  //   weeks: number;
  // }) => {
  //   try {
  //     const resp = await updateLevel(payload).unwrap();
  //     refetch();
  //     if (resp) {
  //       console.log({ resp });
  //       toast({
  //         variant: "success",
  //         title: "Updated Successfully",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error", { error });
  //     if (error && typeof error === "object" && "data" in error) {
  //       const typedError = error as ErrorType;
  //       toast({
  //         variant: "destructive",
  //         title: "Error in Submission",
  //         description: `${typedError.data?.detail}`,
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Error in Submission",
  //         description: `Something Went Wrong.`,
  //       });
  //     }
  //   }
  // };

  type UpdatePayload = {
    id: number;
    weeks: number;
    level?: difficultyEnum;
    goals?: string;
  };

  const handleUpdate = async (
    payload: UpdatePayload,
    updateType: "level" | "goal"
  ) => {
    try {
      const resp =
        updateType === "level"
          ? await updateGrid({
              level: payload.level!,
              id: payload.id,
              weeks: payload.weeks,
            }).unwrap()
          : await updateGrid({
              goals: payload.goals!,
              id: payload.id,
              weeks: payload.weeks,
            }).unwrap();

      refetch();

      if (resp) {
        console.log({ resp });
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
          title: "Error in Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };

  const columns: ColumnDef<WorkoutPlanView>[] = [
    {
      accessorKey: "Plan name",
      header: () => (
        <div className="flex items-center gap-2">
          <span>Plan Name</span>
          <button
            className="text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("plan_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        console.log("row", row);
        return (
          <div className="flex px-2 w-fit">
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
            className="text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("goals")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const id = Number(row.original.id);
        const weeks = Number(row.original.weeks);
        let goals = row.original.goals;
        return (
          <Select
            value={goals} 
            onValueChange={(newValue) => {
              handleUpdate({ id: id, weeks: weeks, goals: newValue }, "goal");
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue className="text-gray-400">
                <span className="flex gap-2 items-center">
                  <span>{goals}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {workoutGoals.map(
                (item: any) =>
                  !item.hide && (
                    <SelectItem key={item.value} value={item.label}>
                      {item.label}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
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
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const id = Number(row.original.id);
        const weeks = Number(row.original.weeks);
        const level = row.original.level;
        return (
          <>
            <Select
               defaultValue={level as difficultyEnum}
               onValueChange={(e: difficultyEnum ) => {
                if(e){
                  handleUpdate({ id: id, weeks: weeks, level: e }, "level");
                }
              }}
            >
              <SelectTrigger  className="w-[150px]">
                <SelectValue placeholder="Status" className="text-gray-400">
                  <span className="flex gap-2 items-center">
                    <span>{level}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workoutLevels.map(
                  (item: any) =>
                    !item.hide && (
                      <SelectItem key={item.value} value={item.label}>
                        {item.label}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </>
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
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
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
            onClick={() => toggleSortOrder("weeks")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
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
        return (
          <DataTableRowActions
            row={row.original.id}
            data={row?.original}
            refetch={refetch}
          />
        );
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
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<searchCritiriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });
  interface Filter {
    visible_for?: string;
    goals?: string[];
    level?: string;
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
        options?: { value: string; label: string }[];
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

  const handleFilterChangeGoal = <T extends keyof Filter>(
    key: T,
    labels: Filter[T]
  ) => {
    setFilter((prev: Filter) => ({
      ...prev,
      [key]: labels,
    }));
  };
  const filterDisplay: FilterDisplayItem[] = [
    {
      type: "multiselect",
      name: "goals",
      label: "Goals",
      options: workoutGoals.map((item) => ({
        value: item.label,
        label: item.label,
      })),
      function: (labels: string[]) => handleFilterChangeGoal("goals", labels),
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

  console.log(
    "workout data",
    workoutdata?.data,
    WorkoutTableData,
    "Total Records",
    { totalRecords }
  );
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
              ) : WorkoutTableData.length == 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No workout added yet.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No worktout found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {WorkoutTableData.length > 0 && (
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
    </div>
  );
}
