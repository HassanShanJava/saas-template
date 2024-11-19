import { Card } from "@/components/ui/card";
import RoleTableView from "./component/roletable/table";
import useDocumentTitle from "@/components/ui/common/document-title";

const RolesAndAccess = () => {
  useDocumentTitle("Role & Access Management");
  
  return (
    <div className="w-full p-5">
      <Card>
        <RoleTableView />
      </Card>
    </div>
  );
};

export default RolesAndAccess;
