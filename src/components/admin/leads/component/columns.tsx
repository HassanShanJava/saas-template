import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
export interface LeadType {
  name: string;
  contact: string;
  lead_owner: string;
  source: string;
  lead_since: Date; // or Date if you store it as a Date object
  status: "todo" | "complete" | "hold"; // or other status options
}

// Example function to update the row data, you need to implement this function
const updateMyData = (rowIndex: number, columnId: string, value: any) => {
  // Update logic here
};

export const columns: ColumnDef<LeadType>[]=[

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("name")}
        </div>
      ),
    },
    
    {
      accessorKey: "contact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("contact")}</div>
      ),
    },
    {
      accessorKey: "lead_owner",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead Owner" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.getValue("lead_owner")}
        </div>
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
        const field = new Date(row.getValue("lead_since"));
        return <div>{field.toDateString()}</div>;
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
          <select
            value={value}
            onChange={(e) => updateMyData(row.index, "status", e.target.value)}
          >
            <option value="todo">ToDo</option>
            <option value="complete">Complete</option>
            <option value="hold">Hold</option>
          </select>
        );
      },
    }
  ];
