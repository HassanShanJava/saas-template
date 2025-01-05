// table related components
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-action";
import useTableData from "@/components/ui/table/data-table-logic";
import TableSearchFilter from "@/components/ui/table/data-table-search";
import Pagination from "@/components/ui/table/pagination-table";
import usePagination from "@/hooks/use-pagination";
import TableFilters from "@/components/ui/table/data-table-filter";
import { displayValue } from "@/utils/helper";

// ui related components
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// api related components
import { ErrorType } from "@/app/types";
import { useGetStaffListQuery, useGetStaffsQuery } from "@/services/staffsApi";
import { useEffect, useMemo, useState } from "react";
import { UserStatus } from "@/app/shared_enums/enums";
import { Staff } from "@/app/types/staff";
import { useGetRolesQuery } from "@/services/rolesApi";
import StaffForm from "../modal/form";

// initial filter setting
const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

const StaffManagementTable = () => {
  //access level
  const staff = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).staff ??
        "no_access"
      );
    } catch {
      return "no_access";
    }
  })();

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: staffOptions } = useGetStaffListQuery();
  const {
    data: rolesData,
    isLoading: rolesLoading,
    refetch: rolesRefetch,
    error: rolesError,
    isSuccess,
  } = useGetRolesQuery();

  const [openFilter, setOpenFilter] = useState(false);
  const [action, setAction] = useState<"add" | "edit">("add");
  const [filterData, setFilterData] = useState({});
  const [data, setData] = useState<Staff | undefined>(undefined);

  const { searchCriteria, query, toggleSortOrder, setSearchCriteria } =
    useTableData(initialValue);

  const {
    data: staffsData,
    isLoading: isStaffDataLoading,
    refetch,
    error,
    isError,
  } = useGetStaffsQuery(
    { query },
    {
      skip: query == "",
    }
  );

  const tableData = useMemo(() => {
    return Array.isArray(staffsData?.data) ? staffsData?.data : [];
  }, [staffsData?.data]);

  const handleOpenForm = (payload: Staff) => {
    setAction("edit");
    setData({ ...payload, id: payload.id });
    setIsDialogOpen(true);
  };

  const actionsColumn: ColumnDef<Staff> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        access={staff}
        data={row.original}
        refetch={refetch}
        handleEdit={handleOpenForm}
      />
    ),
  };

  const columns: ColumnDef<Staff>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      meta: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Staff ID"
          sortKey="id"
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.id)}
          </div>
        );
      },
    },
    {
      accessorKey: "first_name",
      meta: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="First Name"
          sortKey="first_name"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="capitalize text-nowrap">{row.original.first_name}</p>
        );
      },
    },
    {
      accessorKey: "last_name",
      meta: "last_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Last Name"
          sortKey="last_name"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="capitalize text-nowrap">{row.original.last_name}</p>
        );
      },
    },
    {
      accessorKey: "email",
      meta: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Email"
          sortKey="email"
          sortable={false}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return <p className="text-nowrap">{row.original.email}</p>;
      },
    },
    {
      accessorKey: "role_id",
      meta: "role_id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          sortKey="role_id"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        const Role = rolesData?.find((role) => role.id == row.original.role_id);
        return (
          <p className="capitalize text-nowrap">{displayValue(Role?.name)}</p>
        );
      },
    },
    {
      accessorKey: "gender",
      meta: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Gender"
          sortKey="gender"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="capitalize text-nowrap">
            {displayValue(row.original.gender)}
          </p>
        );
      },
    },
    {
      accessorKey: "phone_num",
      meta: "phone_num",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone Number"
          sortKey="phone_num"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="capitalize text-nowrap">
            {"+ "+displayValue(row.original.phone_num)}
          </p>
        );
      },
    },

    {
      accessorKey: "status",
      meta: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          sortKey="status"
          sortable={true}
          searchCriteria={searchCriteria} // Pass current search criteria
          toggleSortOrder={toggleSortOrder}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center capitalize gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            <Badge
              className={`
                ${
                  row.original?.status == UserStatus.Active
                    ? "bg-green-600"
                    : row.original?.status == UserStatus.Pending
                      ? "bg-yellow-500"
                      : "bg-red-500"
                } text-white font-medium`}
            >
              {displayValue(row?.original.status)}
            </Badge>
          </div>
        );
      },
    },

    // ...(staff !== "read" ? [actionsColumn] : []),
  ];
  const totalRecords = staffsData?.filtered_count ?? 0;

  useEffect(() => {
    if (isError) {
      // error state
      const typedError = error as ErrorType;
      toast({
        variant: "destructive",
        title: "Error",
        description: `${typedError?.data?.detail ?? (typedError?.data as unknown as { message?: string })?.message}`,
      });
    }
  }, [isError]);

  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });

  const handleOpen = () => {
    setAction("add");
    setIsDialogOpen(true);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilterData((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [filterName]: value,
      };
      console.log("Filter updated:", newFilters);
      return newFilters;
    });
  };

  const filterDisplay = [
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "inactive", label: "Inactive" },
        { value: "active", label: "Active" },
      ],
      function: (value: string) => handleFilterChange("status", value),
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
      function: (value: string) => handleFilterChange("gender", value),
    },
    {
      type: "multiselect",
      name: "role_ids",
      label: "Role Name",
      options:
        rolesData &&
        rolesData.map((role) => ({ value: role.id, label: role.name })),
      function: (value: string) => handleFilterChange("role_ids", value),
    },
  ];
  return (
    <>
    {/* lg:flex-row */}
      <div className="flex flex-row  lg:items-center justify-between gap-4 px-3 ">
        {/* Table Filter component */}
        <TableSearchFilter
          setSearchCriteria={setSearchCriteria}
          placeHolder={"Search By Staff Name"}
        />

        {/* Buttons Container */}
        <div className="flex flex-row lg:flex-row lg:justify-center lg:items-center gap-2">
          <Button
            access={staff !== "read"}
            className="bg-primary text-sm text-nowrap  text-black flex items-center gap-1  lg:mb-0 h-8 px-2"
            onClick={handleOpen}
          >
            <i className="fa-solid fa-plus" />
            Create New
          </Button>

          <button
            className={`border rounded-full size-3 text-gray-400 p-4 flex items-center justify-center ${Object.keys(filterData).length ? "border-primary" : ""}`}
            onClick={() => setOpenFilter(true)}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <i
                    className={`fa fa-filter ${Object.keys(filterData).length ? "text-primary" : ""}`}
                  ></i>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="capitalize">click to apply filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </div>
      </div>
      {/* Data Table */}
      <div className="mt-4 bg-white">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isStaffDataLoading}
          searchMessage="No Staff Matched Your Search Criteria"
        />
      </div>

      {/* Pagination */}
      {tableData.length > 0 && (
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

      {/* table filters */}
      <TableFilters
        isOpen={openFilter}
        setOpen={setOpenFilter}
        initialValue={initialValue}
        filterData={filterData}
        setFilter={setFilterData}
        setSearchCriteria={setSearchCriteria}
        filterDisplay={filterDisplay}
      />

      {/* form */}
      <StaffForm
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        action={action}
        setAction={setAction}
        data={data}
        setData={setData}
        refetch={refetch}
      />
    </>
  );
};

export default StaffManagementTable;
