import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
					<Select
						value={value}
						// onChange={(e) => updateMyData(row.index, "status", e.target.value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Lead Status" className="text-gray-400" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="new">New</SelectItem>
							<SelectItem value="contacted"> Contacted</SelectItem>
							<SelectItem value="in contact"> In Contact</SelectItem>
							<SelectItem value="appointment made"> Appointement Made</SelectItem>
							<SelectItem value="appointment hold"> Appointement Hold</SelectItem>
							<SelectItem value="free trial"> freetrail</SelectItem>
							<SelectItem value="sign up scheduled"> Sign up Scheduled</SelectItem>
							<SelectItem value="no show">No Show</SelectItem>
							<SelectItem value="closed refused"> Closed Refused</SelectItem>
							<SelectItem value="closed lost contact"> Closed lost contact</SelectItem>
							<SelectItem value="closed disqualified"> Closed disqualified</SelectItem>
							<SelectItem value="closed thirdparty aggregator"> Closed ThirdParty Aggregators</SelectItem>
						</SelectContent>
					</Select>
        );
      },
    }
  ];
