import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InvoiceTableForMember from "./invoice-table";
const MemberInvoice = () => {
  return (
    <div>
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger variant={"primary"} value="invoice">
            Invoices
          </TabsTrigger>
          <TabsTrigger variant={"primary"} value="linked-members">
            Linked Members
          </TabsTrigger>
        </TabsList>
        <Separator className="mt-3 w-full" />
        <TabsContent className="w-full" value="invoice">
          <InvoiceTableForMember />
        </TabsContent>
        <TabsContent value="linked-members">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberInvoice;
