import { Card } from "@/components/ui/card";
import CoachTableView from "./component/coachTable/table";
import DocumentTitle from "@/components/ui/common/document-title";
export default function Coach() {
  DocumentTitle("Coaches");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CoachTableView />
      </Card>
    </div>
  );
}
