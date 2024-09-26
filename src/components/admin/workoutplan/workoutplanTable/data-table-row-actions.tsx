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
import warning from "@/assets/warning.svg";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, WorkoutPlanView } from "@/app/types";
import { useDeleteWorkoutMutation } from "@/services/workoutService";
import { useNavigate } from "react-router-dom";

export function DataTableRowActions({
  access,
  row,
  data,
  refetch,
  handleEdit,
}: {
  access: string;
  row: number;
  data: WorkoutPlanView & { id: number };
  refetch?: any;
  handleEdit?: any;
}) {
  const [isdelete, setIsDelete] = React.useState(false);
  const navigate = useNavigate(); // Use the navigate hook

  const { toast } = useToast();
  const [deleteWorkout, { isLoading: isdeletingWorkout }] =
    useDeleteWorkoutMutation();
  const deleteRow = async () => {
    try {
      const resp = await deleteWorkout(data.id).unwrap();
      if (resp) {
        refetch();
        toast({
          variant: "success",
          title: "Deleted Successfully",
        });
      }
      return;
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
  const handleEditClick = (data: WorkoutPlanView & { id: number }) => {
    // Navigate to the edit route with the specific ID
    navigate(`/admin/workoutplans/add/step/1/${data.id}`);
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
              <DropdownMenuItem onClick={() => handleEditClick(data)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            {access === "full_access" && (
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
                <div className="flex flex-col items-center  justify-center gap-4">
                  <img src={warning} alt="warning" className="w-18 h-18" />
                  <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                    Please confirm if you want to delete this workout
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
