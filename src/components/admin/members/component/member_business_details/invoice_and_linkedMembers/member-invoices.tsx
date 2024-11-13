import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InvoiceTableForMember from "./invoice-table";
const MemberInvoice = () => {
  
  return (
    <div>
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger variant={"primary"} value="invoice">
            Invoices
          </TabsTrigger>
          <TabsTrigger variant={"primary"} value="linked-members">
            Linked Members
          </TabsTrigger>
        </TabsList>
        <Separator className="my-3 w-full" />

        <TabsContent className="w-full " value="invoice">
          <InvoiceTableForMember />
        </TabsContent>
        <TabsContent value="linked-members">

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberInvoice;
