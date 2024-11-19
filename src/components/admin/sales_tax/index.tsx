import { Card } from "@/components/ui/card";
import React from "react";
import SaleTaxesTableView from "./component/saleTaxesTable/table";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import useDocumentTitle from "@/components/ui/common/document-title";


const SaleTaxes = () => {
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  useDocumentTitle("Sale Taxes");
  
  return (
    <div className="w-full p-5">
      <Card className="pt-4">
        <SaleTaxesTableView />
      </Card>
    </div>
  );
};

export default SaleTaxes;
