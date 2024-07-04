import React from "react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export interface StaffDataType {
  org_id: number;
  id: number;
  first_name: string;
}
export interface LeadType {
  name: string;
  email: string;
  owner: string;
  status: string;
  source: string;
  lead_since: Date;
  staffData?: StaffDataType[];
}

// Example function to update the row data, you need to implement this function
const updateMyData = async (rowIndex: number, columnId: string, value: any) => {
// Update logic here
console.log({ rowIndex ,columnId, value});


};

// status
const statusItems = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in-contact", label: "In Contact" },
  { value: "appointment-made", label: "Appointment Made" },
  { value: "appointment-hold", label: "Appointment Hold" },
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

export const columns: ColumnDef<LeadType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
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
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Owner" />
    ),
    cell: ({ row }) => {
      // <div className="max-w-[200px] truncate">
      //   {row.getValue("owner")}
      // </div>
      const staffData = row.original.staffData;
      return (
        <Select defaultValue={row.getValue("owner")?.trim()}>
          <SelectTrigger>
            <SelectValue placeholder="Lead Owner" className="text-gray-400" />
          </SelectTrigger>
          <SelectContent>
            {staffData?.map((item) => (
              <SelectItem
                key={item.id + ""}
                value={item.id + ""}
                onChange={(e) =>
                  updateMyData(row.index, "owner", e?.target?.value)
                }
              >
                {item.first_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const value = row.original.status;
      return (
        <Select defaultValue={value}>
          <SelectTrigger>
            <SelectValue placeholder="Lead Status" className="text-gray-400" />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                onChange={(e) =>
                  updateMyData(row.index, "status", e?.target?.value)
                }
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
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
];



function convertDateToEuropeanFormat(dateString:string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}