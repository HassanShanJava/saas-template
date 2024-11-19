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

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { creditTablestypes, ErrorType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { DataTableViewOptions } from "./data-table-view-options";
import { Spinner } from "@/components/ui/spinner/spinner";
import Papa from "papaparse";
// import { DataTableFacetedFilter } from "./data-table-faced-filter";
import {
  useGetCreditsQuery,
  useCreateCreditsMutation,
  useUpdateCreditsMutation,
} from "@/services/creditsApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { status } from "@/constants/global";

const downloadCSV = (data: creditTablestypes[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface SearchCriteriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
}

export default function FacilitiesTableView() {
  const facilities = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).facilities ??
        "no_access"
      );
    } catch {
      return "no_access";
    }
  })();

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaType>({
    limit: 10,
    offset: 0,
    sort_order: "desc",
    // sort_key: "created_at",
    sort_key: "id",
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCriteria]);

  const {
    data: facilitiesData,
    isLoading,
    refetch,
  } = useGetCreditsQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

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

  const [updateCredits, { isLoading: creditsLoading }] =
    useUpdateCreditsMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<createFormData>({
    status: "active",
    name: "",
    min_limit: 1,
    org_id: orgId,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value }, "name,value");
    let finalValue: number | string = value;
    if (name == "min_limit") {
      finalValue = Number(value);
    }
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: finalValue };
      console.log("After update:", updatedData);
      return updatedData;
    });
  };

  const handleStatusOnChange = (value: string) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, status: value };
      console.log("After update:", updatedData);
      return updatedData;
    });
  };

  // table dropdown status update
  const handleStatusChange = async (payload: {
    id: number;
    org_id: number;
    status: string;
  }) => {
    try {
      // payload.status=Boolean(payload.status)
      const resp = await updateCredits(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Facility Updated Successfully",
        });
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail || (typedError.data as { message?: string }).message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };

  const facilitiestableData = React.useMemo(() => {
    return Array.isArray(facilitiesData?.data) ? facilitiesData?.data : [];
  }, [facilitiesData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // const displayValue = (value: any) => (value === null ? "N/A" : value);

  const handleExportSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedRows.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select one or more records to perform this action.",
      });
      return;
    }
    downloadCSV(selectedRows, "selected_data.csv");
  };

  const actionsColumn: ColumnDef<creditTablestypes> = {
    id: "actions",
    header: "Actions",
    maxSize: 100,
    cell: ({ row }) => (
      <DataTableRowActions
        access={facilities}
        data={row.original}
        refetch={refetch}
        handleEdit={handleEditCredit}
      />
    ),
  };

  const columns: ColumnDef<creditTablestypes>[] = [
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
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
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
                    <span>
                      {displayValue(
                        `${row.original.name}`.length > 15
                          ? `${row.original.name}`.substring(0, 15) + "..."
                          : `${row.original.name}`
                      )}
                    </span>
                  </p>
                </TooltipTrigger>
                <TooltipContent className="mr-24">
                  <p className="capitalize text-sm w-fit ">
                    {displayValue(`${row?.original?.name}`)}
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
    {
      accessorKey: "min_limit",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Min Required Credits</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("min_limit")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <p>{row.original.min_limit}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Status</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("status")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const value =
          row.original?.status != null ? row.original?.status + "" : "false";
        const statusLabel = status.filter((r) => r.value === value)[0];
        const id = Number(row.original.id);
        const org_id = Number(row.original.org_id);
        return (
          <Select
            defaultValue={value}
            onValueChange={(e) =>
              handleStatusChange({ status: e, id: id, org_id: org_id })
            }
            disabled={facilities == "read"}
          >
            <SelectTrigger className="h-8 max-w-36">
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
    ...(facilities !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: facilitiestableData as creditTablestypes[],
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
  }

  const handleAddCredit = () => {
    console.log("Before update:", formData);
    setFormData((prevData) => {
      const updatedData = { ...prevData, case: "add" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  const handleEditCredit = (data: createFormData) => {
    // console.log("Before update:", formData);
    console.log("update:", data);
    setFormData(() => {
      const updatedData = { ...data, case: "edit" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  const totalRecords = facilitiesData?.filtered_counts || 0;
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
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3 ">
        <div className="flex flex-1 items-center  ">
          <p className="font-semibold text-2xl">Facilities</p>
        </div>
        <div>
          {facilities !== "read" && (
            <Button
              className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
              onClick={handleAddCredit}
            >
              <PlusIcon className="h-4 w-4 " />
              Create New
            </Button>
          )}
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
              ) : facilitiestableData.length > 0 ? (
                <TableRow className="!p-0">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center  "
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
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* pagination */}
      {facilitiestableData.length > 0 && (
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

      {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}

      <CreditForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        refetch={refetch}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
        handleStatusOnChange={handleStatusOnChange}
      />
    </div>
  );
}

interface createFormData {
  status: string;
  name: string;
  min_limit: number;
  org_id: number;
  id?: number;
  case?: string;
}

const CreditForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  refetch,
  setFormData,
  handleOnChange,
  handleStatusOnChange,
}: {
  data: createFormData;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
  handleStatusOnChange?: any;
}) => {
  const { toast } = useToast();
  // const [formData, setFormData] = useState(data);
  const [createCredits, { isLoading: creditsLoading }] =
    useCreateCreditsMutation();
  const [updateCredits, { isLoading: updateLoading }] =
    useUpdateCreditsMutation();

  console.log(formData, isDialogOpen, "dialog");

  useEffect(() => {
    form.reset(formData);
    setFormData(formData);
  }, [formData]);

  const creditFormSchema = z.object({
    id: z.number().optional(),
    org_id: z.number(),
    status: z.string(),
    name: z
      .string()
      .min(1, { message: "Required" })
      .max(40, "Name must be 40 characters or less")
      .refine(
        (value) => /^[a-zA-Z]+(?:[-'s]?[a-zA-Z ]+)*$/.test(value ?? ""),
        "Name should contain only alphabets"
      ),
    min_limit: z
      .number({ required_error: "Required" })
      .min(1, { message: "Min. limit required is 1." })
      .max(1000, { message: "Max. limit required is 1000." }),
  });

  const form = useForm<z.infer<typeof creditFormSchema>>({
    resolver: zodResolver(creditFormSchema),
    defaultValues: formData,
    mode: "all",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof creditFormSchema>) => {
    console.log({ data });
    const payload = { ...data };
    payload.name = payload.name.toLowerCase();

    try {
      if (formData.case == "add") {
        const resp = await createCredits(payload).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Facility added successfully.",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateCredits(payload).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Facility updated successfully.",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail || (typedError.data as { message?: string }).message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
      resetFormAndCloseDialog();
      setIsDialogOpen(false);
    }
  };
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  const resetFormAndCloseDialog = () => {
    console.log("calling close");
    setFormData((prev: createFormData) => ({
      ...prev,
      status: "active",
      name: "",
      min_limit: 1,
    }));
  };

  console.log("errror", form.formState.errors);
  return (
    <div>
      <Sheet
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: createFormData) => ({
            ...prev,
            status: "active",
            name: "",
            min_limit: 1,
          }));
          form.reset({
            org_id: formData.org_id,
            status: "active",
            name: "",
            min_limit: 1,
          });
          setIsDialogOpen();
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {formData.case == "add" ? "Create" : "Edit"} Facility
            </SheetTitle>

            <SheetDescription>
              <>
                <Separator className=" h-[1px] font-thin rounded-full" />

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="flex flex-col py-4 gap-4"
                    noValidate
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{
                        required: "Required",
                        maxLength: {
                          value: 50,
                          message: "Name should less than 50 characters.",
                        },
                      }}
                      render={({
                        field: { onChange, value, onBlur },
                        fieldState: { invalid, error },
                      }) => (
                        <FormItem>
                          <FloatingLabelInput
                            id="name"
                            name="name"
                            label="Facility Name"
                            text="*"
                            value={value ?? ""}
                            className="capitalize"
                            // error={error?.message??""}
                            onChange={handleOnChange}
                          />
                          {<FormMessage />}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_limit"
                      rules={{
                        required: "Required",
                        min: {
                          value: 1,
                          message: "Min. limit required is 1",
                        },
                        max: {
                          value: 1000,
                          message: "Max. limit required is 1000",
                        },
                      }}
                      render={({
                        field: { onChange, value, onBlur },
                        fieldState: { invalid, error },
                      }) => (
                        <FormItem>
                          <FloatingLabelInput
                            id="min_limit"
                            name="min_limit"
                            type="number"
                            className=""
                            label="Min Requred Limit"
                            text="*"
                            value={value}
                            onChange={handleOnChange}
                            // error={error?.message??""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Status</FormLabel> */}
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleStatusOnChange(value);
                              }}
                            >
                              <SelectTrigger floatingLabel="Status" text="*">
                                <SelectValue placeholder="">
                                  <span className="flex gap-2 items-center">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        field.value == "active"
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                      }`}
                                    ></span>
                                    {field.value == "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {status.map((st, index) => (
                                  <SelectItem
                                    key={index}
                                    value={String(st.value)}
                                  >
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <LoadingButton
                      type="submit"
                      className="bg-primary  text-black gap-1 font-semibold"
                      loading={form.formState.isSubmitting}
                    >
                      {!form.formState.isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </form>
                </Form>
              </>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};