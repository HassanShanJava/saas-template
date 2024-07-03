import React, { useState, useEffect } from "react";
import { columns } from "@/components/ui/data-table/columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Shell } from "@/components/ui/shell/shell";
import { taskSchema } from "@/schema/taskSchema";
import { z } from "zod";
import tasksData from "../../../mock/data.json"; // Adjust the path if your tasks.json file is in a different directory
// import ImageUpload from "./clientForm/checkForm";
import UploadForm from "../../pagework/checkForm";
import { Card } from "@/components/ui/card";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
const parseTasks = (data:any) => {
  return z.array(taskSchema).parse(
    data.map((task:any) => {
      task.due_date = new Date(Date.parse(task.due_date));
      return task;
    })
  );
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedTasks = parseTasks(tasksData);
      setTasks(parsedTasks);
    } catch (err) {
      setError(err);
      console.error("Failed to parse tasks", err);
    }
  }, []);

  if (error) {
    return (
      <Shell>
        <div>Error loading tasks: {error.message}</div>
      </Shell>
    );
  }
// const rows: GridRowsProp = [
//   { id: 1, col1: "Hello", col2: "World" },
//   { id: 2, col1: "DataGridPro", col2: "is Awesome" },
//   { id: 3, col1: "MUI", col2: "is Amazing" },
// ];

// const columns: GridColDef[] = [
//   { field: "col1", headerName: "Client Id", width: 150 },
//   { field: "col2", headerName: "Client Name", width: 150 },
//   { field: "col3", headerName: "Client Name", width: 150 },
//   { field: "col4", headerName: "Client Name", width: 150 },
//   { field: "col5", headerName: "Client Name", width: 150 },
//   { field: "col6", headerName: "Client Name", width: 150 },
//   { field: "col5", headerName: "Client Name", width: 150 },
// ];
  return (
    // <UploadForm />
    <div className="w-full p-12">
        <DataTable columns={columns} data={tasks} />
    </div>
  );
}
