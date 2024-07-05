import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useGetAllClientQuery } from "@/services/clientAPi";
import ClientTableView from "./component/clientTable/table";

export default function TaskPage() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

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
        <ClientTableView/>
         </Card>
      </div>
   
  );
}
