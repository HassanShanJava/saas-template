import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { ColumnDef } from "@tanstack/react-table";
import { displayValue, displayDate, formatToPKR } from "@/utils/helper";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Transaction, TransactionData } from "@/app/types/pos/transactions";
import { DataTableRowActions } from "./data-table-row-actions";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchCriteriaType } from "@/app/types";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { useParams } from "react-router-dom";
import { useGetTransactionByMemberIdQuery } from "@/services/invoiceApi";
import LinkedMembers from "./linked-members";

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};
const LinkedMembersTable = () => {
  
  const { memberId } = useParams()



  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const [searchCriteria, setSearchCriteria] =
    useState<SearchCriteriaType>(initialValue);
  const [query, setQuery] = useState("");

  const { data: memberInvoiceInfo, isLoading } = useGetTransactionByMemberIdQuery({ id: Number(memberId), query: query }, {
    skip: !memberId
  })
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
      console.log({ key, value });
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    const newQuery = params.toString();
    console.log({ newQuery });
    setQuery(newQuery);
  }, [searchCriteria]);

  const memberInvoiceInfoTableData = useMemo(() => {
    return Array.isArray(memberInvoiceInfo?.data) ? memberInvoiceInfo.data : [];
  }, [memberInvoiceInfo]);


  const toggleSortOrder = (key: string) => {
    setSearchCriteria((prev) => {
      const newSortOrder =
        prev.sort_key === key
          ? prev.sort_order === "desc"
            ? "asc"
            : "desc"
          : "desc"; // Default to descending order

      return {
        ...prev,
        sort_key: key,
        sort_order: newSortOrder,
      };
    });
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
          toggleSortOrder={() => toggleSortOrder("transaction_date")}
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
      accessorKey: "receipt_number",
      meta: "Receipt No",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Receipt No"
          sortKey="key"
          toggleSortOrder={() => toggleSortOrder("receipt_number")}
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
          toggleSortOrder={() => toggleSortOrder("quantity")}
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

  ];

  const totalRecords = memberInvoiceInfo?.filtered_counts || 0;
  const {
    handleLimitChange,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    isLastPage,
  } = usePagination<SearchCriteriaType>({
    totalRecords,
    searchCriteria,
    setSearchCriteria,
  });


  return (
    <>
      {/* search bar */}
      <div className="m-2 ">
        <DataTable columns={columns} data={memberInvoiceInfoTableData} isLoading={isLoading} />
      </div>
      {/* pagination */}
      {memberInvoiceInfoTableData.length > 0 && (
        <Pagination
          limit={searchCriteria.limit}
          offset={searchCriteria.offset}
          totalItems={totalRecords}
          onLimitChange={handleLimitChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onFirstPage={handleFirstPage}
          onLastPage={handleLastPage}
          isLastPage={isLastPage}
        />
      )}

    </>
  );
};

export default LinkedMembersTable;
