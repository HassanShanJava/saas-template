import React, { useState, useEffect } from "react";
import { Shell } from "@/components/ui/shell/shell";
import { DataTable } from "./component/data-table";
// import tasksData from "./component/leads.json";
import { columns } from "./component/columns";
import { LeadType } from "./component/columns";
import { useGetAllStaffQuery, useGetLeadsQuery } from "@/services/leadsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useDebounce } from "@/hooks/use-debounce";

// Example function to update the row data, you need to implement this function
// const updateMyData = (
//   rowIndex: number,
//   columnId: keyof LeadType,
//   value: any,
// ) => {

// };

const Lead: React.FC = () => {
  const [data, setData] = useState<LeadType[]>([]);
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.org_id) || 0;

  const { data: leadsData, isLoading } = useGetLeadsQuery(orgId);
  const { data: staffData } = useGetAllStaffQuery(orgId);

  useEffect(() => {
    const parseddata = leadsData?.map((item) => {
      return {
        ...item,
        staffData,
      };
    });
    setData(parseddata);
  }, [staffData, leadsData]);

  console.log({data})
  return (
    <Shell>
      <DataTable columns={columns} data={data} />
    </Shell>
  );
};

export default Lead;
