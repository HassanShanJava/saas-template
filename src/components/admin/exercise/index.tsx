import { Card } from "@/components/ui/card";
import ExerciseTableView from "./component/exerciseTable/table";
import DocumentTitle from "@/components/ui/common/document-title";
export default function Exercise() {
  DocumentTitle("Exercise");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <ExerciseTableView />
      </Card>
    </div>
  );
}
