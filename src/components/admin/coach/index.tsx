import { Card } from "@/components/ui/card";
import CoachTableView from "./component/coachTable/table";
export default function Coach() {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CoachTableView />
      </Card>
    </div>
  );
}
