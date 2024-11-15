import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { displayValue } from "@/utils/helper";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { SearchCriteriaType } from "@/app/types";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/ui/table/pagination-table";
import { useParams } from "react-router-dom";
import { useGetLinkedMembersQuery } from "@/services/invoiceApi";
import { MemberTableDatatypes } from "@/app/types/member";
import { LinkedMembersInvoiceItem } from "@/app/types/pos/invoice";
import { status } from "@/constants/global";
import { Badge } from "@/components/ui/badge";
type BusinessDetailProps = {
  memberInfo: MemberTableDatatypes | undefined;
};

const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};
const LinkedMembersTable = ({ memberInfo }: BusinessDetailProps) => {
  // invoice table for linked members
  const { memberId } = useParams()
  const [searchCriteria, setSearchCriteria] =
    useState<SearchCriteriaType>(initialValue);
  const [query, setQuery] = useState("");

  const { data: linkedMembers, isLoading } = useGetLinkedMembersQuery({ id: Number(memberId), query: query }, {
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

  const linkedMembersTableData = useMemo(() => {
    return Array.isArray(linkedMembers?.data) ? linkedMembers?.data : [];
  }, [linkedMembers]);


  console.log({ linkedMembers, linkedMembersTableData })
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

  const columns: ColumnDef<LinkedMembersInvoiceItem>[] = [
    {
      accessorKey: "member_name",
      meta: "member_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Member Name"
          sortKey="key"
          toggleSortOrder={() => toggleSortOrder("name")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center gap-4 text-ellipsis whitespace-nowrap overflow-hidden">
            {displayValue(row?.original?.member_name)}
          </div>
        );
      },
    },
    {
      accessorKey: "membership_plan_name",
      meta: "Membership Plan Name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Membership Plan Name"
          sortKey="key"
          toggleSortOrder={() => toggleSortOrder("plan_name")}
        />
      ),
      cell: ({ row }) => {
        return (
          <Badge className="text-yellow-600 bg-yellow-100 font-normal capitalize">
            {displayValue(row?.original?.membership_plan_name)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "Status",
      meta: "Status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          sortKey="key"
          className="text-nowrap"
          toggleSortOrder={() => toggleSortOrder("plan_status")}
        />
      ),
      cell: ({ row }) => {
        const statusLabel = status.find((r) => r.value === row?.original?.membership_plan_status);

        return (
          <span className="flex gap-2 items-center">
            <span
              className={`${statusLabel?.color} rounded-[50%] size-2`}
            ></span>
            <span>{statusLabel?.label}</span>
          </span>
        );
      },
    },

  ];

  const totalRecords = linkedMembers?.filtered_counts || 0;
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
        <DataTable columns={columns} data={linkedMembersTableData} isLoading={isLoading} />
      </div>
      {/* pagination */}
      {linkedMembersTableData.length > 0 && (
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
