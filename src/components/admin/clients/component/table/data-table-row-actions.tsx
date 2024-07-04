
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {  MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { taskSchema } from "@/schema/taskSchema";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);


  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          {/* <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(task.id)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Task ID
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          {/* <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem>
              {" "}
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger> */}
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Details
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.label}>
                {label_options.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    <label.icon className="w-4 h-4 mr-2" />
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}
        </DropdownMenuContent>
      </DropdownMenu>
     
    </Dialog>
  );
}
