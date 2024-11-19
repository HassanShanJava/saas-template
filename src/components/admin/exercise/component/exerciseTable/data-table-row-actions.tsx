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
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { ErrorType, createExerciseInputTypes } from "@/app/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDeleteExerciseMutation } from "@/services/exerciseApi";
import warning from "@/assets/warning.svg";
interface DataTableRowActionsProps<TData> {
  row: number;
  data: createExerciseInputTypes;
  refetch: any;
  hanleEditExercise: any;
  access: string;
}

export function DataTableRowActions<TData>({
  row,
  data,
  refetch,
  hanleEditExercise,
  access,
}: DataTableRowActionsProps<TData>) {
  const [isdelete, setIsDelete] = React.useState(false);
  const [deleteExercise] = useDeleteExerciseMutation();
  const navigate = useNavigate();

  const deleteRow = async () => {
    try {
      const resp = await deleteExercise(data.id as number).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Exercise Deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description:
            typedError.data?.detail ||
            (typedError.data as { message?: string }).message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
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
          <DropdownMenuContent align="end" className="w-4 ">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => hanleEditExercise(data)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            {access == "full_access" && (
              <DropdownMenuItem onClick={() => setIsDelete(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {isdelete && (
          <AlertDialog open={isdelete} onOpenChange={() => setIsDelete(false)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
                <AlertDialogDescription>
                  <div className="flex flex-col items-center  justify-center gap-4">
                    <img src={warning} alt="warning" className="w-18 h-18" />
                    <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                      Are you sure you want to delete the exercise?
                    </AlertDialogTitle>
                  </div>
                  <div className="w-full flex justify-between items-center gap-3 mt-4">
                    <AlertDialogCancel
                      onClick={() => setIsDelete(false)}
                      className="w-full border border-primary font-semibold"
                    >
                      <i className="fa fa-xmark text-base px-1 "></i>
                      No
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteRow}
                      className="w-full bg-primary !text-black font-semibold"
                    >
                      <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                      Yes
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