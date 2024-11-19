import { Card } from "@/components/ui/card";
import CoachTableView from "./component/coachTable/table";
import useDocumentTitle from "@/components/ui/common/document-title";
export default function Coach() {
  useDocumentTitle("Coaches");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CoachTableView />
      </Card>
    </div>
  );
}
