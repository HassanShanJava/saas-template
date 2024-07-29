import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Breadcrumb = ({ currentPath, targetPath, title }:{ currentPath:string, targetPath:string, title:string }) => {
  if (!isActiveLink(currentPath, targetPath)) return null;
  return (
    <div className="pl-7 pb-4 text-sm">
      <span className="text-primary pr-1 font-semibold">System Settings</span>{" "}
      <span className="text-gray-400 font-semibold">/</span>
      <span className="pl-1 text-gray-400 font-semibold ">{title}</span>
    </div>
  );
};

const PageTitle = ({ currentPath, targetPath, title }:{ currentPath:string, targetPath:string, title:string }) => {
  if (!isActiveLink(currentPath, targetPath)) return null;
  return <>{title}</>;
};

const isActiveLink = (currentPath:string, targetPath:string) => currentPath === targetPath;

export const Header = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      variant: "destructive",
      title: "Logout",
      description: "You are Successfully Logged Out",
    });
    navigate("/");
  };

  return (
    <header className="font-poppins sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-1 shadow-sm">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex flex-row h-full justify-between items-center gap-4">
          <div className="w-full">
            <h1 className="text-2xl pt-2 font-bold pl-7">
              <PageTitle currentPath={location.pathname} targetPath="/admin/dashboard" title="Dashboard" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/members" title="Members" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/members/addmember" title="Add Member" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/credits" title="System Settings" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/saleTaxes" title="System Settings" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/incomeCategory" title="System Settings" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/memberships" title="System Settings" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/roles" title="Roles and Access Management" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/leads" title="Leads" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/leads/addlead" title="Leads" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/events" title="Events" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/events/addevents" title="Events" />
              <PageTitle currentPath={location.pathname} targetPath="/admin/exercise/addexercise" title="Exercise" />
            </h1>

            <Breadcrumb currentPath={location.pathname} targetPath="/admin/members/addmember" title="Add Member" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/leads/addlead" title="Lead data" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/events/addevents" title="Add Event" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/credits" title="Credits" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/incomeCategory" title="Income Categories" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/saleTaxes" title="Sales Tax" />
            <Breadcrumb currentPath={location.pathname} targetPath="/admin/memberships" title="Memberships" />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-3">
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-row justify-center items-center gap-4">
            <div className="w-8 h-8 border-[1px] border-gray-400 rounded-full justify-center flex items-center">
              <i className="fa-regular fa-envelope"></i>
            </div>
            <div className="w-8 h-8 border-[1px] border-gray-400 rounded-full justify-center flex items-center">
              <i className="fa-regular fa-bell"></i>
            </div>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="justify-center cursor-pointer items-center flex gap-3">
                <img src="/userSvg.svg" width="32" height="32" className="rounded-full" alt="Avatar" />
                <h1 className="text-base">{userInfo?.user?.first_name}</h1>
                <Button variant="ghost" size="icon" className="rounded-full w-2 px-2.5">
                  <i className="fa-solid fa-caret-down "></i>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
