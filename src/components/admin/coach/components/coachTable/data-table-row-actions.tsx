import { Row } from "@tanstack/react-table";
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal,MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

interface DataTableRowActionsProps<TData> {
  row: number;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isdelete, setIsDelete] = React.useState(false);

  const deleteRow = async () => {
    console.log("data")
  };

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
          <DropdownMenuContent align="end" className="w-4 ">
            <DialogTrigger asChild>
              <DropdownMenuItem >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem onClick={() => setIsDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isdelete && (
        <AlertDialog open={isdelete} onOpenChange={() => setIsDelete(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
              <AlertDialogDescription>
                <div className="flex flex-col items-center  justify-center gap-4">
                  <img
                    src="/public/warning.svg"
                    alt="warning"
                    className="w-18 h-18"
                  />
                  <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                    Please confirm if you want to delete this member
                  </AlertDialogTitle>
                </div>
                <div className="w-full flex justify-between items-center gap-3 mt-4">
                  <AlertDialogCancel
                    onClick={() => setIsDelete(false)}
                    className="w-full border border-primary font-semibold"
                  >
                    <i className="fa fa-xmark text-base px-1 "></i>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteRow}
                    className="w-full bg-primary !text-black font-semibold"
                  >
                    <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
      </Dialog>
    </>
  );
}
