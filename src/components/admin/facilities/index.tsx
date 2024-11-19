import { Card } from "@/components/ui/card";
import FacilitiesTableView from "./component/facilitiesTable/table";
import DocumentTitle from "@/components/ui/common/document-title";

const Facilities = () => {
  DocumentTitle("Facilities");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <FacilitiesTableView />
      </Card>
    </div>
  );
};

export default Facilities;
