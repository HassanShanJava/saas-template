import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface lineItems {
  item_id: number;
  item_type: string;
  description: string;
  quantity: number;
  price: number;
  tax_rate: number;
  discount: number;
  sub_total: number;
  total: number;
  tax_amount: number;
}

interface salesReportInterface {
  id: number;
  batch_id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  member_address: string;
  member_gender: string; // Replace with your genderEnum
  staff_id: number;
  staff_name: string;
  receipt_number: string;
  notes: string;
  tax_number: number;
  total: number;
  subtotal: number;
  tax_amt: number;
  discount_amt: number;
  main_transaction_id: number;
  transaction_type: string; // Replace with your statusEnum
  status: string; // Replace with your typeTransactionEnum
  transaction_date: string;
  items?: lineItems[];
}

const ReceiptComponent = ({ report }: { report: salesReportInterface }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current, // Correctly return the DOM element
  // });

  return (
    <div className="p-5">
      <button
        // onClick={handlePrint} // Pass the function directly to onClick
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Print Receipt
      </button>

      <div className="mt-8 border border-gray-300 p-4" ref={componentRef}>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Receipt</h1>
          <p className="text-sm">Receipt #: {report.receipt_number}</p>
          <p className="text-sm">Transaction Date: {report.transaction_date}</p>
        </div>

        {/* Member Details */}
        <div className="mt-4">
          <h2 className="font-bold text-lg">Member Information</h2>
          <p>Name: {report.member_name}</p>
          <p>Email: {report.member_email}</p>
          <p>Address: {report.member_address}</p>
          <p>Gender: {report.member_gender}</p>
        </div>

        {/* Line Items */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">Items</h2>
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr>
                <th className="border-b py-2">Description</th>
                <th className="border-b py-2">Qty</th>
                <th className="border-b py-2">Price</th>
                <th className="border-b py-2">Tax</th>
                <th className="border-b py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.items?.map((item) => (
                <tr key={item.item_id}>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">${item.price.toFixed(2)}</td>
                  <td className="py-2">{item.tax_rate}%</td>
                  <td className="py-2">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">Summary</h2>
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>${report.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax:</p>
            <p>${report.tax_amt.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount:</p>
            <p>-${report.discount_amt.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>${report.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <h2 className="font-bold text-lg">Notes</h2>
          <p>{report.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
