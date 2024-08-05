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
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MoreHorizontal, PlusIcon, Search } from "lucide-react";
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
import { saleTaxesTableType, ErrorType } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { DataTableViewOptions } from "./data-table-view-options";
import { Spinner } from "@/components/ui/spinner/spinner";
import Papa from "papaparse";
// import { DataTableFacetedFilter } from "./data-table-faced-filter";

import {
  useCreateSalesTaxMutation,
  useGetSalesTaxQuery,
  useUpdateSalesTaxMutation,
} from "@/services/salesTaxApi";
import { StringDecoder } from "string_decoder";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";

const downloadCSV = (data: saleTaxesTableType[], fileName: string) => {
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
}

export default function SaleTaxesTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [searchCretiria, setSearchCretiria] = useState<searchCretiriaType>({
    limit: 10,
    offset: 0,
    sort_order: "desc",
  });
  const [query, setQuery] = useState("");

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

  const {
    data: saleTaxesData,
    isLoading,
    refetch,
    error,
  } = useGetSalesTaxQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const toggleSortOrder = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "desc" ? "asc" : "desc",
    }));
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<saleTaxesFormData>({
    percentage: 1,
    name: "",
    org_id: orgId,
  });

  const saletaxestableData = React.useMemo(() => {
    return Array.isArray(saleTaxesData) ? saleTaxesData : [];
  }, [saleTaxesData]);

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
  const displayValue = (value: any) => (value === null ? "N/A" : value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value }, "name,value");
    let finalValue: number | string = value;
    if (name == "percentage") {
      finalValue = Number(value);
    }
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: finalValue };
      console.log("After update:", updatedData);
      return updatedData;
    });
  };

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

  const columns: ColumnDef<saleTaxesTableType>[] = [
    {
      accessorKey: "name",
      header: ({ table }) => <span>Tax/VAT Name</span>,
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "percentage",
      header: ({ table }) => <span>Percentage</span>,
      cell: ({ row }) => {
        return <span>{row.original.percentage + "%"}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "actions",
      header: "Actions",
      maxSize: 100,
      cell: ({ row }) => (
        <DataTableRowActions
          data={row.original}
          refetch={refetch}
          handleEdit={handleEditSaleTax}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: saletaxestableData as saleTaxesTableType[],
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

  const handleAddSaleTax = () => {
    console.log("Before update:", formData);
    setFormData((prevData) => {
      const updatedData = { ...prevData, case: "add" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  const handleEditSaleTax = (data: saleTaxesFormData) => {
    // console.log("Before update:", formData);
    console.log("update:", data);
    setFormData(() => {
      const updatedData = { ...data, case: "edit" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-1 items-center  ">
          <p className="font-semibold text-2xl">Sales Tax</p>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1 font-semibold"
          onClick={handleAddSaleTax}
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>
        <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={toggleSortOrder}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button>
      </div>
      <div className="rounded-none  ">
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
              ) : saletaxestableData.length > 0 ? (
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
      <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Items per page:</p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const newSize = Number(value);
                setSearchCretiria((prev) => ({ ...prev, limit: newSize }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] !border-none shadow-none">
                <SelectValue>{pagination.pageSize}</SelectValue>
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
            className="h-11 w-[1px] bg-gray-300  "
          />
          {/* <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {searchCretiria.offset + 1 + " of "}
            </p>
          </div> */}
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center space-x-2">
            <Separator
              orientation="vertical"
              className="hidden lg:flex h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-none !!disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: 0,
                  };
                })
              }
              disabled={searchCretiria.offset === 0}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Separator
              orientation="vertical"
              className="h-11 w-[0.5px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: prev.offset - 1,
                  };
                })
              }
              disabled={searchCretiria.offset === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Separator
              orientation="vertical"
              className="h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-none disabled:cursor-not-allowed"
              onClick={() =>
                setSearchCretiria((prev) => {
                  return {
                    ...prev,
                    offset: prev.offset + 1,
                  };
                })
              }
              disabled={
                searchCretiria.offset ==
                Math.ceil(
                  (count?.total_members as number) / searchCretiria.limit
                ) -
                  1
              }
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Separator
              orientation="vertical"
              className="hidden lg:flex h-11 w-[1px] bg-gray-300 "
            />

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-none disabled:cursor-not-allowed"
              // onClick={() =>
              //   setSearchCretiria((prev) => {
              //     return {
              //       ...prev,
              //       offset:
              //         Math.ceil(
              //           (count?.total_members as number) / searchCretiria.limit
              //         ) - 1,
              //     };
              //   })
              // }
              // disabled={
              //   searchCretiria.offset ==
              //   Math.ceil(
              //     (count?.total_members as number) / searchCretiria.limit
              //   ) -
              //     1
              // }
            >
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}
      <SaleTaxesForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        refetch={refetch}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
      />
    </div>
  );
}

interface saleTaxesFormData {
  percentage: number;
  name: string;
  org_id: number;
  id?: number;
  case?: string;
}

const SaleTaxesForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  refetch,
  setFormData,
  handleOnChange,
}: {
  data: saleTaxesFormData;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
}) => {
  const { toast } = useToast();
  // const [formData, setFormData] = useState(data);
  const [createSalesTax, { isLoading: saleTaxesLoading }] =
    useCreateSalesTaxMutation();
  const [updateSalesTax, { isLoading: updateLoading }] =
    useUpdateSalesTaxMutation();

  useEffect(() => {
    form.reset(formData);
    setFormData(formData);
    console.log({ formData, form }, "in useeffect");
  }, [formData]);

  const saleTaxFormSchema = z.object({
    id: z.number().optional(),
    org_id: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    percentage: z.number().min(1, { message: "Percentage Tax is required" }),
  });

  const form = useForm<z.infer<typeof saleTaxFormSchema>>({
    resolver: zodResolver(saleTaxFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof saleTaxFormSchema>) => {
    console.log({ data });

    try {
      if (formData.case == "add") {
        const resp = await createSalesTax(data);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Sale Tax Created Successfully",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateSalesTax(data);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Updated Successfully",
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
          description: typedError.data?.detail,
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

  const resetFormAndCloseDialog = () => {
    setFormData((prev: saleTaxesFormData) => ({
      ...prev,
      percentage: 1,
      name: "",
    }));
  };
  console.log(form.formState.errors);

  return (
    <div>
      <Sheet
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: saleTaxesFormData) => ({
            ...prev,
            percentage: 1,
            name: "",
          }));
          form.reset({
            org_id: formData.org_id,
            percentage: 1,
            name: "",
          });
          setIsDialogOpen();
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {formData.case == "add" ? "Create" : "Edit"} Tax/VAT
            </SheetTitle>
            <SheetDescription>
              <Separator className=" h-[1px] font-thin rounded-full" />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col py-4 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          id="name"
                          name="name"
                          label="Tax/VAT Name*"
                          value={field.value ?? ""}
                          onChange={handleOnChange}
                        />
                        {watcher.name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FloatingLabelInput
                          {...field}
                          type="number"
                          id="percentage"
                          name="percentage"
                          min={1}
                          step={".1"}
                          max={100}
                          className=""
                          label="Percentage*"
                          value={field.value ?? 1}
                          onChange={handleOnChange}
                        />
                        {watcher.percentage ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                  <LoadingButton
                    type="submit"
                    className="bg-primary font-semibold text-black gap-1"
                    loading={form.formState.isSubmitting}
                  >
                    {!form.formState.isSubmitting && (
                      <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    )}
                    Save
                  </LoadingButton>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
