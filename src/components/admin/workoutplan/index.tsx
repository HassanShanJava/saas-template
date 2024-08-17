import { Card } from "@/components/ui/card";
import WorkoutPlansTableView from "./workoutplanTable/table";
import { Outlet } from "react-router-dom";
const WorkoutPlan = () => {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <WorkoutPlansTableView />
		<Outlet/>
      </Card>
    </div>
  );
};

export default WorkoutPlan;
