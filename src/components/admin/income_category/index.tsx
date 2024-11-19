import { Card } from "@/components/ui/card";
import IncomeCategoryTableView from "./component/incomeCategoryTable/table";
import useDocumentTitle from "@/components/ui/common/document-title";

const SaleTaxes = () => {
  useDocumentTitle("Income Categories");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <IncomeCategoryTableView />
      </Card>
    </div>
  );
};

export default SaleTaxes;
