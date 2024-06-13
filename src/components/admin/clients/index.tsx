import React, { useState, useEffect } from "react";
import { columns } from "@/components/ui/data-table/columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Shell } from "@/components/ui/shell/shell";
import { taskSchema } from "@/schema/taskSchema";
import { z } from "zod";
import { DataTableLoading } from "@/components/ui/data-table/data-table-skeleton";

async function getTasks() {
  const res = await fetch(
    "https://my.api.mockaroo.com/tasks.json?key=f0933e60"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  // ** Workaround as my mock api has date returned as "dd-Mon-yyyy"
  const tasks = z.array(taskSchema).parse(
    data.map((task:any) => {
      task.due_date = new Date(Date.parse(task.due_date));
      return task;
    })
  );
  return tasks;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Shell>
        <div className="flex h-full min-h-screen w-full flex-col">
          <DataTableLoading columnCount={columns.length} />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <div className="flex h-full min-h-screen w-full flex-col">
          <p>Error: {error}</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell className="overflow-scroll">
      <div className="flex h-full max-h-screen w-full flex-col border-2 border-cyan-300 overflow-hidden" >
        <DataTable data={tasks} columns={columns} />
      </div>
    </Shell>
  );
}
