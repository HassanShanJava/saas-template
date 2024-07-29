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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import {  PlusIcon, Search } from "lucide-react";
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

const status = [
  { value: "true", label: "Active", color: "bg-green-500" },
  { value: "false", label: "Inactive", color: "bg-blue-500" },
];

export default function CreditsTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const {
    data: creditsData,
    isLoading,
    refetch,
  } = useGetCreditsQuery(orgId);
  const [updateCredits, { isLoading: creditsLoading }] =
    useUpdateCreditsMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<createFormData>({
    status: true,
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
          title: "Updated Successfully",
        });
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
    }
  };

  const creditstableData = React.useMemo(() => {
    return Array.isArray(creditsData) ? creditsData : [];
  }, [creditsData]);

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
  // const displayValue = (value: any) => (value === null ? "N/A" : value);

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

  const columns: ColumnDef<creditTablestypes>[] = [
    {
      accessorKey: "name",
      header: ({ table }) => <p>Name</p>,
      cell: ({ row }) => {
        return <p>{row.original.name}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "min_limit",
      header: ({ table }) => <p>Min Required Credits</p>,
      cell: ({ row }) => {
        return <p>{row.original.min_limit}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: ({ table }) => <p>Status</p>,
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
          >
            <SelectTrigger>
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
    {
      id: "actions",
      header: "Actions",
      maxSize: 100,
      cell: ({ row }) => (
        <DataTableRowActions
          data={row.original}
          refetch={refetch}
          handleEdit={handleEditCredit}
        />
      ),
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
        pageSize: 10, // Set your default page size here
      },
    },
    onPaginationChange: setPagination,
  });

  function handlePagination(page: number) {
    if (page < 0) return;
    // setFilters
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-1 items-center  ">
          {/* <div className="flex flex-1 items-center  ">
            <div className="flex items-center w-[40%] gap-2 py-2 rounded-md border border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
              <Search className="w-6 h-6 text-gray-500" />
              <input
                placeholder="Search"
                // value={
                //   (table.getColumn("full_name")?.getFilterValue() as string) ??
                //   ""
                // }
                // onChange={(event) =>
                //   table
                //     .getColumn("full_name")
                //     ?.setFilterValue(event.target.value)
                // }
                className="h-7 w-[150px] lg:w-[220px] outline-none"
              />
            </div>
          </div> */}
            <p className="font-semibold text-2xl">Credits</p>

        </div>
        <Button
          className="bg-primary m-4 text-black font-semibold gap-1"
          onClick={handleAddCredit}
        >
          <PlusIcon className="h-4 w-4 " />
          Create New
        </Button>
        {/* <DataTableViewOptions table={table} action={handleExportSelected} /> */}
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
                    <div className='flex space-x-2 justify-center items-center bg-white '>
                      <div className='size-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                      <div className='size-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                      <div className='size-3 bg-black rounded-full animate-bounce'></div>
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
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 px-4 py-4">
        <div className="flex-1 flex w-[100px] items-center justify-start text-sm font-medium">
          {/* Page {filters.first + 1} of{" "}
          {Math.ceil((data?.count ?? 0) / filters.rows)} */}
        </div>

        <div className="flex items-center justify-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            {/* <Select
              // value={`${filters.rows}`}
              onValueChange={(value) => {
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  rows: Number(value),
                  first: 0,
                }));
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue defaultValue={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pagination}`} >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            {/* <Select
              value="10"
              onValueChange={(value) => {
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  rows: Number(value),
                  first: 0,
                }));
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{10}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPagination((prevPagination) => ({
                  ...prevPagination,
                  pageSize: newSize,
                }));
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  rows: newSize,
                  first: 0,
                }));
                table.setPageSize(newSize);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue>{pagination.pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePagination(0)}
              // disabled={filters.first === 0}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() => handlePagination(filters?.first - 1)}
              // disabled={filters?.first === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() => handlePagination(filters.first + 1)}
              // disabled={
              //   (filters.first + 1) * filters.rows > (data?.count ?? 0) ||
              //   Math.ceil((data?.count ?? 0) / filters.rows) ==
              //     filters.first + 1
              // }
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              // onClick={() =>
              //   handlePagination(
              //     Math.ceil((data?.count ?? 0) / filters.rows) - 1
              //   )
              // }
              // disabled={
              //   (filters.first + 1) * filters.rows > (data?.count ?? 0) ||
              //   Math.ceil((data?.count ?? 0) / filters.rows) ==
              //     filters.first + 1
              // }
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}
      <CreditForm
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

interface createFormData {
  status: boolean;
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
}: {
  data: createFormData;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
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
    status: z.boolean(),
    name: z.string().min(1, { message: "Name is required" }),
    min_limit: z.number().min(1, { message: "Minimum limit is required" }),
  });

  const form = useForm<z.infer<typeof creditFormSchema>>({
    resolver: zodResolver(creditFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof creditFormSchema>) => {
    console.log({ data });

    try {
      if (formData.case == "add") {
        const resp = await createCredits(data).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Credit Created Successfully",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateCredits(data).unwrap();
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
    console.log("calling close");
    setFormData((prev: createFormData) => ({
      ...prev,
      status: true,
      name: "",
      min_limit: 1,
    }));
  };

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: createFormData) => ({
            ...prev,
            status: true,
            name: "",
            min_limit: 1,
          }));
          form.reset({
            org_id: formData.org_id,
            status: true,
            name: "",
            min_limit: 1,
          });
          setIsDialogOpen();
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.case == "add" ? "Add" : "Edit"} Credit
            </DialogTitle>
            <DialogDescription>
              <>
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
                            label="Credit Name"
                            value={field.value ?? ""}
                            onChange={handleOnChange}
                          />
                          {watcher.name ? <></> : <FormMessage />}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FloatingLabelInput
                            {...field}
                            id="min_limit"
                            name="min_limit"
                            min={1}
                            type="number"
                            className="number-input"
                            label="Min Requred Limit"
                            value={field.value ?? 1}
                            onChange={handleOnChange}
                          />
                          {watcher.min_limit ? <></> : <FormMessage />}
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
                              value={field.value ? "true" : "false"}
                              onValueChange={(value) =>
                                field.onChange(value === "true")
                              }
                            >
                              <SelectTrigger floatingLabel="Status">
                                <SelectValue placeholder="">
                                  <span className="flex gap-2 items-center">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        field.value
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                      }`}
                                    ></span>
                                    {field.value ? "Active" : "Inactive"}
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
											{!form.formState.isSubmitting && <i className="fa-regular fa-floppy-disk text-base px-1 "></i>}
                      Save
                    </LoadingButton>
                  </form>
                </Form>
              </>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
