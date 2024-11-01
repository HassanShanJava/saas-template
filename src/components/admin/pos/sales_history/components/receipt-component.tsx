import {
  lineItems,
  salesReportInterface,
  sellForm,
  statusEnum,
  statusEnumGrid,
} from "@/app/types";
import React, { ReactNode } from "react";

interface ReceiptProps {
  salesReport: salesReportInterface;
}
import { capitalizeFirstLetter, displayDate, displayValue, formatToPKR } from "@/utils/helper";

const Receipt: React.FC<ReceiptProps> = ({ salesReport }) => {
  const isRefund = salesReport.transaction_type === statusEnumGrid.Refund;

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">
        {isRefund ? "Refund Receipt" : "Sale Receipt"}
      </h2>
      <div className="flex flex-col  gap-2  justify-center items-center">
        <p>Receipt Number: {salesReport.receipt_number}</p>
        <p>Transaction Date: {salesReport?.transaction_date as ReactNode}</p>
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

export function ReceiptExport(salesReport: salesReportInterface | sellForm) {
  const { user } = JSON.parse(localStorage.getItem("userInfo") as string);

  return user && salesReport && `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
        }

        .container {
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }

        .header p {
            margin: 4px 0;
            color: #555;
        }

        .details {
            margin-bottom: 20px;
            color: #333;
        }

        .details p {
            margin: 4px 0;
            font-size: 14px;
        }

        .details span {
            font-weight: bold;
        }

        .price {
            text-align: right !important;
        }



        .table-container {
            width: 100%;
            border-collapse: collapse;
        }

        .table-container th,
        .table-container td {
            border-bottom: 1px dashed #000;
            padding: 5px 0px;
            text-align: left;
        }

        .table-container th {
            font-weight: bold;
            color: #333;
            padding: 5px 0px;
        }



        .summary {
            color: #333;
        }

        .summary p {
            margin: 4px 0;
            font-size: 14px;
        }

        .summary span {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h2>${user?.org_name}</h2>
        </div>

        <!-- Receipt Details -->
        <div class="details">
            <p><span>SRB Invoice No:</span> ${salesReport.tax_number}</p>
            <p><span>Transaction ID:</span> ${salesReport.receipt_number}</p>
            <p><span>Date:</span> ${displayDate(salesReport.transaction_date)}</p>
            <p><span>Name:</span> <span style="font-weight:normal; text-transform:uppercase;">${salesReport.member_name}</span></p>
            <p><span>Status:</span> <span style="text-transform:uppercase;">${salesReport.status}</span></p>
        </div>

        <!-- Invoice Table -->
        <table class="table-container">
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="price">Price</th>
            </tr>
            
            ${salesReport?.items?.map((item) => item
              ? `<tr>
                  <td style="text-transform: capitalize;">${item.description}</td>
                  <td>${item.quantity}</td>
                  <td class="price">${formatToPKR(item.sub_total)}</td>
              </tr>`
              : ''
          ).join('')}
        </table>

        <!-- Summary Section -->
        <table class="table-container">
            <tr>
                <td class="price">Sub Total:</td>
                <td class="price">${formatToPKR(salesReport.subtotal as number)}</td>
            </tr>
            <tr>
                <td class="price">Discount:</td>
                <td class="price">${formatToPKR(salesReport.discount_amt as number)}</td>
            </tr>
            <tr>
                <td class="price">Sindh Sales Tax:</td>
                <td class="price">${formatToPKR(salesReport.tax_amt as number)}</td>
            </tr>
            <tr>
                <td class="price">Grand Total:</td>
                <td class="price">${formatToPKR(salesReport.total as number)}</td>
            </tr>
            ${salesReport?.payments?.map((payment, i) => payment.payment_method
                ? `<tr>  
                    <td class="price" style="${i == salesReport?.payments?.length as number - 1 ? "border:none;" : ""} text-transform:capitalize">
                        ${payment.payment_method}
                    </td>
                    <td class="price" style="${i == salesReport?.payments?.length as number - 1 ? "border:none;" : ""}">
                        ${formatToPKR(payment.amount as number)}
                    </td>
                </tr>`
                : ''
            ).join('')}
        </table>
    </div>
</body>

</html>`;
}
