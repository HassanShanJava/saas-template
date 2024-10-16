import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import Receipt, { ReceiptExport } from "./receipt-component";
import { salesReportInterface, statusEnumGrid } from "@/app/types";

interface DataTableRowActionsProps {
  data?: salesReportInterface;
  refetch?: () => void;
  handleEdit?: (data: salesReportInterface) => void;
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

  const handlePrintInvoice = async () => {
    if (data) {
      // Assuming currentData.response.orders[0] has all the necessary data
      const invoiceData = data;
      const htmlContent = await ReceiptExport(invoiceData); // Get the HTML content

      // Create an invisible iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";

      // Append the iframe to the body
      document.body.appendChild(iframe);

      // Write the HTML content to the iframe's document
      const iframeDoc =
        iframe.contentWindow?.document || iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Wait until the iframe content is fully loaded
        iframe.onload = () => {
          // Trigger print
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
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
              {data?.transaction_type !== statusEnumGrid.Refund && (
                <DropdownMenuItem
                  disabled={data?.status !== "Paid"}
                  onClick={handleEdit ? () => handleEdit(data!) : undefined}
                >
                  <i className="fa-solid fa-cash-register mr-2"></i>
                  Refund
                </DropdownMenuItem>
              )}
            </DialogTrigger>

            <DropdownMenuItem
              className="text-nowrap w-full"
              onClick={handlePrintInvoice}
            >
              <i className="fa-solid fa-print mr-2"></i> Print Receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Receipt Modal */}
        <DialogContent className="overflow-auto h-[350px]">
          {data ? (
            <div ref={receiptRef} className="printable-receipt">
              <Receipt salesReport={data} />
            </div>
          ) : (
            <p>No receipt data available.</p>
          )}
          <div className="w-full justify-center items-center gap-4 flex">
            <Button
              className="w-full gap-3"
              onClick={handlePrintInvoice}
              disabled={!data}
            >
              <i className="fa-solid fa-print"></i> Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
