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
import {PlusIcon } from "lucide-react";
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
import { ErrorType, incomeCategoryTableType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner/spinner";
import Papa from "papaparse";
import { DataTableFacetedFilter } from "./data-table-faced-filter";

import {
  useGetSalesTaxQuery,
} from "@/services/salesTaxApi";

import {
  useCreateIncomeCategoryMutation,
  useGetIncomeCategoryQuery,
  useUpdateIncomeCategoryMutation,
} from "@/services/incomeCategoryApi";

const downloadCSV = (data: incomeCategoryTableType[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function IncomeCategoryTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    data: incomeCategoryData,
    isLoading,
    refetch,
  } = useGetIncomeCategoryQuery(orgId);

  const { data: salesTaxData } = useGetSalesTaxQuery(orgId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<incomeCategoryFromData>({
    sale_tax_id: undefined,
    name: "",
    org_id: orgId,
  });

  //   // table dropdown status update
  //   const handleStatusChange = async (payload: {
  //     id: number;
  //     org_id: number;
  //     percentage: number;
  // ;
  //   }) => {
  //     try {
  //       const resp = await updateCredits(payload).unwrap();
  //       if (resp) {
  //         console.log({ resp });
  //         refetch();
  //         toast({
  //           variant: "success",
  //           title: "Updated Successfully",
  //         });
  //       }
  //     } catch (error) {
  //       console.log("Error", error);
  //       if (error && typeof error === "object" && "data" in error) {
  //         const typedError = error as ErrorType;
  //         toast({
  //           variant: "destructive",
  //           title: "Error in form Submission",
  //           description: `${typedError.data?.detail}`,
  //         });
  //       } else {
  //         toast({
  //           variant: "destructive",
  //           title: "Error in form Submission",
  //           description: `Something Went Wrong.`,
  //         });
  //       }
  //     }
  //   };

  const incomeCategorytableData = React.useMemo(() => {
    return Array.isArray(incomeCategoryData) ? incomeCategoryData : [];
  }, [incomeCategoryData]);

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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value }, "name,value");
    let finalValue: number | string = value;
    if (name == "sale_tax_id") {
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

  const columns: ColumnDef<incomeCategoryTableType>[] = [
    {
      accessorKey: "name",
      header: ({ table }) => <span>Category Name</span>,
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sale_tax_id",
      header: ({ table }) => <span>Default Tax/VAT</span>,
      cell: ({ row }) => {
        const sales:any=salesTaxData?.filter(item=>item.id==row.original.sale_tax_id)[0]
        console.log({salesTaxData,sales},row.original.sale_tax_id,"sales")
        return <span>{sales?.name +" ("+sales?.percentage+"%)" }</span>;
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
          handleEdit={handleEditIncomeCategory}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: incomeCategorytableData as incomeCategoryTableType[],
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

  const handleAddIncomeCategory = () => {
    console.log("Before update:", formData);
    setFormData((prevData) => {
      const updatedData = { ...prevData, case: "add" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  const handleEditIncomeCategory = (data: incomeCategoryFromData) => {
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
          {/* <div className="flex items-center w-[40%] gap-2 py-2 rounded-md border border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary"> 
              <Search className="w-6 h-6 text-gray-500" />
              <input
                placeholder="Search"
                value={
                  (table.getColumn("full_name")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("full_name")
                    ?.setFilterValue(event.target.value)
                }
                className="h-7 w-[150px] lg:w-[220px] outline-none"
              /> 

            </div> */}
          <p className="font-semibold text-2xl">Income Categories</p>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1 font-semibold"
          onClick={handleAddIncomeCategory}
        >
          <PlusIcon className="h-4 w-4" />
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
                    <Spinner className="text-primary">
                      <span className="text-primary">
                        Loading data for clients....
                      </span>
                    </Spinner>
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
              ) : incomeCategorytableData.length > 0 ? (
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
                    No Clients Added yet!.
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
      <IncomeCategoryForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        refetch={refetch}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
        salesTaxData={salesTaxData}
      />
    </div>
  );
}

interface incomeCategoryFromData {
  sale_tax_id: number|undefined;
  name: string;
  org_id: number;
  id?: number;
  case?: string;
}

const IncomeCategoryForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  refetch,
  setFormData,
  handleOnChange,
  salesTaxData,
}: {
  data: incomeCategoryFromData;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
  salesTaxData?:any
}) => {
  const { toast } = useToast();
  // const [formData, setFormData] = useState(data);
  const [createIncomeCategory, { isLoading: incomeCategoryLoading }] =
    useCreateIncomeCategoryMutation();
  const [updateIncomeCategory, { isLoading: updateLoading }] =
    useUpdateIncomeCategoryMutation();

  useEffect(() => {
    form.reset(formData);
    setFormData(formData);
    console.log({ formData, form }, "in useeffect");
  }, [formData]);

  const incomeCategoryFormSchema = z.object({
    id: z.number().optional(),
    org_id: z.number(),
    sale_tax_id: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
  });

  const form = useForm<z.infer<typeof incomeCategoryFormSchema>>({
    resolver: zodResolver(incomeCategoryFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof incomeCategoryFormSchema>) => {
    console.log({ data });

    try {
      if (formData.case == "add") {
        const resp = await createIncomeCategory(data);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Income Category Created Successfully",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateIncomeCategory(data);
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
      console.log("Error", error);
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail}`,
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
    setFormData((prev: incomeCategoryFromData) => ({
      ...prev,
      percentage: 1,
      name: "",
    }));
  };
  console.log(form.formState.errors);

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: incomeCategoryFromData) => ({
            ...prev,
            percentage: 1,
            name: "",
          }));
          form.reset({
            org_id: formData.org_id,
            sale_tax_id: 1,
            name: "",
          });
          setIsDialogOpen();
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.case == "add" ? "Create" : "Edit"} Income Category
            </DialogTitle>
            <DialogDescription>
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
                          label="Category Name"
                          value={field.value ?? ""}
                          onChange={handleOnChange}
                        />
                        {watcher.name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />

                  {/* <FormField
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
                          className="number-input"
                          label="Percentage"
                          value={field.value ?? 1}
                          onChange={handleOnChange}

                        />
                        {watcher.percentage ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  /> */}

                    <FormField
                      control={form.control}
                      name="sale_tax_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Default Tax/VAT" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {salesTaxData && salesTaxData?.length>0 ? (
                                salesTaxData.map(
                                  (saleTax:any, i: any) => (
                                    <SelectItem
                                      value={saleTax.id?.toString()}
                                      key={i}
                                      onClick={handleOnChange}
                                    >
                                      {saleTax.name+" ("+saleTax.percentage+"%)"}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <>
                                  <p className="p-2"> No Sources Found</p>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <Button
                    type="submit"
                    className="bg-primary font-semibold text-black gap-1"
                  >
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    Save
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
