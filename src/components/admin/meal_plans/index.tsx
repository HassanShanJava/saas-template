import { Card } from "@/components/ui/card";
import MealPlansTableView from "./components/mealplansTable/table";

const MealPlans = () => {
  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <MealPlansTableView />
      </Card>
    </div>
  );
};

export default MealPlans;
