import { Card } from "@/components/ui/card";
import React from "react";
import CreditsTableView from "./component/creditTable/table";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";


const Credits = () => {
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  return (
    <div className="w-full py-12 px-8">
      <Card className="py-3">
        <CreditsTableView />
      </Card>
    </div>
  );
};

export default Credits;
