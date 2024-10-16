import {
  lineItems,
  salesReportInterface,
  statusEnum,
  statusEnumGrid,
} from "@/app/types";
import React from "react";

interface ReceiptProps {
  salesReport: salesReportInterface;
}
import { capitalizeFirstLetter } from "@/utils/helper";

const Receipt: React.FC<ReceiptProps> = ({ salesReport }) => {
  const isRefund = salesReport.transaction_type === statusEnumGrid.Refund;

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
        {/* <h4 className="font-bold"> */}
        <h4>
          Total:{" "}
          <span className="text-lg font-bold">
            {salesReport.total.toFixed(2)}
          </span>
        </h4>

        <p>Notes: {capitalizeFirstLetter(salesReport.notes)}</p>
      </div>
    </div>
  );
};

export default Receipt;

export function ReceiptExport(salesReport: salesReportInterface) {
  const isRefund = salesReport.transaction_type === statusEnumGrid.Refund;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isRefund ? "Refund Receipt" : "Sale Receipt"}</title>
    <style>
      /* General Styles */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        background-color: #f9fafb;
        color: #333;
      }
      .container {
        max-width: 800px;
        background-color: #fff;
      }
      .heading {
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        color: #1f2937;
        margin-bottom: 15px;
      }
      .section {
        margin-bottom: 3px;
        text-align: center;
      }
      .member-details, .summary {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        border-radius: 8px;
        
      }
      .member-details{
      line-height:0px;
  	  margin:0px 20px;
      }
      .table-container {
        margin: 10px 0;
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      th, td {
        border: 1px solid #d1d5db;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f3f4f6;
        font-weight: bold;
        color: #1f2937;
      }
      .summary {
        align-items: flex-end;
        gap: 5px;
      }
      .summary p, .summary h4 {
        margin: 0;
      }
      .summary p span {
        font-weight: 700;
      }
      .total {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 8px;
      }
      .notes {
        margin-top: 10px;
        font-style: italic;
        color: #6b7280;
      }

      /* Thank You Section */
      .thank-you {
        margin-top: 20px;
        text-align: center;
        font-size: 1.2rem;
        color: #1f2937;
      }

      /* Add padding inside the container to avoid sticking to the border */
      .container {
        padding: 20px;
       
      }

      /* Print-specific Styles */
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .container {
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
    <div>
    <h2 class="heading">${isRefund ? "Refund Receipt" : "Sale Receipt"}</h2>
    </div>
   
      <div class="section">
        <p><strong>Receipt Number:</strong> ${salesReport.receipt_number}</p>
        <p><strong>Transaction Date:</strong> ${salesReport.transaction_date}</p>
      </div>

      <strong>Member Details</strong>
      <div class="member-details">
        <p><strong>Name:</strong> ${capitalizeFirstLetter(salesReport.member_name)}</p>
        <p><strong>Email:</strong> ${capitalizeFirstLetter(salesReport.member_email)}</p>
        <p><strong>Address:</strong> ${capitalizeFirstLetter(salesReport.member_address)}</p>
      </div>

      <hr />

      <h4>Items</h4>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            ${salesReport.items
              ?.map(
                (item: lineItems) => `
                <tr>
                  <td>${capitalizeFirstLetter(item.description)}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.total.toFixed(2)}</td>
                  <td>${item.tax_rate.toFixed(2)}%
                  (${item.tax_type === "inclusive" ? "Inc" : "Exc"})
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <hr />

      <h4>Summary</h4>
      <div class="summary">
        <p>Subtotal: <span>${salesReport.subtotal.toFixed(2)}</span></p>
        <p>Discount: <span>${salesReport.discount_amt.toFixed(2)}</span></p>
        <p>Tax Amount: <span>${salesReport.tax_amt.toFixed(2)}</span>
        </p>
        <p>SRB Number: <span>${salesReport.tax_number}</span></p>
        <h4 class="total">Total Amount: ${salesReport.total.toFixed(2)}</h4>
        
        
        </div>

      <div class="thank-you">
        ${isRefund ? "We're sorry to see you go." : "Thank you for your purchase!"}
      </div>
    </div>
  </body>
</html>`;
}
