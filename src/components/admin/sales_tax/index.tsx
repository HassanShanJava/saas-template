import { Card } from "@/components/ui/card";
import React from "react";
import SaleTaxesTableView from "./component/saleTaxesTable/table";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";


const SaleTaxes = () => {
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <SaleTaxesTableView />
      </Card>
    </div>
  );
};

export default SaleTaxes;
