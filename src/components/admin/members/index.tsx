import { Card } from "@/components/ui/card";
import MemberTableView from "./component/memberTable/table";
import DocumentTitle from "@/components/ui/common/document-title";

export default function MemberPage() {
  DocumentTitle("Members");
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <MemberTableView />
      </Card>
    </div>
  );
}
