import { Card } from "@/components/ui/card";
import HardwareIntegrationTable from "./components/hardware_integration_table/table";
export default function HardwareIntegration() {
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <HardwareIntegrationTable />
      </Card>
    </div>
  );
}
