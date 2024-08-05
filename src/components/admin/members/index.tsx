import { Card } from "@/components/ui/card";
import MemberTableView from "./component/memberTable/table";

export default function MemberPage() {
  return (
      <div className="w-full p-5">
         <Card className="py-3">
          <MemberTableView/>
         </Card>
      </div>
  );
}
