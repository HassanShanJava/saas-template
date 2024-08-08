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
  FormControl,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
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
// import { DataTableFacetedFilter } from "./data-table-faced-filter";

import { useGetSalesTaxListQuery, useGetSalesTaxQuery } from "@/services/salesTaxApi";

import {
  useCreateIncomeCategoryMutation,
  useGetIncomeCategoryQuery,
  useUpdateIncomeCategoryMutation,
} from "@/services/incomeCategoryApi";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";

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

interface searchCretiriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
}

export default function IncomeCategoryTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [searchCretiria, setSearchCretiria] = useState<searchCretiriaType>({
    limit: 10,
    offset: 0,
    sort_order: "desc",
    // sort_key:"created_at",
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
    data: incomeCategoryData,
    isLoading,
    refetch,
  } = useGetIncomeCategoryQuery(
    { org_id: orgId, query: query },
    {
      skip: query == "",
    }
  );

  const { data: salesTaxData } = useGetSalesTaxListQuery(orgId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<incomeCategoryFromData>({
    sale_tax_id: undefined,
    name: "",
    org_id: orgId,
  });


  const toggleSortOrder = () => {
    setSearchCretiria((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "desc" ? "asc" : "desc",
    }));
  };

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
  //       console.error("Error", { error });
  //       if (error && typeof error === "object" && "data" in error) {
  //         const typedError = error as ErrorType;
  //         toast({
  //           variant: "destructive",
  //           title: "Error in form Submission",
  //           description: typedError.data?.detail,
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
    return Array.isArray(incomeCategoryData?.data) ? incomeCategoryData?.data : [];
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
        const sales: any = salesTaxData?.filter(
          (item) => item.id == row.original.sale_tax_id
        )[0];
        console.log({ salesTaxData, sales }, row.original.sale_tax_id, "sales");
        return <span>{sales?.name + " (" + sales?.percentage + "%)"}</span>;
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

  // const totalRecords = membershipsData?.total_counts || 0;
  // const lastPageOffset = Math.max(
  //   0,
  //   Math.floor(totalRecords / searchCretiria.limit) * searchCretiria.limit
  // );
  // const isLastPage = searchCretiria.offset >= lastPageOffset;

  // const nextPage = () => {
  //   if (!isLastPage) {
  //     setSearchCretiria((prev) => ({
  //       ...prev,
  //       offset: prev.offset + prev.limit,
  //     }));
  //   }
  // };

  // // Function to go to the previous page
  // const prevPage = () => {
  //   setSearchCretiria((prev) => ({
  //     ...prev,
  //     offset: Math.max(0, prev.offset - prev.limit),
  //   }));
  // };

  // // Function to go to the first page
  // const firstPage = () => {
  //   setSearchCretiria((prev) => ({
  //     ...prev,
  //     offset: 0,
  //   }));
  // };

  // // Function to go to the last page
  // const lastPage = () => {
  //   if (!isLastPage) {
  //     setSearchCretiria((prev) => ({
  //       ...prev,
  //       offset: lastPageOffset,
  //     }));
  //   }
  // };


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-1 items-center  ">
          <p className="font-semibold text-2xl">Income Categories</p>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1 font-semibold"
          onClick={handleAddIncomeCategory}
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>

        <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={toggleSortOrder}
        >
          <i className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == 'desc' ? "rotate-180" : "-rotate-180"}`}></i>
        </button>
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
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      {/* pagination */}
      {/* <div className="flex items-center justify-between m-4 px-2 py-1 bg-gray-100 rounded-lg">
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
            {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${memberData?.filtered_counts} Items  `}
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
      </div> */}
      

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
  sale_tax_id: number | undefined;
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
  salesTaxData?: any;
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
    setFormData((prev: incomeCategoryFromData) => ({
      ...prev,
      sale_tax_id: undefined,
      name: "",
    }));
  };
  console.log(form.formState.errors);

  return (
    <div>
      <Sheet
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: incomeCategoryFromData) => ({
            ...prev,
            sale_tax_id: undefined,
            name: "",
          }));
          form.reset({
            org_id: formData.org_id,
            sale_tax_id: undefined,
            name: "",
          });
          setIsDialogOpen();
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {formData.case == "add" ? "Create" : "Edit"} Income Category
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
                          label="Category Name*"
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
                          className=""
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
                            <SelectTrigger floatingLabel="Default Tax/VAT*">
                              <SelectValue placeholder="Select Tax/VAT" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {salesTaxData && salesTaxData?.length > 0 ? (
                              salesTaxData.map((saleTax: any, i: any) => (
                                <SelectItem
                                  value={saleTax.id?.toString()}
                                  key={i}
                                  onClick={handleOnChange}
                                >
                                  {saleTax.name +
                                    " (" +
                                    saleTax.percentage +
                                    "%)"}
                                </SelectItem>
                              ))
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
