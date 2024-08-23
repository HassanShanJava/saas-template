import { Card } from "@/components/ui/card";
import FacilitiesTableView from "./component/facilitiesTable/table";

const Facilities = () => {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <FacilitiesTableView />
      </Card>
    </div>
  );
};

export default Facilities;
