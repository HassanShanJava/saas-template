import { Card } from "@/components/ui/card";
import IncomeCategoryTableView from "./component/incomeCategoryTable/table";

const SaleTaxes = () => {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <IncomeCategoryTableView />
      </Card>
    </div>
  );
};

export default SaleTaxes;
