import { Card } from "@/components/ui/card";
import MemberTableView from "./component/memberTable/table";
import useDocumentTitle from "@/components/ui/common/document-title";

export default function MemberPage() {
  useDocumentTitle("Members");
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <MemberTableView />
      </Card>
    </div>
  );
}
