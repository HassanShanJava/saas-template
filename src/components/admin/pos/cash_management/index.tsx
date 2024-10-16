import { Card } from "@/components/ui/card";
import CashregisterViewTable from "./components/table";

const CashManagement = () => {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CashregisterViewTable />
      </Card>
    </div>
  );
};

export default CashManagement;
