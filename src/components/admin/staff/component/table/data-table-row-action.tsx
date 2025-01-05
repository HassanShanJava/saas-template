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
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType } from "@/app/types";
import warning from "@/assets/warning.svg";
import { useDeleteStaffMutation } from "@/services/staffsApi";
import { Staff } from "@/app/types/staff";
export function DataTableRowActions({
  data,
  refetch,
  handleEdit,
  access,
}: {
  data: Staff;
  refetch?: any;
  handleEdit: (user:Staff)=>void;
  access: string;
}) {
  const [isdelete, setIsDelete] = useState(false);
  const { toast } = useToast();
  const [deleteStaff] = useDeleteStaffMutation();

  const deleteRow = async () => {
    try {
      const resp = await deleteStaff(data?.id as number)
        .unwrap()
        .then((res) => {
          refetch();
          toast({
            variant: "success",
            title: "Staff Deleted Successfully",
          });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: `${error?.data?.detail || error?.data?.message}`,
          });
        });
      return;
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail ?? (typedError.data as { message?: string }).message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
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
          <DropdownMenuContent align="end" className="">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => handleEdit(data)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            {access == "write" && (
              <DropdownMenuItem onClick={() => setIsDelete(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
      {isdelete && (
        <AlertDialog open={isdelete} onOpenChange={() => setIsDelete(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogDescription>
                <div className="flex flex-col items-start  justify-start gap-4">
                  <img src={warning} alt="warning" className="size-14" />
                  <AlertDialogTitle className="text-lg font-medium">
                  Are you sure you want to delete this staff? This action
                  cannot be undone.
                  </AlertDialogTitle>
                </div>
                <div className=" flex justify-end items-center gap-3 mt-4">
                  <AlertDialogCancel
                    onClick={() => setIsDelete(false)}
                    className="w-[100px] border border-primary font-semibold"
                  >
                    <i className="fa fa-xmark text-base px-1 "></i>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteRow}
                    className="w-[100px] bg-primary !text-black font-semibold"
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
    </>
  );
}
