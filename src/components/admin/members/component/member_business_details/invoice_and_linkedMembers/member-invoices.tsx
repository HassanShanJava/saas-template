import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InvoiceTableForMember from "./invoice-table";
import { useParams } from "react-router-dom";
import { useGetTransactionByMemberIdQuery } from "@/services/transactionApi";

const MemberInvoice = () => {
  const { memberId } = useParams()
  const { data: memberInvoiceInfo } = useGetTransactionByMemberIdQuery(Number(memberId), {
    skip: !memberId
  })
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
        <Separator className="mt-3 w-full" />

        <TabsContent className="w-full" value="invoice">
          <InvoiceTableForMember memberInvoiceInfo={memberInvoiceInfo}/>
        </TabsContent>
        <TabsContent value="linked-members">

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberInvoice;
