import React, { useState } from "react";
import { ErrorType } from "@/app/types";
import { ResourceTypes } from "@/app/types/roles";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useCreateRoleMutation,
  useGetAllResourcesQuery,
  useUpdateRoleMutation,
} from "@/services/rolesApi";
import { status } from "@/constants/global";

export const RoleForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  setFormData,
  refetch,
  resourceRefetch,
}: {
  data: any;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  setFormData?: any;
  refetch?: any;
  resourceRefetch?: any;
}) => {
  const { toast } = useToast();
  const [tableAccess, setAccess] = useState<Record<number, string>>({});

  const { data, isLoading, error } = useGetAllResourcesQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const allResourceTableData = React.useMemo(() => {
    return Array.isArray(data?.allResourceData)
      ? convertToTableData(data?.allResourceData)
      : [];
  }, [data]);

  const [expanded, setExpanded] = useState<ExpandedState>(true);

  console.log({ formData });

  const createAccess = (array: ResourceTypes[]) => {
    const noAccessMap: Record<number, string> = {};
    array.forEach((item: ResourceTypes) => {
      if (item.is_root) {
        noAccessMap[item.id] = "no_access";
      }
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          noAccessMap[child.id] = "no_access";
        });
      }
    });
    setAccess(noAccessMap);
  };

  useEffect(() => {
    if (data?.allResourceData && formData.case == "add") {
      createAccess(data?.allResourceData);
    } else if (formData.case == "edit") {
      console.log(formData.tableAccess, "formData.tableAccess");
      setAccess(formData.tableAccess);
      form.reset(formData);
    }
  }, [data, formData]);

  console.log({ tableAccess });
  const RoleFormSchema = z.object({
    org_id: z.number(),
    name: z.string().min(1, { message: "Required" }),
    status: z
      .string({
        required_error: "Required",
      })
      .default("active"),
  });

  const form = useForm<z.infer<typeof RoleFormSchema>>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: formData,
    mode: "all",
  });

  const watcher = form.watch();

  const resetFormAndCloseDialog = () => {
    form.clearErrors();

    setFormData((prev: any) => ({
      ...prev,
      status: "active",
      name: "",
    }));
    form.reset({
      org_id: formData.org_id,
      status: "active",
      name: "",
    });
    createAccess(data?.allResourceData as ResourceTypes[]);
  };

  const handleClose = () => {
    form.clearErrors();

    setFormData((prev: any) => ({
      ...prev,
      status: "active",
      name: "",
    }));
    form.reset({
      org_id: formData.org_id,
      status: "active",
      name: "",
    });
    setIsDialogOpen();
  };

  const handleAccessChange = (id: number, access: string) => {
    setAccess((prev) => ({
      ...prev,
      [id]: access,
    }));
  };

  const onSubmit = async (data: z.infer<typeof RoleFormSchema>) => {
    const payload = {
      ...data,
      resource_id: Object.keys(tableAccess).map((item) => Number(item)),
      access_type: Object.values(tableAccess),
    };

    console.log({ payload }, "payload");

    try {
      if (formData.case == "add") {
        const resp = await createRole(payload).unwrap();
        if (resp) {
          refetch();
          toast({
            variant: "success",
            title: "Role Created Successfully",
          });
          resetFormAndCloseDialog();
          setIsDialogOpen(false);
        }
      } else {
        const resp = await updateRole({ ...payload, id: formData.id }).unwrap();
        if (resp) {
          console.log({ resp });
          refetch();
          resourceRefetch();
          toast({
            variant: "success",
            title: "Role Updated Successfully",
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

  const columns: ColumnDef<ResourceTypes>[] = [
    {
      accessorKey: "name",
      header: "Module",
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center gap-2 text-ellipsis whitespace-nowrap overflow-hidden ${row.original.is_parent && " font-semibold"}`}
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            {row.getCanExpand() && (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
                className="flex gap-1 items-center"
              >
                {row.getIsExpanded() ? (
                  <i className="fa fa-angle-down w-3 h-3"></i>
                ) : (
                  <i className="fa fa-angle-right w-3 h-3"></i>
                )}
              </button>
            )}
            <span className="text-gray-500">{row?.original?.name}</span>
          </div>
        );
      },
    },
    {
      id: "no_access",
      header: () => {
        return (
          <div className="flex gap-1">
            <p className="text-nowrap">No Access</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="hover:cursor-pointer"
                >
                  <Info className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52 ">
                  User with this permission cannot access the module at all.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={tableAccess[row.original.id] == "no_access"}
            aria-label="No Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"no_access"}
            disabled={tableAccess[row.original.id] == "no_access"}
            onCheckedChange={() =>
              handleAccessChange(row.original.id, "no_access")
            }
          />
        ),
    },
    {
      id: "read",
      header: () => {
        return (
          <div className="flex gap-1">
            <p className="text-nowrap">Read</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="hover:cursor-pointer"
                >
                  <Info className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52 ">
                  User with this permission can view the module and its data but cannot make any changes. 
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={tableAccess[row.original.id] == "read"}
            aria-label="Read Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"read"}
            disabled={tableAccess[row.original.id] == "read"}
            onCheckedChange={() => handleAccessChange(row.original.id, "read")}
          />
        ),
    },
    {
      id: "write",
      header: () => {
        return (
          <div className="flex gap-1">
            <p className="text-nowrap">Write</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="hover:cursor-pointer"
                >
                  <Info className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52 ">
                  User with this permission can view, create, and edit data within the module but cannot delete it.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={tableAccess[row.original.id] == "write"}
            aria-label="Write Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"write"}
            disabled={tableAccess[row.original.id] == "write"}
            onCheckedChange={() => handleAccessChange(row.original.id, "write")}
          />
        ),
    },
    {
      id: "full_access",
      header: () => {
        return (
          <div className="flex gap-1">
            <p className="text-nowrap">Full Access</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="hover:cursor-pointer"
                >
                  <Info className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52 ">
                  User with this permission can view, create, edit, and delete data within the module.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={tableAccess[row.original.id] == "full_access"}
            aria-label="Full Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"full_access"}
            disabled={tableAccess[row.original.id] == "full_access"}
            onCheckedChange={() =>
              handleAccessChange(row.original.id, "full_access")
            }
          />
        ),
    },
  ];

  const table = useReactTable({
    data: allResourceTableData as ResourceTypes[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      expanded,
    },
    autoResetExpanded: false,
    initialState: {
      expanded: true,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row?.subRows,
    getExpandedRowModel: getExpandedRowModel(),
  });

  console.log({ watcher }, "role form");

  return (
    <div>
      <Sheet open={isDialogOpen}>
        <SheetContent
          className="w-full !max-w-[930px]  flex flex-col custom-scrollbar py-0"
          hideCloseButton
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col  gap-4 pb-4"
            >
              <SheetHeader className="sticky top-0 pt-4 bg-white z-[100]">
                <div className="flex items-center justify-between gap-5 ">
                  <SheetTitle className="text-xl font-semibold px-1 ">
                    {formData.case == "add" ? "Create" : "Edit"} Role
                  </SheetTitle>
                  <div className="flex justify-center gap-5 ">
                    <Button
                      type="button"
                      className="w-[100px] text-center flex items-center gap-2 border-primary"
                      variant={"outline"}
                      onClick={handleClose}
                    >
                      <i className="fa fa-xmark px-1 "></i>
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      className="w-[100px] px-2 text-center flex items-center gap-2 border-primary text-black"
                      loading={form.formState.isSubmitting}
                    >
                      {!form.formState.isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </SheetHeader>
              <SheetDescription>
                <div className="flex gap-4 flex-row min-w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FloatingLabelInput
                          {...field}
                          id="name"
                          name="name"
                          label="Role Name"
                          text="*"
                          value={field.value}
                          defaultValue={field.value}
                        />
                        {watcher.name ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value} // Ensure value is a string
                        >
                          <FormControl>
                            <SelectTrigger floatingLabel="Status" text="*">
                              <SelectValue placeholder="Select status">
                                <span className="flex gap-2 items-center">
                                  <span
                                    className={`w-2 h-2 rounded-full ${field.value == "active"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                      }`}
                                  ></span>
                                  {
                                    status.filter(
                                      (status) => status.value === field.value
                                    )[0]?.label
                                  }
                                </span>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        {watcher.status ? <></> : <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-xl px-1 my-4 font-semibold text-black">
                    Module Access
                  </h1>
                  <div className="rounded-none  ">
                    <ScrollArea className="w-full relative">
                      <ScrollBar orientation="horizontal" />
                      <Table className="relative w-full">
                        <TableHeader className="bg-gray-100  !sticky !top-0  z-50">
                          {table?.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead
                                    key={header.id}
                                    style={{
                                      minWidth: header.column.columnDef.size,
                                      maxWidth: header.column.columnDef.size,
                                      fontWeight: "bold",
                                    }}
                                  >
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
                        <TableBody className="">
                          {isLoading ? (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center "
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
                          ) : data?.allResourceData &&
                            data?.allResourceData.length > 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                              >
                                No role found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                              >
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </div>
              </SheetDescription>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const convertToTableData = (data: ResourceTypes[]) => {
  const processItem = (item: ResourceTypes) => {
    if (item.children) {
      // Recursively process each child and convert `children` to `subRows`
      const newItem: ResourceTypes = {
        ...item,
        subRows: item.children.map(processItem),
      };

      delete newItem.children;
      return newItem;
    } else {
      return item;
    }
  };

  return data.map(processItem);
};
