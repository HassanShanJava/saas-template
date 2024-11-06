import React, { useState } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  createExerciseInputTypes,
  ErrorType,
  ExerciseResponseServerViewType,
  ExerciseResponseViewType,
  ExerciseTypeEnum,
} from "@/app/types";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useGetAllCategoryQuery,
  useGetAllExercisesQuery,
} from "@/services/exerciseApi";
import ExerciseForm from "../../exerciseform/exercise-form";

import { Separator } from "@/components/ui/separator";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  difficultyTypeoptions,
  exerciseTypeOptions,
  visibilityOptions,
} from "@/constants/exercise";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import TableFilters from "@/components/ui/table/data-table-filter";

interface SearchCriteriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
  search_key?: string;
  category?: string[];
  visible_for?: string[];
  difficulty?: string;
  exercise_type?: string;
}
const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  // sort_key: "created_at",
  sort_key: "id",
};

export default function ExerciseTableView() {
  const { exercise } = JSON.parse(
    localStorage.getItem("accessLevels") as string
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [data, setData] = useState<createExerciseInputTypes | undefined>(
    undefined
  );

  const [searchCriteria, setSearchCriteria] =
    useState<SearchCriteriaType>(initialValue);
  const [query, setQuery] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState({});
  const [action, setAction] = useState<"add" | "edit">("add");

  const { data: CategoryData } = useGetAllCategoryQuery();

  React.useEffect(() => {
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

  React.useEffect(() => {
    const params = new URLSearchParams();
    // Iterate through the search criteria
    for (const [key, value] of Object.entries(searchCriteria)) {
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
    data: exercisedata,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetAllExercisesQuery(
    {
      org_id: orgId,
      query: query,
    },
    {
      skip: query == "",
    }
  );

  React.useEffect(() => {
    if (isError) {
      const typedError = error as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: typedError.data?.detail ?? "Internal Server Errors",
      });
    }
  }, [isError]);
  const navigate = useNavigate();

  const exerciseTableData = React.useMemo(() => {
    return Array.isArray(exercisedata?.data) ? exercisedata?.data : [];
  }, [exercisedata]);

  function handleRoute() {
    setAction("add");
    setIsDialogOpen(true);
  }
  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const displayValue = (value: string | undefined | null) =>
    value == null || value == undefined || value.trim() == "" ? "N/A" : value;

  const handleEditExercise = (data: ExerciseResponseServerViewType) => {
    console.log("Edit is called");
    // setData(data as ExerciseResponseServerViewType);

    const existingGif: File[] = [];
    console.log("Data from api", data);
    const transformToValueArray = (arr: number[] = []) =>
      arr.length > 0 ? arr.map((value) => ({ value })) : [{ value: null }];
    const payload = {
      ...data,
      equipment_ids: data.equipments?.map((equipment) => equipment.id),
      primary_muscle_ids: data.primary_muscles?.map((muscle) => muscle.id),
      secondary_muscle_ids: data.secondary_muscles
        ? data.secondary_muscles.map((muscle) => muscle.id)
        : [],
      primary_joint_ids: data.primary_joints?.map((joints) => joints.id),
      timePerSet:
        data.exercise_type === ExerciseTypeEnum.time_based
          ? transformToValueArray(data.seconds_per_set)
          : [{ value: null }],
      restPerSet:
        data.exercise_type === ExerciseTypeEnum.time_based
          ? transformToValueArray(data.rest_between_set)
          : [{ value: null }],
      restPerSetrep:
        data.exercise_type === ExerciseTypeEnum.repetition_based
          ? transformToValueArray(data.rest_between_set)
          : [{ value: null }],
      repetitionPerSet:
        data.exercise_type === ExerciseTypeEnum.repetition_based
          ? transformToValueArray(data.repetitions_per_set)
          : [{ value: null }],
      gif: existingGif,
      imagemale: existingGif,
      imagefemale: existingGif,
      category_id: data.category_id.toString(),
    };
    console.log("payload ", payload);

    setData(payload as createExerciseInputTypes);
    setAction("edit");
    setIsDialogOpen(true);
  };

  const actionsColumn: ColumnDef<ExerciseResponseViewType> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        access={exercise}
        row={row.original.id}
        data={row?.original}
        refetch={refetch}
        hanleEditExercise={handleEditExercise}
      />
    ),
  };

  const columns: ColumnDef<ExerciseResponseViewType>[] = [
    {
      accessorKey: "exercise_name",
      meta: "Exercise Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Exercise Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("exercise_name")}
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
            {/* {displayValue(row?.original?.exercise_name)} */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="capitalize cursor-pointer">
                    {/* Display the truncated name */}
                    {displayValue(
                      `${row.original.exercise_name}`.length > 8
                        ? `${row.original.exercise_name}`.substring(0, 8) +
                            "..."
                        : `${row.original.exercise_name}`
                    )}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  {/* Display the full name in the tooltip */}
                  <p>{displayValue(`${row?.original?.exercise_name}`)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "category_name",
      meta: "Exercise Category",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Exercise Category</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("category_name")}
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
            {row.original.category_name}
          </div>
        );
      },
    },
    {
      accessorKey: "visible_for",
      meta: "Visible For",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Visible For</p>
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
            {row.original.visible_for}
          </div>
        );
      },
    },
    {
      accessorKey: "exercise_type",
      meta: "Exercise Type",
      header: () => (
        <div className="flex  gap-2">
          <p className="text-nowrap">Exercise Type</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("exercise_type")}
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
            {row.original.exercise_type}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "difficulty",
      meta: "Difficulty",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Difficulty</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("difficulty")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  px-2 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.difficulty}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "sets",
      meta: "Sets",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Sets</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("set")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  px-2 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.sets}{" "}
          </div>
        );
      },
    },
    ...(exercise !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: exerciseTableData as ExerciseResponseViewType[],
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

  function handleFilterChange(field: string, value: string | number) {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const filterDisplay = [
    {
      type: "multiselect",
      name: "category",
      label: "Exercise category",
      options: CategoryData,
      function: (value: string) => handleFilterChange("category", value),
    },
    {
      type: "multiselect",
      name: "visible_for",
      label: "Visible for",
      options: visibilityOptions.map((item) => ({
        value: item.value,
        label: item.label,
      })),
      function: (value: string) => handleFilterChange("visible_for", value),
    },
    {
      type: "select",
      name: "exercise_type",
      label: "Exercise Type",
      options: exerciseTypeOptions.map((item) => ({
        id: item.value,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("exercise_type", value),
    },
    {
      type: "select",
      name: "difficulty",
      label: "difficulty",
      options: difficultyTypeoptions.map((item) => ({
        id: item.label,
        name: item.label,
      })),
      function: (value: string) => handleFilterChange("difficulty", value),
    },
  ];
  console.log({ searchCriteria });
  // Function to go to the next page

  const totalRecords = exercisedata?.filtered_counts || 0;
  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<SearchCriteriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3 ">
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
            {exercise !== "read" && (
              <Button
                className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
                onClick={handleRoute}
              >
                <PlusIcon className="size-4" />
                Create New
              </Button>
            )}
            {/* <DataTableViewOptions table={table} /> */}
            <button
              className="border rounded-full size-3 text-gray-400 p-4 flex items-center justify-center"
              onClick={() => setOpenFilter(true)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <i className="fa fa-filter"></i>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>click to apply filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          </div>
        </div>
        <div className="rounded-none border border-border ">
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
                ) : exercisedata?.total_counts == 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No Exercise added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No records for the criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* pagination */}
        {exerciseTableData.length > 0 && (
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

        <ExerciseForm
          isOpen={isDialogOpen}
          setOpen={setIsDialogOpen}
          action={action}
          setAction={setAction}
          data={data}
          refetch={refetch}
        />
      </div>
    </>
  );
}
