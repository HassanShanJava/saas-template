import { Card } from "@/components/ui/card";
import WorkoutPlansTableView from "./workoutplanTable/table";
const WorkoutPlan = () => {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <WorkoutPlansTableView />
      </Card>
    </div>
  );
};

export default WorkoutPlan;
