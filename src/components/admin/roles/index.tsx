import { Card } from "@/components/ui/card";
import RoleTableView from "./component/table";
import useDocumentTitle from "@/hooks/use-document-title";

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
