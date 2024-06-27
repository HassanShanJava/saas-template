import React, { useState, useEffect } from "react";
import { columns } from "@/components/ui/data-table/columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Shell } from "@/components/ui/shell/shell";
import { taskSchema } from "@/schema/taskSchema";
import { z } from "zod";
import tasksData from "../../../mock/data.json"; // Adjust the path if your tasks.json file is in a different directory
// import ImageUpload from "./clientForm/checkForm";
import UploadForm from "./clientForm/checkForm";
import { Card } from "@/components/ui/card";
// import { DataGrid } from "@mui/x-data-grid";
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

  return (
    // <UploadForm />
    <Shell>
      <Card className="p-4">
        <DataTable columns={columns} data={tasks} />
      </Card>
    </Shell>
  );
}
