import React from "react";
import { ErrorType, getRolesType } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { useGetAllResourcesQuery, useGetRolesQuery } from "@/services/rolesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const status = [
  { value: "true", label: "Active", color: "bg-green-500" },
  { value: "false", label: "Inactive", color: "bg-blue-500" },
];

export const RoleForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  setFormData,
  handleOnChange,
}: {
  data: any;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  setFormData?: any;
  handleOnChange?: any;
}) => {
  const { toast } = useToast();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    data: allResourceData,
    isLoading,
    refetch,
    error,
  } = useGetAllResourcesQuery();

  const allResourceTableData = React.useMemo(() => {
    return Array.isArray(allResourceData) ? allResourceData : [];
  }, [allResourceData]);

  console.log({ allResourceTableData });

  // const [formData, setFormData] = useState(data);
  // const [createCredits, { isLoading: creditsLoading }] =
  //   useCreateCreditsMutation();
  // const [updateCredits, { isLoading: updateLoading }] =
  //   useUpdateCreditsMutation();

  // useEffect(() => {
  //   form.reset(formData);
  //   setFormData(formData);
  // }, [formData]);

  const RoleFormSchema = z.object({
    org_id: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    status: z
      .boolean({
        required_error: "Please select a status",
      })
      .default(true),
    module: z.array(z.number()),
    access: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof RoleFormSchema>>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof RoleFormSchema>) => {
    console.log({ data },"payload");

    try {
      if (formData.case == "add") {
        // const resp = await createCredits(data).unwrap();
        // if (resp) {
        //   console.log({ resp });
        //   refetch();
        //   toast({
        //     variant: "success",
        //     title: "Credit Created Successfully",
        //   });
        //   resetFormAndCloseDialog();
        //   setIsDialogOpen(false);
        // }
      } else {
        // const resp = await updateCredits(data).unwrap();
        // if (resp) {
        //   console.log({ resp });
        //   refetch();
        //   toast({
        //     variant: "success",
        //     title: "Updated Successfully",
        //   });
        //   resetFormAndCloseDialog();
        //   setIsDialogOpen(false);
        // }
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
    setFormData((prev: any) => ({
      ...prev,
    }));
  };

  const handleClose = () => {
    // clearErrors();
    setIsDialogOpen(false);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Module",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {row?.original?.name}
          </div>
        );
      },
    },
    {
      id: "no_access",
      header: "No Access",
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={row.original.access === "no_access"}
          aria-label="No Access"
          className="translate-y-[2px]"
        />
      ),
    },
    {
      id: "read",
      header: "Read",
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={row.original.access === "read"}
          aria-label="Read Access"
          className="translate-y-[2px]"
        />
      ),
    },
    {
      id: "write",
      header: "Write",
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={row.original.access === "write"}
          aria-label="Write Access"
          className="translate-y-[2px]"
        />
      ),
    },
    {
      id: "full_access",
      header: "Full Access",
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={row.original.access === "full_access"}
          aria-label="Full Access"
          className="translate-y-[2px]"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: allResourceTableData as getRolesType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setFormData((prev: any) => ({
            ...prev,
            status: true,
            name: "",
          }));
          form.reset({
            org_id: formData.org_id,
            status: true,
            name: "",
          });
          setIsDialogOpen();
        }}
      >
        <DialogContent
          className="w-full max-w-[930px] h-fit flex flex-col"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold px-1">
              {formData.case == "add" ? "Create" : "Edit"} Role
            </DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col  gap-4 "
                >
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
                            label="Role Name*"
                            value={field.value ?? ""}
                          />
                          {watcher.name ? <></> : <FormMessage />}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      defaultValue={true}
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"} // Ensure value is a string
                          >
                            <FormControl>
                              <SelectTrigger floatingLabel="Status">
                                <SelectValue placeholder="Select status">
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
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          {watcher.status ? <></> : <FormMessage />}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl px-1 font-semibold text-black">
                      Module Access
                    </h1>
                    <div className="rounded-none  mt-4">
                      <ScrollArea className="w-full relative">
                        <ScrollBar orientation="horizontal" />
                        <Table
                          className=""
                          containerClassname="h-fit max-h-80 overflow-y-auto relative custom-scrollbar "
                        >
                          <TableHeader className="bg-gray-100 sticky top-0 z-50">
                            {table?.getHeaderGroups().map((headerGroup) => (
                              <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                  return (
                                    <TableHead
                                      key={header.id}
                                      style={{
                                        minWidth: header.column.columnDef.size,
                                        maxWidth: header.column.columnDef.size,
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
                            ) : allResourceData &&
                              allResourceData.length > 0 ? (
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
                                  No data available
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 justify-between w-full ">
                    <Button
                      type="button"
                      className="w-full text-center flex items-center gap-2"
                      variant={"outline"}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      className="w-full  bg-primary  text-black gap-1 font-semibold"
                      loading={form.formState.isSubmitting}
                    >
                      {!form.formState.isSubmitting && (
                        <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      )}
                      Save
                    </LoadingButton>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
