import { Card } from "@/components/ui/card";
import CoachTableView from "./components/coachTable/table";
export default function Coach() {
  return (
    <div className="w-full p-12">
      <Card className="py-3">
        <CoachTableView />
      </Card>
    </div>
  );
}
