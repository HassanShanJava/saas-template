import { Card } from "@/components/ui/card";
import CashregisterViewTable from "./components/table";

const CashManagement = () => {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <CashregisterViewTable />
      </Card>
    </div>
  );
};

export default CashManagement;
