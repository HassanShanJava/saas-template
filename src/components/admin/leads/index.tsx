import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Shell } from "@/components/ui/shell/shell";
import { DataTable } from "./component/data-table"; 
import tasksData from "./component/leads.json"; // Adjust the path if your tasks.json file is in a different directory
import { columns } from "./component/columns"; // Adjust path based on your directory structure
import { LeadType } from "./component/columns";
// export interface LeadType {
//   name: string;
//   contact: string;
//   lead_owner: string;
//   source: string;
//   lead_since: string; // or Date if you store it as a Date object
//   status: "todo" | "complete" | "hold"; // or other status options
// }

// Example function to update the row data, you need to implement this function
const updateMyData = (
  rowIndex: number,
  columnId: keyof LeadType,
  value: any,
) => {

};

const Lead: React.FC = () => {
  const [data, setData] = useState<LeadType[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedData: LeadType[] = tasksData.map((task: any) => ({
        name: task.name,
        contact: task.contact,
        lead_owner: task.lead_owner,
        source: task.source,
        lead_since: task.lead_since, // Adjust if lead_since is stored as a string and needs parsing
        status: task.status as "todo" | "complete" | "hold", // Ensure status is correctly typed
      }));
      setData(parsedData);
    } catch (err) {
      setError(err);
      console.error("Failed to parse data", err);
    }
  }, []);

  if (error) {
    return (
      <Shell>
        <div>Error loading data: {error.message}</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <DataTable columns={columns} data={data} />
    </Shell>
  );
};

export default Lead;
