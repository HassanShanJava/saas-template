import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { FaFileCsv } from "react-icons/fa";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  action?: () => void;
}

export function DataTableViewOptions<TData>({
  table,
  action = () => null,
}: DataTableViewOptionsProps<TData>) {
  function handleClick() {
    action();
  }

  return (
    <div className="flex justify-between items-center gap-3">
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-xs lg:text-base">
            <Settings2 className="mr-2 h-4 w-4" />
            Columns Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              const { meta }: any = column.columnDef;
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {(meta as string) ?? column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
