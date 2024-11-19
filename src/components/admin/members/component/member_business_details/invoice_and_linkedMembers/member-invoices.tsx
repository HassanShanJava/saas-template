import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InvoiceTableForMember from "./invoice-table";
import { MemberTableDatatypes } from "@/app/types/member";
import LinkedMembersTable from "./linked-members-table";
type BusinessDetailProps = {
  memberInfo: MemberTableDatatypes | undefined;
};

const MemberInvoice = ({ memberInfo }: BusinessDetailProps) => {

  return (
    <div>
      <Tabs defaultValue="invoice" className="w-full">
        {memberInfo?.is_business &&
          <>
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger variant={"primary"} value="invoice">
                Invoices
              </TabsTrigger>
              <TabsTrigger variant={"primary"} value="linked-members">
                Linked Members
              </TabsTrigger>
            </TabsList>
            <Separator className="my-3 w-full" />
          </>
        }
        <TabsContent className="w-full " value="invoice">
          <InvoiceTableForMember memberInfo={memberInfo} />
        </TabsContent>

        <TabsContent value="linked-members">
          <LinkedMembersTable memberInfo={memberInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberInvoice;
