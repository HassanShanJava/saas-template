import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TaskType } from "@/schema/taskSchema";
import { label_options, priority_options, status_options } from "./filter";

export const columns: ColumnDef<TaskType>[] = [
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
  },
  {
    accessorKey: "own_member_id",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-sm"
        column={column}
        title="Client Id"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] justify-start items-center flex">
        {row.getValue("own_member_id")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("last_name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("business_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("phone")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "coach_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coach" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("coach_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "client_since",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activation Date" />
    ),
    cell: ({ row }) => {
      const field = row.getValue("client_since") as Date;
      return <div>{field.toDateString()}</div>;
    },
  },
  {
    accessorKey: "check_in",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Check In" />
    ),
    cell: ({ row }) => {
      const field = row.getValue("check_in") as Date;
      return <div>{field.toDateString()}</div>;
    },
  },
  {
    accessorKey: "last_online",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => {
      const field = row.getValue("last_online") as Date;
      return <div>{field.toDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

