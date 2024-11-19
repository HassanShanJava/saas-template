import { Card } from "@/components/ui/card";
import MembershipsTableView from "./component/membershipsTable/table";
import DocumentTitle from "@/components/ui/common/document-title";

const Memberships = () => {
  DocumentTitle("Membership");

  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <MembershipsTableView />
      </Card>
    </div>
  );
};

export default Memberships;
