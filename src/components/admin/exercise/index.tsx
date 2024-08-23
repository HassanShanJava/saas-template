import { Card } from "@/components/ui/card";
import ExerciseTableView from "./component/exerciseTable/table";
export default function Exercise() {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <ExerciseTableView />
      </Card>
    </div>
  );
}
