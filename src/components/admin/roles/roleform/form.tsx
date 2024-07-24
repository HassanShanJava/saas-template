import { ErrorType } from "@/app/types";
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
export const RoleForm = ({
  data: formData,
  setIsDialogOpen,
  isDialogOpen,
  refetch,
  setFormData,
  handleOnChange,
}: {
  data: any;
  isDialogOpen: boolean;
  setIsDialogOpen: any;
  refetch?: any;
  setFormData?: any;
  handleOnChange?: any;
}) => {
  const { toast } = useToast();

  // const [formData, setFormData] = useState(data);
  // const [createCredits, { isLoading: creditsLoading }] =
  //   useCreateCreditsMutation();
  // const [updateCredits, { isLoading: updateLoading }] =
  //   useUpdateCreditsMutation();

  console.log(formData, isDialogOpen, "dialog");

  useEffect(() => {
    form.reset(formData);
    setFormData(formData);
  }, [formData]);

  const RoleFormSchema = z.object({
    org_id: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    status: z
      .boolean({
        required_error: "Please select a status",
      })
      .default(true),
    // module: z.array(z.number()),
    // access: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof RoleFormSchema>>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watcher = form.watch();

  const onSubmit = async (data: z.infer<typeof RoleFormSchema>) => {
    console.log({ data });

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
    console.log("calling close");
    setFormData((prev: any) => ({
      ...prev,
      status: true,
      name: "",
    }));
  };

  const handleClose = () => {
    // clearErrors();
    setIsDialogOpen(false);
  };

  const moduleData = [
    {
      name: "Client",
      access: "read",
    },
    {
      name: "Leads",
      access: "write",
    },
    {
      name: "Staff",
      access: "full_access",
    },
    {
      name: "Coaches",
      access: "no_access",
    },
    {
      name: "Check In",
      access: "read",
    },
    {
      name: "Workout Plan",
      access: "write",
    },
    {
      name: "Events and Scheduling",
      access: "full_access",
    },
    {
      name: "Meal Plan",
      access: "no_access",
    },
    {
      name: "Challenge",
      access: "read",
    },
    {
      name: "Groups",
      access: "write",
    },
    {
      name: "Credits",
      access: "full_access",
    },
    {
      name: "Sales",
      access: "no_access",
    },
    {
      name: "Income Category",
      access: "read",
    },
  ];

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
          checked={row.original.access === "no_access"}
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
          checked={row.original.access === "read"}
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
          checked={row.original.access === "write"}
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
          checked={row.original.access === "full_access"}
          aria-label="Full Access"
          className="translate-y-[2px]"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: moduleData,
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
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent
          className="w-full max-w-[1050px] h-fit flex flex-col"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {formData.case == "add" ? "Create" : "Edit"} Role
            </DialogTitle>
            <DialogDescription>
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col py-4 gap-4 "
                  >
                    <div className="flex gap-2 flex-row min-w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-[50%]">
                            <FloatingLabelInput
                              {...field}
                              id="name"
                              name="name"
                              label="Role Name *"
                              value={field.value ?? ""}
                              onChange={handleOnChange}
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
                          <FormItem className="w-[50%]">
                            <Select
                              onValueChange={(value) =>
                                field.onChange(value === "true")
                              }
                              value={field.value ? "true" : "false"} // Ensure value is a string
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-black">
                        {" "}
                        Module Access
                      </h1>
                      <div className="rounded-none  ">
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
                                          minWidth:
                                            header.column.columnDef.size,
                                          maxWidth:
                                            header.column.columnDef.size,
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
                                    data-state={
                                      row.getIsSelected() && "selected"
                                    }
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
                                    No data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 w-full p-4">
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
              </>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
