import { Card } from "@/components/ui/card";
import SaleshistoryRegisterViewTable from "./components/table";
import useDocumentTitle from "@/components/ui/common/document-title";

const CashManagement = () => {
  useDocumentTitle("Sale Report");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <SaleshistoryRegisterViewTable />
      </Card>
    </div>
  );
};

export default CashManagement;
