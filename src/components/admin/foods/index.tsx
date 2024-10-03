import { Card } from "@/components/ui/card";
import FoodsTableView from "./components/foodsTable/table";

const FoodsNutrition = () => {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <FoodsTableView />
      </Card>
    </div>
  );
};

export default FoodsNutrition;
