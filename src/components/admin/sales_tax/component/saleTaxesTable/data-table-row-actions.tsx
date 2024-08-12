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

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType } from "@/app/types";
import { useDeleteSalesTaxMutation } from "@/services/salesTaxApi";

interface DataTableRowActionsProps<TData> {
  id: number;
  org_id: number;
  percentage: number;
  name: string;
}

export function DataTableRowActions<TData>({
  data,
  refetch,
  handleEdit,
}: {
  data: DataTableRowActionsProps<TData>;
  refetch?: any;
  handleEdit?: any;
}) {
  const [isdelete, setIsDelete] = React.useState(false);
  const [deleteSalesTax, { isLoading: deleteLoading }] =
    useDeleteSalesTaxMutation();
  const { toast } = useToast();

  const deleteRow = async () => {
    try {
      const resp = await deleteSalesTax(data.id).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Deleted Successfully",
        });
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: typedError.data?.detail,
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
          <DropdownMenuContent align="end" className="w-4">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => handleEdit(data)}>
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
      </Dialog>
      {isdelete && (
        <AlertDialog open={isdelete} onOpenChange={() => setIsDelete(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
              <AlertDialogDescription>
                <div className="flex flex-col items-center  justify-center gap-4">
                  <img
                    src="/src/assets/warning.svg"
                    alt="warning"
                    className="w-18 h-18"
                  />
                  <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                    Please confirm if you want to delete this Tax/VAT
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
    </>
  );
}
