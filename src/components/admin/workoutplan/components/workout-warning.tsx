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

interface PublishConfirmDialogProps {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export function PublishConfirmDialog({
  isOpen,
  onVerify,
  onCancel,
}: PublishConfirmDialogProps) {
  return (
    <div className="z-50">
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              <div className="flex flex-col items-center justify-center gap-4">
                <img src={warning} alt="warning" className="w-18 h-18" />
                <h1>Confirmation</h1>
                <AlertDialogTitle className="text-lg font-semibold text-center ">
                  Changes will make the workout 'Unpublished', Keep it
                  unpublished?
                </AlertDialogTitle>
              </div>
              <div className="w-full flex justify-between items-center gap-3 mt-4">
                <AlertDialogCancel
                  onClick={onCancel}
                  className="w-full border border-primary font-semibold"
                >
                  <i className="fa fa-xmark text-base px-1"></i>
                  Keep Unpublished
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onVerify} // Change to handleVerify
                  className="w-full bg-primary !text-black font-semibold"
                >
                  <i className="fa-regular fa-floppy-disk text-base px-1 "></i>
                  Publish Workout Plan
                </AlertDialogAction>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
