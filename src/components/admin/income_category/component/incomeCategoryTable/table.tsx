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
import Papa from "papaparse";
const displayValue = (value: any) => (value === null ? "N/A" : value);

import { useGetSalesTaxListQuery } from "@/services/salesTaxApi";

const status = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-blue-500" },
];

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
    // sort_key: "created_at",
    sort_key: "id",
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

  const [updateIncomeCategory, { isLoading: updateLoading }] =
    useUpdateIncomeCategoryMutation();
  const { data: salesTaxData } = useGetSalesTaxListQuery(orgId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<incomeCategoryFromData>({
    sale_tax_id: undefined,
    name: "",
    org_id: orgId,
    status: "active",
  });

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

  //   // table dropdown status update
  //   const handleStatusChange = async (payload: {
  //     id: number;
  //     org_id: number;
  //     status: string;
  // ;
  //   }) => {
  //     try {
  //       const resp = await updateIncomeCategory(payload).unwrap();
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
    return Array.isArray(incomeCategoryData?.data)
      ? incomeCategoryData?.data
      : [];
  }, [incomeCategoryData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});
  const [filters, setFilters] = useState<any>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log("After update:", updatedData);
      return updatedData;
    });
  };

  const handleTaxOnChange = (value: number) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, sale_tax_id: value };
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
      header: () => (
        <div className="flex items-center gap-2">
          <p>Category Name</p>
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
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="capitalize cursor-pointer">
                    <span>{displayValue(
                      `${row.original.name}`.length > 20
                        ? `${row.original.name}`.substring(0, 20) + "..."
                        : `${row.original.name}`
                    )}</span>
                  </p>
                </TooltipTrigger>
                <TooltipContent className="mr-[17.5rem]">
                  <p className="capitalize text-sm">
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
      accessorKey: "sale_tax_id",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Default Tax/VAT</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("sale_tax_id")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
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
    // {
    //   accessorKey: "status",
    //   header: () => (<div className="flex items-center gap-2">
    //     <p>Status</p>
    //     <button
    //       className=" size-5 text-gray-400 p-0 flex items-center justify-center"
    //       onClick={() => toggleSortOrder("status")}
    //     >
    //       <i
    //         className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
    //       ></i>
    //     </button>
    //   </div>),
    //   cell: ({ row }) => {
    //     const value =
    //       row.original?.status != null ? row.original?.status + "" : "false";
    //     const statusLabel = status.filter((r) => r.value === value)[0];
    //     const id = Number(row.original.id);
    //     const org_id = Number(row.original.org_id);
    //     return (
    //       <Select
    //         defaultValue={value}
    //         onValueChange={(e) =>
    //           handleStatusChange({ status: e, id: id, org_id: org_id })
    //         }
    //       >
    //         <SelectTrigger>
    //           <SelectValue placeholder="Status" className="text-gray-400">
    //             <span className="flex gap-2 items-center">
    //               <span
    //                 className={`${statusLabel?.color} rounded-[50%] w-4 h-4`}
    //               ></span>
    //               <span>{statusLabel?.label}</span>
    //             </span>
    //           </SelectValue>
    //         </SelectTrigger>
    //         <SelectContent>
    //           {status.map((item) => (
    //             <SelectItem key={item.value + ""} value={item.value + ""}>
    //               {item.label}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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

  const totalRecords = incomeCategoryData?.filtered_counts || 0;
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

        {/* <button
            className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
            onClick={toggleSortOrder}
          >
            <i className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCretiria.sort_order == 'desc' ? "rotate-180" : "-rotate-180"}`}></i>
          </button> */}
        {/* <DataTableViewOptions table={table} action={handleExportSelected} /> */}
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
      {incomeCategorytableData.length > 0 && (
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
              {`${searchCretiria.offset + 1} - ${searchCretiria.limit} of ${incomeCategoryData?.filtered_counts} Items  `}
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

      {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}
      <IncomeCategoryForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        refetch={refetch}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
        salesTaxData={salesTaxData}
        handleTaxOnChange={handleTaxOnChange}
      />
    </div>
  );
}

interface incomeCategoryFromData {
  sale_tax_id: number | undefined;
  status: string;
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
  handleTaxOnChange,
  salesTaxData,
}: {
  data: incomeCategoryFromData;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
  handleTaxOnChange?: any;
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
    status: z.string({ required_error: "Required" }).default("active"),
    name: z
      .string()
      .min(1, { message: "Required" })
      .max(40, "Should be 40 characters or less")
      .refine(
        (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ""),
        "Name should contain only alphabets"
      ),
  });

  const form = useForm<z.infer<typeof incomeCategoryFormSchema>>({
    resolver: zodResolver(incomeCategoryFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  const onSubmit = async (data: z.infer<typeof incomeCategoryFormSchema>) => {
    const payload = {...data}
    payload.name=payload.name.toLowerCase();
    try {
      if (formData.case == "add") {
        const resp = await createIncomeCategory(payload);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Income category added successfully.",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateIncomeCategory(payload);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Income category updated successfully.",
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
                  onSubmit={form.handleSubmit(onSubmit, onError)}
                  className="flex flex-col py-4 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <FormItem>
                        <FloatingLabelInput
                          id="name"
                          name="name"
                          className="capitalize"
                          label="Category Name*"
                          value={value ?? ""}
                          onChange={handleOnChange}
                        // error={error?.message??""}
                        />
                        {/* {watcher.name ? <></> : <FormMessage />} */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sale_tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            handleTaxOnChange(Number(value));
                          }}
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
