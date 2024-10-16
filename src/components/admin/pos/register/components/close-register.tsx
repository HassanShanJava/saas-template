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
import { Button } from "@/components/ui/button";

interface AlertDiscrepancyProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  discrepancy: number | null; // Add discrepancy prop
}

export function AlertDiscrepancy({
  isOpen,
  onClose,
  onConfirm,
  discrepancy,
}: AlertDiscrepancyProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discrepancy Detected</AlertDialogTitle>
          <AlertDialogDescription className="bg-yellow-100 p-4 rounded text-yellow-800 text-sm">
            Warning: There's a discrepancy of {discrepancy} in the closing
            balance. Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
