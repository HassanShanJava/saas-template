import { useState, useEffect } from "react";
import { columns } from "./component/table/columns"; 
import { DataTable } from "./component/table/data-table"; 
import { Shell } from "@/components/ui/shell/shell";
import { taskSchema } from "@/schema/taskSchema";
import { z } from "zod";
import tasksData from "../../../mock/data.json"; // Adjust the path if your tasks.json file is in a different directory
import { Card } from "@/components/ui/card";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetAllClientQuery } from "@/services/clientAPi";



export default function TaskPage() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.org_id) || 0;

  const { data:clientdata, isLoading, isError } = useGetAllClientQuery(orgId);
  const [tasks, setTasks] = useState<any>([]);
  const [error, setError] = useState<any>(null);
console.log(clientdata)

  useEffect(() => {
    try {
      const parsedTasks = (clientdata);
      setTasks(parsedTasks);
    } catch (err) {
      setError(err);
      console.error("Failed to parse tasks", err);
    }
  }, []);



  return (
   
      <div className="w-full p-12">
         <Card className="py-3">
        <DataTable columns={columns} data={tasks} />
         </Card>
      </div>
   
  );
}
