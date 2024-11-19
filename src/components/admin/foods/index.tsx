import { Card } from "@/components/ui/card";
import FoodsTableView from "./components/foodsTable/table";
import DocumentTitle from "@/components/ui/common/document-title";

const FoodsNutrition = () => {
  DocumentTitle("Food & Nutritions");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <FoodsTableView />
      </Card>
    </div>
  );
};

export default FoodsNutrition;
