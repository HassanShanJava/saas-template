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
import React, { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  CoachResponseTypeById,
  CoachTableDataTypes,
  coachUpdateInput,
  createMembershipType,
  ErrorType,
} from "@/app/types";
import { useDeleteCoachMutation } from "@/services/coachApi";
import { useNavigate } from "react-router-dom";
import { CoachInputTypes } from "@/app/types";
import warning from "@/assets/warning.svg";
export function DataTableRowActions({
  data,
  refetch,
  handleEdit,
  access
}: {
  data: CoachTableDataTypes;
  refetch: () => void;
  handleEdit: (coachData: coachUpdateInput) => void;
  access:string
}) {
  const [isdelete, setIsDelete] = React.useState(false);
  const [deleteCoach, { isLoading: deleteLoading }] = useDeleteCoachMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const deleteRow = async () => {
    const payload = {
      id: data.id,
      org_id: data.org_id,
    };
    try {
      const resp = await deleteCoach({
        id: data?.id,
        org_id: data?.org_id,
      }).unwrap();
      refetch();
      if (resp) {
        console.log({ resp });
        toast({
          variant: "success",
          title: "Coach Deleted Successfully",
        });
      }
      return;
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail}`,
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
          <DropdownMenuContent align="end" className="w-4">
            <DialogTrigger asChild>
              <DropdownMenuItem
                onClick={() => {
                  const { members, ...rest } = data;
                  const coachData = {
                    ...rest,
                    member_ids: data.members,
                  } as coachUpdateInput;
                  handleEdit(coachData);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            {access=="coach"&&<DropdownMenuItem onClick={() => setIsDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>}
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
                    Please confirm if you want to delete this Coach
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
