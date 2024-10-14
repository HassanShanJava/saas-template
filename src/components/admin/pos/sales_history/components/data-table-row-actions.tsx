import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreVertical, Pencil } from "lucide-react";
import Receipt from "./receipt-component"; // Import your Receipt component
import { salesReportInterface } from "@/app/types"; // Ensure this import matches your types file

interface DataTableRowActionsProps {
  data?: salesReportInterface; // Make data optional
  refetch?: () => void; // Specify the return type if refetch does something
  handleEdit?: (data: salesReportInterface) => void; // Specify the type for handleEdit
  access: string;
}

export function DataTableRowActions({
  data,
  refetch,
  handleEdit,
  access,
}: DataTableRowActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");

      if (printWindow) {
        const receiptHTML = `
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                /* Add your styles here */
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { margin: 0 auto; width: 80%; }
                h1 { text-align: center; }
                .details, .items, .summary { margin-bottom: 20px; }
                .summary { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="receipt">${receiptRef.current.innerHTML}</div>
            </body>
          </html>
        `;

        printWindow.document.write(receiptHTML);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                disabled={data?.status !== "Paid"}
                onClick={handleEdit ? () => handleEdit(data!) : undefined}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Refund
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              Print Receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Receipt Modal */}
        <DialogContent>
          {/* Render Receipt only if data is defined */}
          {data ? (
            <div ref={receiptRef}>
              <Receipt salesReport={data} />
            </div>
          ) : (
            <p>No receipt data available.</p> // Optional fallback message
          )}
          <div className="w-full justify-center items-center gap-4 flex">
            <Button className="w-full" onClick={handlePrint} disabled={!data}>
              Print
            </Button>
            {/* <Button className="w-full" onClick={() => setIsModalOpen(false)}>
              Close
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
