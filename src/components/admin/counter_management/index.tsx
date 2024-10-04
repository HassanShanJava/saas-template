import { Card } from "@/components/ui/card";
import CounterTableView from "./components/counterTable/table"

const CounterManagement = () => {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CounterTableView />
      </Card>
    </div>
  );
};

export default CounterManagement;
