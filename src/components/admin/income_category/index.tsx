import { Card } from "@/components/ui/card";
import IncomeCategoryTableView from "./component/incomeCategoryTable/table";

const SaleTaxes = () => {
  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <IncomeCategoryTableView />
      </Card>
    </div>
  );
};

export default SaleTaxes;
