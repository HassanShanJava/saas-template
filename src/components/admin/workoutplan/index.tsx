import { Card } from "@/components/ui/card";
import WorkoutPlansTableView from "./workoutplanTable/table";
import { Outlet } from "react-router-dom";
import DocumentTitle from "@/components/ui/common/document-title";
const WorkoutPlan = () => {
  DocumentTitle("Workout Plan");

  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <WorkoutPlansTableView />
				<Outlet/>
      </Card>
    </div>
  );
};

export default WorkoutPlan;