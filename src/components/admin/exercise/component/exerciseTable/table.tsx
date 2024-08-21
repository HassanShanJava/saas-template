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
import ExerciseFilters from "./data-table-filter";
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
// import ExerciseForm from "../../exerciseform/form";
import ExerciseForm from "../../exerciseform/exercise-form";

import { Separator } from "@/components/ui/separator";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  difficultyTypeoptions,
  exerciseTypeOptions,
  visibilityOptions,
} from "@/constants/exercise";

interface searchCretiriaType {
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
  sort_key: "created_at",
};

export default function ExerciseTableView() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [data, setData] = useState<createExerciseInputTypes | undefined>(
    undefined
  );

  const [searchCretiria, setSearchCretiria] =
    useState<searchCretiriaType>(initialValue);
  const [query, setQuery] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [filterData, setFilter] = useState({});
  const [action, setAction] = useState<"add" | "edit">("add");

  const { data: CategoryData } = useGetAllCategoryQuery();

  React.useEffect(() => {
    setSearchCretiria((prev) => {
      const newCriteria = { ...prev };

      if (debouncedInputValue.trim() !== "") {
        newCriteria.search_key = debouncedInputValue;
      } else {
        delete newCriteria.search_key;
      }

      return newCriteria;
    });
    console.log({ debouncedInputValue });
  }, [debouncedInputValue, setSearchCretiria]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    // Iterate through the search criteria
    for (const [key, value] of Object.entries(searchCretiria)) {
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

  const ExerciseTableData = React.useMemo(() => {
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
    };
    console.log("payload ", payload);

    setData(payload as createExerciseInputTypes);
    setAction("edit");
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<ExerciseResponseViewType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
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
    },
    {
      accessorKey: "exercise_name",
      meta: "Exercise Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Exercise Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("exercise_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.exercise_name)}
          </div>
        );
      },
    },
    {
      accessorKey: "category_name",
      meta: "Category Name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Category Name</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("category_name")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
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
          <p>Visible For</p>
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
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.visible_for}
          </div>
        );
      },
    },
    {
      accessorKey: "exercise_type",
      meta: "Exercise Type",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Exercise Type</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("exercise_type")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
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
          <p>Difficulty</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("difficulty")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.difficulty}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "sets",
      meta: "Exercise Sets",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Exercise Sets</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("set")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row.original.sets}{" "}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row.original.id}
          data={row?.original}
          refetch={refetch}
          hanleEditExercise={handleEditExercise}
        />
      ),
    },
  ];
  // console.log("data",{memberData})
  const table = useReactTable({
    data: ExerciseTableData as ExerciseResponseViewType[],
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
      label: "category",
      options: CategoryData,
      function: handleFilterChange,
    },
    {
      type: "multiselect",
      name: "visible_for",
      label: "visible_for",
      options: visibilityOptions,
      function: handleFilterChange,
    },
    {
      type: "select",
      name: "exercise_type",
      label: "exercise_type",
      options: exerciseTypeOptions,
      function: handleFilterChange,
    },
    {
      type: "select",
      name: "difficulty",
      label: "difficulty",
      options: difficultyTypeoptions,
      function: handleFilterChange,
    },
  ];
  console.log({ searchCretiria });
  // Function to go to the next page

  const totalRecords = exercisedata?.total_counts || 0;
  const lastPageOffset = Math.max(
    0,
    Math.floor(totalRecords / searchCretiria.limit) * searchCretiria.limit
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
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-5 ">
          <div className="flex flex-1 items-center space-x-2">
            <div className="flex items-center  relative">
              <Search className="size-4 text-gray-400 absolute left-1 z-40 ml-2" />
              <FloatingLabelInput
                id="search"
                placeholder="Search by Exercise Name"
                onChange={(event) => setInputValue(event.target.value)}
                className="w-64 pl-8 text-gray-400"
              />
            </div>
          </div>
          <Button
            className="bg-primary m-4 text-black gap-1"
            onClick={handleRoute}
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </Button>
          <DataTableViewOptions table={table} />
          <div className="px-3 flex gap-2">
            <button
              className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
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
                ) : ExerciseTableData.length > 0 ? (
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
                      No records for the criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* pagination */}
        {ExerciseTableData.length > 0 && (
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
                {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${exercisedata?.filtered_counts} Items  `}
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
        <ExerciseFilters
          isOpen={openFilter}
          setOpen={setOpenFilter}
          initialValue={initialValue}
          filterData={filterData}
          setFilter={setFilter}
          setSearchCriteria={setSearchCretiria}
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

        {/* <ExerciseForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        // action={action}
        // setAction={setAction}
        // data={data}
        // refetch={refetch}
      /> */}
        {/* <ExerciseForm isOpen={isDialogOpen} setOpen={setIsDialogOpen} /> */}
      </div>
    </>
  );
}
