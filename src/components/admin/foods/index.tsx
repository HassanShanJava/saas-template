import { Card } from "@/components/ui/card";
import FoodsTableView from "./components/foodsTable/table";

const FoodsNutrition = () => {
  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <FoodsTableView />
      </Card>
    </div>
  );
};

export default FoodsNutrition;
