import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRolesType, resourceTypes } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RootState, AppDispatch } from "@/app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetResourcesQuery, useGetRolesQuery } from "@/services/rolesApi";
import { RoleForm } from "./../../roleform/form";

export default function RoleTableView() {
  const { role } = JSON.parse(localStorage.getItem("accessLevels") as string)

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [expanded, setExpanded] = useState<ExpandedState>(true);

  const [isRoleFound, setRoleFound] = useState<boolean>(false);

  const {
    data: rolesData,
    isLoading: rolesLoading,
    refetch: rolesRefetch,
    error: rolesError,
  } = useGetRolesQuery(orgId);

  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(
    undefined
  );

  const {
    data: resourceData,
    isLoading,
    refetch,
    error,
  } = useGetResourcesQuery(selectedRoleId, {
    skip: selectedRoleId == undefined,
  });

  const permissionTableData = React.useMemo(() => {
    return Array.isArray(resourceData) ? convertToTableData(resourceData) : [];
  }, [resourceData]);
  console.log("data", { resourceData, error, permissionTableData });

  const columns: ColumnDef<resourceTypes>[] = [
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
            <span className="text-gray-500">
              {row?.original?.name}
            </span>
          </div>
        );
      },
    },
    {
      id: "no_access",
      header: "No Access",
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={row.original.access_type == "no_access"}
            aria-label="No Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"no_access"}
            disabled
          />
        ),
    },
    {
      id: "read",
      header: "Read",
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={row.original.access_type == "read"}
            aria-label="Read Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"read"}
            disabled
          />
        ),
    },
    {
      id: "write",
      header: "Write",
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={row.original.access_type == "write"}
            aria-label="Write Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"write"}
            disabled
          />
        ),
    },
    {
      id: "full_access",
      header: "Full Access",
      cell: ({ row }) =>
        row.original.subRows?.length == 0 && (
          <Checkbox
            defaultChecked={row.original.access_type == "full_access"}
            aria-label="Full Access"
            className="translate-y-[2px] disabled:opacity-100 disabled:cursor-default"
            value={"full_access"}
            disabled
          />
        ),
    },
  ];

  useEffect(() => {
    if (resourceData) {
      setRoleFound(true);
    } else {
      setRoleFound(false);
    }
  }, [resourceData]);

  const table = useReactTable({
    data: permissionTableData as resourceTypes[],
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

  // default values in form
  const [formData, setFormData] = useState<any>({
    status: 'active',
    name: "",
    org_id: orgId,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleCloseDailog = () => setIsDialogOpen(false);

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
    const data =
      rolesData && rolesData.filter((item) => item.id == selectedRoleId)[0];
    const tableAccess = createTableAccess(resourceData);
    console.log({ tableAccess }, "role access");
    setFormData((prevData: any) => {
      const updatedData = {
        ...prevData,
        case: "edit",
        id: selectedRoleId,
        tableAccess: tableAccess,
        name: data?.name,
        status: data?.status,
      };
      console.log("After update:", updatedData);
      return updatedData;
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between px-3 py-4 ">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center  relative">
            <Select
              onValueChange={(value) => setSelectedRoleId(Number(value))}
              defaultValue={undefined}
            >
              <SelectTrigger className="w-[220px] h-8 ">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                {rolesData && rolesData.length > 0 ? (
                  rolesData?.map((sourceval: getRolesType) => {
                    console.log({ sourceval });
                    return (
                      <SelectItem
                        key={sourceval.id}
                        value={sourceval.id?.toString()}
                      >
                        {sourceval?.name}
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
            {role !== "read" && <Button
              variant={"outline"}
              className={`h-8 gap-1 justify-center text-gray-500 font-normal border-primary items-center flex px-3 disabled:cursor-not-allowed`}
              disabled={!selectedRoleId}
              onClick={handleEditRole}
            >
              <i className="fa-regular fa-edit h-4 w-4"></i>
              Edit
            </Button>}
          </div>
        </div>
        {role !== "read" && <Button
          className="bg-primary text-sm  text-black flex items-center gap-1  lg:mb-0 h-8 px-2 "
          onClick={handleAddRole}
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>}
      </div>
      {isRoleFound ? (
        <div className="rounded-none border border-border pb-4">
          <ScrollArea className="w-full relative  space-y-0">
            <ScrollBar orientation="vertical" />
            <Table className="w-full h-full max-h-96 overflow-y-auto relative custom-scrollbar">
              <TableHeader className="bg-outletcolor sticky top-0 z-40">
                {table?.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-bold">
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
      ) : (
        <div className="h-[31rem] flex justify-center items-center">
          <p className="text-lg font-semibold text-gray-400">
            Please select a role from above to view his access
          </p>
        </div>
      )}
      {/* form data for create RoleForm */}
      <RoleForm
        data={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleCloseDailog}
        setFormData={setFormData}
        refetch={rolesRefetch}
        resourceRefetch={refetch}
      />
    </div>
  );
}

const convertToTableData = (data: resourceTypes[]) => {
  const processItem = (item: resourceTypes) => {
    if (item.children) {
      // Recursively process each child and convert `children` to `subRows`
      const newItem: resourceTypes = {
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

const createTableAccess = (array: resourceTypes[]) => {
  const accessMap: Record<number, string> = {};

  const processItem = (item: resourceTypes) => {
    if (item.access_type) {
      accessMap[item.id] = item.access_type;
    }

    if (item.children && item.children.length > 0) {
      item.children.forEach(processItem);
    }
  };

  array.forEach(processItem);

  return accessMap;
};
