import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { ColumnDef } from "@tanstack/react-table";
import { displayValue, displayDate, formatToPKR } from "@/utils/helper";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Transaction, TransactionData } from "@/app/types/pos/transactions";
type MemberInvoiceProps = {
  memberInvoiceInfo: TransactionData | undefined
}
const InvoiceTableForMember = ({ memberInvoiceInfo }: MemberInvoiceProps) => {
  const member = (() => {
    try {
      return JSON.parse(localStorage.getItem("accessLevels") as string).member ?? "no_access";
    } catch {
      return "no_access";
    }
  })();
  
  
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

    const memberInvoiceInfoTableData=useMemo(() => {
      return Array.isArray(memberInvoiceInfo?.data) ? memberInvoiceInfo.data : [];
    }, [memberInvoiceInfo]);

  const actionsColumn: ColumnDef<Transaction> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      // <DataTableRowActions
      //   access={member}
      //   row={row.original.id}
      //   data={row?.original}
      //   refetch={refetch}
      //   handleEditMember={handleEditForm}
      // />
      <></>
    ),
  };
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      meta: "transaction date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          sortKey="key"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayDate(row?.original.transaction_date)}
          </div>
        );
      },
    },
    {
      accessorKey: "reciept_no",
      meta: "reciept No",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Reciept No"
          sortKey="key"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.receipt_number)}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      meta: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Quantity"
          sortKey="key"
          className="text-nowrap"
          toggleSortOrder={() => console.log("12")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original.total_quantity)}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      meta: "price",
      header: () => (
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Price</p>
          <button
            className=" size-5 text-gray-400 p-0 flex items-center justify-center"
          // onClick={() => toggleSortOrder("activated_on")}
          >
           
            {/* {searchCriteria.sort_order == "desc" ? "rotate-180" : "-rotate-180"} */}
            <i
              className={`fa fa-sort transition-all ease-in-out duration-200 `}
            ></i>
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {formatToPKR(row?.original.total_amount)}
          </div>
        );
      },
    },
    

    ...(member !== "read" ? [actionsColumn] : []),
  ];

  
  return <DataTable columns={columns} data={memberInvoiceInfoTableData} isLoading={false} />;
};

export default InvoiceTableForMember;
