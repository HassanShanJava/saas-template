import React, { useState } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { displayValue, displayDate } from "@/utils/helper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

const InvoiceTableForMember: React.FC = () => {
  const { member } = JSON.parse(localStorage.getItem("accessLevels") as string);
  const [data, setData] = useState<any[]>([]);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const actionsColumn: ColumnDef<any> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      // <DataTableRowActions
      //   access={member}
      //   row={row.original.id}
      //   data={row?.original}
      //   refetch={refetch}
      //   handleEditMember={handleEditForm}
      // />
      <></>
    ),
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      meta: "transaction date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          sortKey="key"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.date)}
          </div>
        );
      },
    },
    {
      accessorKey: "reciept_no",
      meta: "reciept No",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Reciept No"
          sortKey="key"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.reciept_no)}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      meta: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Quantity"
          sortKey="key"
          className="text-nowrap"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.quantity)}
          </div>
        );
      },
    },
    {
      accessorKey: "activated_on",
      meta: "Activation Date",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Activation Date</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            // onClick={() => toggleSortOrder("activated_on")}
          >
            $
            {/* {searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"} */}
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 `}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {/* {displayDate(row?.original.activated_on)} */}
          </div>
        );
      },
    },
    {
      accessorKey: "check_in",
      meta: "Last Check In",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Last Check In</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
            // onClick={() => toggleSortOrder("check_in")}
          >
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 `}
            ></i>
            {/* $ */}
            {/* {searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"} */}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden text-black">
            {/* {displayDateTime(row?.original?.check_in)} */}
          </div>
        );
      },
    },

    ...(member !== "read" ? [actionsColumn] : []),
  ];

  console.log({ data });
  return <DataTable columns={columns} data={data} isLoading={false} />;
};

export default InvoiceTableForMember;
