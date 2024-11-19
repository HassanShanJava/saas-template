import { Card } from "@/components/ui/card";
import CashregisterViewTable from "./components/table";
import DocumentTitle from "@/components/ui/common/document-title";

const CashManagement = () => {
  DocumentTitle("Cash Registry");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CashregisterViewTable />
      </Card>
    </div>
  );
};

export default CashManagement;
