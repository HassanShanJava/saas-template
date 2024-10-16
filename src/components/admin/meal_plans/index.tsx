import { Card } from "@/components/ui/card";
import MealPlansTableView from "./components/mealplansTable/table";

const MealPlans = () => {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <MealPlansTableView />
      </Card>
    </div>
  );
};

export default MealPlans;
