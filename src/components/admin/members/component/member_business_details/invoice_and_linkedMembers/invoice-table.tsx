// import React from "react";

// const InvoiceTableForMember = () => {
//   return <div className="mt-3">InvoiceTableForMember</div>;
// };

// export default InvoiceTableForMember;
import React, { useState, useEffect } from "react";
import { Shell } from "@/components/ui/shell/shell";
// import { DataTable } from "./component/data-table";
import { DataTable } from "@/components/ui/table/data-table";
import {
  useGetAllStaffQuery,
  useGetLeadsQuery,
  useUpdateleadStaffMutation,
  useUpdateStatusMutation,
} from "@/services/leadsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorType } from "@/app/types";
import { toast } from "@/components/ui/use-toast";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
export interface StaffDataType {
  org_id: number;
  id: number;
  first_name: string;
}
export interface LeadType {
  id?: number;
  name: string;
  email: string;
  owner: string;
  status: string;
  source: string;
  lead_since: Date;
  staffData?: StaffDataType[];
}

// status
const statusItems = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in contact", label: "In Contact" },
  { value: "appointment made", label: "Appointment Made" },
  { value: "appointment hold", label: "Appointment Hold" },
  { value: "free trial", label: "Free Trial" },
  { value: "sign up scheduled", label: "Sign Up Scheduled" },
  { value: "no show", label: "No Show" },
  { value: "closed refused", label: "Closed Refused" },
  { value: "closed lost contact", label: "Closed Lost Contact" },
  { value: "closed disqualified", label: "Closed Disqualified" },
  {
    value: "closed thirdparty aggregator",
    label: "Closed Third Party Aggregator",
  },
];

function convertDateToEuropeanFormat(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const InvoiceTableForMember: React.FC = () => {
  const [data, setData] = useState<LeadType[]>([]);
  const navigate = useNavigate();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const columns: ColumnDef<LeadType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-[200px] truncate font-medium">
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("mobile")}</div>
      ),
    },

    {
      accessorKey: "source",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Source" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("source")}</div>
      ),
    },
    {
      accessorKey: "lead_since",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead Since" />
      ),
      cell: ({ row }) => {
        const field = convertDateToEuropeanFormat(row.getValue("lead_since"));
        return <div>{field}</div>;
      },
    },
    {
      id: "actions",
      header: ({ column }) => <p>Actions</p>,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full flex justify-center">
                <i className="fas fa-ellipsis-vertical h-4 w-4 text-center"></i>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/admin/leads/editlead/${id}`);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  console.log({ data });
  return <DataTable columns={columns} data={data} />;
};

export default InvoiceTableForMember;
