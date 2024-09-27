import { Button } from "@/components/ui/button";
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
import { useState } from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialogDay({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [isdelete, setIsDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog open={isdelete} onOpenChange={() => setIsDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              <div className="flex flex-col items-center  justify-center gap-4">
                <img src={warning} alt="warning" className="w-18 h-18" />
                <AlertDialogTitle className="text-xl font-semibold w-80 text-center">
                  Please confirm if you want to delete this workout day?
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
                  onClick={onConfirm}
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
    </>
  );
}
