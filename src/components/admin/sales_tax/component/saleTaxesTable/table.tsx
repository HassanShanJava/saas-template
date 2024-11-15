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

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import { saleTaxesTableType, ErrorType } from "@/app/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import Papa from "papaparse";

import {
  useCreateSalesTaxMutation,
  useGetSalesTaxQuery,
  useUpdateSalesTaxMutation,
} from "@/services/salesTaxApi";

import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { status } from "@/constants/global";

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

interface SearchCriteriaType {
  limit: number;
  offset: number;
  sort_order: string;
  sort_key?: string;
}

export default function SaleTaxesTableView() {
  const sale_tax = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).sale_tax ??
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
  const [updateSaleTax, { isLoading: saleTaxLoading }] =
    useUpdateSalesTaxMutation();

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDailog = () => setIsDialogOpen(false);

  const [formData, setFormData] = useState<saleTaxesFormData>({
    percentage: 1,
    name: "",
    status: "active",
    org_id: orgId,
  });

  const saletaxestableData = React.useMemo(() => {
    return Array.isArray(saleTaxesData?.data) ? saleTaxesData?.data : [];
  }, [saleTaxesData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const displayValue = (value: any) => (value === null ? "N/A" : value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  const handleStatusChange = async (payload: {
    id: number;
    org_id: number;
    status: string;
  }) => {
    try {
      const resp = await updateSaleTax(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Tax/VAT Updated Successfully",
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
  const actionsColumn: ColumnDef<saleTaxesTableType> = {
    id: "actions",
    header: "Actions",
    maxSize: 100,
    cell: ({ row }) => (
      <DataTableRowActions
        access={sale_tax}
        data={row.original}
        refetch={refetch}
        handleEdit={handleEditSaleTax}
      />
    ),
  };

  const columns: ColumnDef<saleTaxesTableType>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Tax/VAT Name</p>
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
                        `${row.original.name}`.length > 20
                          ? `${row.original.name}`.substring(0, 20) + "..."
                          : `${row.original.name}`
                      )}
                    </span>
                  </p>
                </TooltipTrigger>
                <TooltipContent className="mr-[16.5rem]">
                  <p className="captilaize text-sm">
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
      accessorKey: "percentage",
      header: () => (
        <div className="flex items-center gap-2">
          <p>Percentage</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            onClick={() => toggleSortOrder("percentage")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.percentage + "%"}</span>;
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
    //         className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
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
    //         <SelectTrigger className="h-8">
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
    ...(sale_tax !== "read" ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data: saletaxestableData as saleTaxesTableType[],
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

  const totalRecords = saleTaxesData?.filtered_counts || 0;
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-3">
        <div className="flex flex-1 items-center  ">
          <p className="font-semibold text-2xl">Sales Tax</p>
        </div>
        <div>
          {sale_tax !== "read" && (
            <Button
              className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
              onClick={handleAddSaleTax}
            >
              <PlusIcon className="h-4 w-4" />
              Create New
            </Button>
          )}
        </div>

        {/* <button
          className="border rounded-[50%] size-5 text-gray-400 p-5 flex items-center justify-center"
          onClick={toggleSortOrder}
        >
          <i
            className={`fa fa-sort transition-all ease-in-out duration-200 ${searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"}`}
          ></i>
        </button> */}
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
              ) : saletaxestableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No sale tax found.
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
      {saletaxestableData.length > 0 && (
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
  status: string;
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
    name: z
      .string()
      .min(1, { message: "Required" })
      .max(40, "Name must be 40 characters or less")
      .refine(
        (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ""),
        "Name should contain only alphabets"
      ),
    status: z.string({ required_error: "Required" }).default("active"),
    percentage: z
      .number({ required_error: "Required" })
      .min(1, { message: "Minimum percentage required is 1" })
      .max(99, { message: "Maximum percentage required is 99" }),
  });

  const form = useForm<z.infer<typeof saleTaxFormSchema>>({
    resolver: zodResolver(saleTaxFormSchema),
    defaultValues: formData,
    mode: "all",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof saleTaxFormSchema>) => {
    console.log({ data });
    const payload = { ...data };
    payload.name = payload.name.toLowerCase();
    try {
      if (formData.case == "add") {
        const resp = await createSalesTax(payload);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Tax/VAT added successfully.",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateSalesTax(payload);
        if (resp) {
          console.log({ resp });
          refetch();
          toast({
            variant: "success",
            title: "Tax/VAT updated successfully",
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
  const onError = () => {
    toast({
      variant: "destructive",
      description: "Please fill all the mandatory fields",
    });
  };
  const resetFormAndCloseDialog = () => {
    setFormData((prev: saleTaxesFormData) => ({
      ...prev,
      percentage: 1,
      name: "",
      status: "active",
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
            status: "active",
          }));
          form.reset({
            org_id: formData.org_id,
            percentage: 1,
            name: "",
            status: "active",
          });
          setIsDialogOpen();
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {formData.case == "add" ? "Create" : "Edit"} Tax/VAT
            </SheetTitle>
            <SheetDescription>
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
                        message: "Name should be less than 50 character.",
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
                          label="Tax/VAT Name"
                          text="*"
                          className="capitalize"
                          value={value ?? ""}
                          onChange={handleOnChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="percentage"
                    rules={{
                      required: "Required",
                      min: {
                        value: 0,
                        message: "Mininum percenttage is 0",
                      },
                      max: {
                        value: 100,
                        message: "Maximum percenttage is 100",
                      },
                    }}
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { invalid, error },
                    }) => (
                      <FormItem>
                        <FloatingLabelInput
                          type="number"
                          id="percentage"
                          name="percentage"
                          step={".1"}
                          className=""
                          label="Percentage"
                          text="*"
                          value={value}
                          onChange={handleOnChange}
                        />
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
