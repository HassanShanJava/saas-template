import { Card } from "@/components/ui/card";
import StaffTableView from "./component/table";
import useDocumentTitle from "@/hooks/use-document-title";

export default function StaffManagement() {
  useDocumentTitle("Staff");

  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <StaffTableView />
      </Card>
    </div>
  );
}
