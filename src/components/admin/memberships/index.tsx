import { Card } from "@/components/ui/card";
import MembershipsTableView from "./component/membershipsTable/table";

const Memberships = () => {
  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <MembershipsTableView />
      </Card>
    </div>
  );
};

export default Memberships;
