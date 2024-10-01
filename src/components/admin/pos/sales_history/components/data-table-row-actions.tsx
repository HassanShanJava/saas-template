import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  counterDataType,
  CreateCounter,
  ErrorType,
  Salehistory,
  SaleshistoryTableType,
} from "@/app/types";
import warning from "@/assets/warning.svg";

export function DataTableRowActions({
  data,
  refetch,
  handleEdit,
  access,
}: {
  data?: Salehistory;
  refetch?: any;
  handleEdit?: any;
  access: string;
}) {
  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-4">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => handleEdit(data)}>
                <Pencil className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
}
