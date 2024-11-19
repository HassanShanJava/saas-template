import { Card } from "@/components/ui/card";
import HardwareIntegrationTable from "./components/hardware_integration_table/table";
import useDocumentTitle from "@/components/ui/common/document-title";
export default function HardwareIntegration() {
  useDocumentTitle("Hardware Integration");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <HardwareIntegrationTable />
      </Card>
    </div>
  );
}
