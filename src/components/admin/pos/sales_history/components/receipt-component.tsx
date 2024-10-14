import { salesReportInterface, statusEnum } from "@/app/types";
import React from "react";

interface ReceiptProps {
  salesReport: salesReportInterface;
}
import { capitalizeFirstLetter } from "@/utils/helper";

const Receipt: React.FC<ReceiptProps> = ({ salesReport }) => {
  const isRefund = salesReport.transaction_type === statusEnum.Refund;

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">
        {isRefund ? "Refund Receipt" : "Sale Receipt"}
      </h2>
      <div className="flex flex-col  gap-2  justify-center items-center">
        <p>Receipt Number: {salesReport.receipt_number}</p>
        <p>Transaction Date: {salesReport.transaction_date}</p>
      </div>

      <h4 className="font-semibold mt-2 mb-2">Member Details</h4>
      <div className="flex justify-center gap-1 flex-col items-start">
        <p>Name: {capitalizeFirstLetter(salesReport.member_name)}</p>
        <p>Email: {capitalizeFirstLetter(salesReport.member_email)}</p>
        <p>Address: {capitalizeFirstLetter(salesReport.member_address)}</p>
        <p>Gender: {capitalizeFirstLetter(salesReport.member_gender)}</p>
      </div>

      <hr className="my-4" />

      <h4 className="font-semibold">Items</h4>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1">Name</th>
            <th className="border border-gray-300 px-2 py-1">Quantity</th>
            <th className="border border-gray-300 px-2 py-1">Price</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.items?.map((item) => (
            <tr key={item.item_id}>
              <td className="border border-gray-300 px-2 py-1">
                {capitalizeFirstLetter(item.description)}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                {item.quantity}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                {item.price.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                {item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-4" />
      <h4 className="font-semibold pb-2">Summary</h4>
      <div className="flex flex-col justify-center items-start gap-2">
        <p>
          Subtotal:{" "}
          <span className="font-bold">{salesReport.subtotal.toFixed(2)}</span>
        </p>
        <p>
          Discount:{" "}
          <span className="font-bold">
            {salesReport.discount_amt.toFixed(2)}
          </span>
        </p>
        <p>
          Tax Amount:{" "}
          <span className="font-bold">{salesReport.tax_amt.toFixed(2)}</span>
        </p>
        <h4 className="font-bold">
          Total: <span className="text-lg">{salesReport.total.toFixed(2)}</span>
        </h4>

        <p>Notes: {capitalizeFirstLetter(salesReport.notes)}</p>
      </div>
    </div>
  );
};

export default Receipt;
