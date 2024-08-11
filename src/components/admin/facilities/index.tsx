import { Card } from "@/components/ui/card";
import FacilitiesTableView from "./component/facilitiesTable/table";

const Facilities = () => {
  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <FacilitiesTableView />
      </Card>
    </div>
  );
};

export default Facilities;
