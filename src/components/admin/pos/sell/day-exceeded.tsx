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


interface DayExceededProps {
    isOpen: boolean,
    onClose: any,
    onContinue: any,
    closeModal: any,
}

export default function DayExceeded({
    isOpen,
    onClose,
    onContinue,
    closeModal
}: DayExceededProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={closeModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Register is Open more than 24 Hours</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Do you want to continue with this register session or close to create a new session?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
                    <AlertDialogCancel className="bg-primary text-black border-transparent hover:" onClick={onContinue}>Continue</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}