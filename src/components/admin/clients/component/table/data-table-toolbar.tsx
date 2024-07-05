import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { PlusIcon, Search, X } from "lucide-react";

import { priority_options, status_options } from "./filter";
import { DataTableViewOptions } from './data-table-view-options';
import { useNavigate } from "react-router-dom";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
    const navigate = useNavigate();

  function handleRoute(){
    navigate("/admin/client/addclient");
  }
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex flex-1 items-center space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex items-center w-[40%] gap-2 px-2 py-2 rounded-md border border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
            <Search className="w-6 h-6 text-gray-500" />
            <input
              placeholder="Search"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="h-7 w-[150px] lg:w-[220px] outline-none"
            />
          </div>
        </div>

        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={status_options}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priority_options}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )} */}
      </div>
      <Button className="bg-primary m-4 text-black gap-1" onClick={handleRoute}>
        <PlusIcon className="h-4 w-4" />
        Add Client
      </Button>
      <DataTableViewOptions table={table} action={()=>null}/>
    </div>
  );
}