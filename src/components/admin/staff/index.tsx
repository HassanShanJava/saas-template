import { Card } from "@/components/ui/card";
import StaffTableView from "./component/staffTable/table";
import useDocumentTitle from "@/components/ui/common/document-title";

export default function MemberPage() {
  useDocumentTitle("Staff");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <StaffTableView />
      </Card>
    </div>
  );
}
