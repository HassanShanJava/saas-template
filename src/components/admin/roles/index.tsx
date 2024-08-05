import { Card } from "@/components/ui/card";
import RoleTableView from "./component/roletable/table";

const RolesAndAccess = () => {
  return (
    <div className="w-full p-5">
      <Card>
        <RoleTableView />
      </Card>
    </div>
  );
};

export default RolesAndAccess;
