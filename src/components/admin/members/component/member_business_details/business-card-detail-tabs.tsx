import { Mail, Phone, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MobileIcon } from "@radix-ui/react-icons";
import MemberInvoice from "./invoice_and_linkedMembers/member-invoices";
import { MemberTableDatatypes } from "@/app/types/member";

type BusinessDetailProps = {
  memberInfo: MemberTableDatatypes | undefined;
};

export default function BusinessDetailTabs({memberInfo}:BusinessDetailProps) {
  const tabs = [
    { value: "member-data", label: "Member Data" },
    { value: "invoices", label: `Invoices ${memberInfo?.business_id!==null || memberInfo?.is_business?"& Linked Members":""}` },
    { value: "coaching", label: "Coaching" },
    { value: "fitness", label: "Fitness Data & Progress" },
    { value: "membership", label: "Membership Plan & Facilities" }
  ];

  return (
    <Card className=" w-[100%] sxl:w-[70%]  p-4">
      <Tabs defaultValue="member-data" className="w-full">
        <ScrollArea className="w-full">
          <ScrollBar orientation="horizontal" className="h-2 cursor-grabbing" />
          <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-auto pb-2 px-4 text-muted-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value="member-data" className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Member Data</h2>
            <button className="p-2 hover:bg-muted rounded-full border">
              <Pencil className="w-5 h-5" />
            </button>
          </div>

          <Card className="p-0">
            <CardContent className="py-5 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Member Id: 40475322
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Annette Black</div>
                      <div className="text-sm text-muted-foreground">
                        MCB Private Ltd
                      </div>
                      <div className="text-sm">Coach: John Doe</div>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <div className="w-full justify-end flex">
                        <Badge className="w-fit" variant="secondary">
                          Premium
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 w-fit text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-muted-foreground">
                          Gender: Male
                        </div>
                        <div className="text-muted-foreground">
                          Date of Birth: 28/Oct/2024
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>

                <div className="flex flex-col xlg:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Annetta@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">42201-7110037-9</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MobileIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">0323-2260460</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Address</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Street Address:</div>
                    <div className="text-sm text-muted-foreground">
                      House No.3223, Blk-1, Metrovill3, Abdul Hassan Isfahani
                      Rd. Gulshan-e-Iqbal.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                      <span className="font-medium">Zip Code:</span>{" "}
                      <span className="text-muted-foreground">773287</span>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <span className="font-medium">Country:</span>{" "}
                      <span className="text-muted-foreground">Pakistan</span>
                    </div>
                    <Separator orientation="vertical" />

                    <div>
                      <span className="font-medium">City:</span>{" "}
                      <span className="text-muted-foreground">Karachi</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Membership & Auto Renewal</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <div>
                      <span className="font-medium">Auto renewal:</span>{" "}
                      <span className="text-muted-foreground">Yes</span>
                    </div>
                    <Separator orientation="vertical" />

                    <div>
                      <span className="font-medium">Prolongation period:</span>{" "}
                      <span className="text-muted-foreground">1 Month</span>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <span className="font-medium">
                        Auto renewal takes place:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        2 days before contracts runs out.
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Next invoice:</span>{" "}
                    <span className="text-muted-foreground">
                      2 days before the start of the new billing cycle
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Notes</h3>
                <div className="text-sm text-muted-foreground">
                  Default Notes text
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="w-full mt-3">
          <MemberInvoice memberInfo={memberInfo}/>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
