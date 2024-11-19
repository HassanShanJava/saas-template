import { Card } from "@/components/ui/card";
import ExerciseTableView from "./component/exerciseTable/table";
import useDocumentTitle from "@/components/ui/common/document-title";
export default function Exercise() {
  useDocumentTitle("Exercise");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <ExerciseTableView />
      </Card>
    </div>
  );
}
