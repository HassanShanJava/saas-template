import { Card } from "@/components/ui/card";
import SaleshistoryRegisterViewTable from "./components/table";

const CashManagement = () => {
  return (
    <div className="w-full p-5">
      <Card className="py-3">
        <SaleshistoryRegisterViewTable />
      </Card>
    </div>
  );
};

export default CashManagement;
