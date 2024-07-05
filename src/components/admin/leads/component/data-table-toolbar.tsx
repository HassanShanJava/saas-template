import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, X } from "lucide-react";

import { DataTableViewOptions } from "./data-table-view-options"; 
import { useNavigate } from "react-router-dom";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const navigate = useNavigate();

  function handleRoute() {
    navigate("/admin/leads/addlead");
  }
  return (
    <div className="flex bg-white rounded-t-xl items-center m-0 px-4 justify-between">
      <div className="flex flex-1 items-center ">
        <Input
          placeholder="Filter tasks..."
          // value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          // table.getColumn("title")?.setFilterValue(event.target.value)
          // }
          className="h-12 w-[150px] lg:w-[250px] "
        />
      </div>
      <Button
        className="bg-primary m-4 text-black gap-1 h-8"
        onClick={handleRoute}
      >
        <PlusIcon className="h-4 w-4" />
        New Lead
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
