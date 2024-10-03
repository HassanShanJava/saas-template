import { Card } from "@/components/ui/card";
import StaffTableView from "./component/staffTable/table";

export default function MemberPage() {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <StaffTableView />
      </Card>
    </div>
  );
}
