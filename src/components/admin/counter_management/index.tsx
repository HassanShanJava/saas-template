import { Card } from "@/components/ui/card";
import CounterTableView from "./components/counterTable/table"
import useDocumentTitle from "@/components/ui/common/document-title";

const CounterManagement = () => {
  useDocumentTitle("Counter Management");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <CounterTableView />
      </Card>
    </div>
  );
};

export default CounterManagement;
