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
  action =()=>null,
}: DataTableViewOptionsProps<TData>) {
  function handleClick() {
    action();
  }
  return (
    <div className="flex justify-between items-center gap-3">
      
    </div>
  );
}
