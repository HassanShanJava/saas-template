import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRolesType, MemberTabletypes } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RootState, AppDispatch } from "@/app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetRolesQuery } from "@/services/rolesApi";
import { RoleForm } from "./../../roleform/form";

export default function RoleTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const {
    data: rolesData,
    isLoading,
    refetch,
    error,
  } = useGetRolesQuery(orgId);

  const [selectedRole, setSelectedRole]=useState({})

  

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
          disabled
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
          disabled
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
          disabled
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
          disabled
          aria-label="Full Access"
          className="translate-y-[2px]"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: rolesData as getRolesType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const permissionTableData = React.useMemo(() => {
    return Array.isArray(rolesData) ? rolesData : [];
  }, [rolesData]);
  console.log("data", { rolesData, error });

  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(""); // 0 can be the default for "Select a role"

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    console.log("Selected Role ID:", selectedId);
    // const role = rolesData?.find((r) => r.name === selectedId);
    // console.log(role);
    setSelectedRoleId(selectedId);
    //  dispatch(selectedRoleId(selectedId));
  };
  const [formData, setFormData] = useState<any>({
    status: "",
    name: "",
    org_id: orgId,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleCloseDailog = () => setIsDialogOpen(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value }, "name,value");
    let finalValue: number | string = value;
    if (name == "min_limit") {
      finalValue = Number(value);
    }
    setFormData((prevData: any) => {
      const updatedData = { ...prevData, [name]: finalValue };
      console.log("After update:", updatedData);
      return updatedData;
    });
  };

  const handleAddRole = () => {
    console.log("Before update:", formData);
    setFormData((prevData: any) => {
      const updatedData = { ...prevData, case: "add" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };


 
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-5 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Select
              // onValueChange={(value) => handleSelctedRow(value)}
              // defaultValue={undefined}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem> */}
                {rolesData && rolesData.length > 0 ? (
                  rolesData?.map((sourceval: getRolesType) => {
                    console.log({sourceval});
                    return (
                      <SelectItem
                        key={sourceval.role_id}
                        value={sourceval.role_id?.toString()}
                      >
                        {sourceval.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <>
                    <p className="p-2"> No Roles Found.</p>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Button
              variant={"outline"}
              className="gap-2 text-lg justify-center items-center flex"
              disabled={!selectedRoleId}
            >
              <FaEdit className="text-gray-500 h-5 w-5" />
              Edit
            </Button>
          </div>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1"
          onClick={handleAddRole}
        >
          <PlusIcon className="h-4 w-4" />
          Create Role
        </Button>
      </div>
      <div className="rounded-md border border-border ">
        <ScrollArea className="w-full relative h-96">
          <ScrollBar orientation="vertical" />
          <Table className="w-full ">
            <TableHeader className="bg-outletcolor sticky top-0 z-40">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
              ) : permissionTableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No Module Found!.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No Module Found!.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      {/* form data for create RoleForm */}
      <RoleForm
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
