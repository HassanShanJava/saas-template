import React, { useEffect, useState } from "react";
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
import { useGetResourcesQuery, useGetRolesQuery } from "@/services/rolesApi";
import { RoleForm } from "./../../roleform/form";

export default function RoleTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const [isRoleFound, setRoleFound] = useState<boolean>(false);

  const {
    data: rolesData,
    isLoading: rolesLoading,
    refetch: rolesRefetch,
    error: rolesError,
  } = useGetRolesQuery(orgId);

  const [selectedRoleId, setSelectedRoleId] = useState<number>(); // 0 can be the default for "Select a role"

  const {
    data: resourceData,
    isLoading,
    refetch,
    error,
  } = useGetResourcesQuery(selectedRoleId);

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
  console.log({ resourceData });
  const permissionTableData = React.useMemo(() => {
    return Array.isArray(resourceData) && resourceData ? resourceData : [];
  }, [resourceData]);
  console.log("data", { resourceData, error });

  useEffect(() => {
    if (resourceData) {
      setRoleFound(true);
    }
  }, [resourceData]);

  const table = useReactTable({
    data: permissionTableData as getRolesType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    console.log("Selected Role ID:", selectedId);
    // const role = resourceData?.find((r) => r.name === selectedId);
    // console.log(role);
    setSelectedRoleId(Number(selectedId));
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
    const finalValue: number | string = value;

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

  const handleEditRole = () => {
    console.log("Before update:", formData);
    setFormData((prevData: any) => {
      const updatedData = { ...prevData, case: "edit" };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between px-5 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Select
              onValueChange={(value) => setSelectedRoleId(Number(value))}
              defaultValue={undefined}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                {rolesData && rolesData.length > 0 ? (
                  rolesData?.map((sourceval: getRolesType) => {
                    console.log({ sourceval });
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
              className="gap-1 justify-center text-gray-500 font-normal border-primary items-center flex px-3"
              disabled={!selectedRoleId}
              onClick={handleEditRole}
            >
              <i className="fa-regular fa-edit h-4 w-4"></i>
              Edit
            </Button>
          </div>
        </div>
        <Button
          className="bg-primary m-4 text-black gap-1 "
          onClick={handleAddRole}
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>
      </div>
      {isRoleFound ? (
        <div className="rounded-none border border-border ">
          <ScrollArea className="w-full relative  space-y-0">
            <ScrollBar orientation="vertical" />
            <Table className="w-full h-full max-h-96 overflow-y-auto relative custom-scrollbar">
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
      ):(
        <div className="h-[30rem] flex justify-center items-center">
            <p className="text-lg font-bold">Please select a role from above to view his access</p>
        </div>
      )}
      {/* form data for create RoleForm */}
      <RoleForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
      />
    </div>
  );
}
