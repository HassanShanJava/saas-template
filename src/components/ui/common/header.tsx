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

const Breadcrumb = ({ currentPath, targetPath, title, pageSetting }:{currentPath:string,targetPath:string, title:string, pageSetting:string}) => {
  if (!isActiveLink(currentPath, targetPath)) return null;

  return (
    <div className="pl-7 pb-4 text-sm">
      {pageSetting && <span className="text-gray-400 pr-1 font-semibold">{pageSetting}</span>}
      <span className="text-gray-400 font-semibold">/</span>
      <span className="pl-1 text-primary font-semibold">{title}</span>
    </div>
  );
};

// PageTitle component
const PageTitle = ({ currentPath, targetPath, title }:{currentPath:string,targetPath:string, title:string}) => {
  if (!isActiveLink(currentPath, targetPath)) return null;

  return <>{title}</>;
};

// Check if the current path matches the target path
const isActiveLink = (currentPath:string, targetPath:string) => currentPath === targetPath;

export const  Header = () => {
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

  // Path and title data
  const pageTitles = [
    { path: "/admin/dashboard", title: "Dashboard" },
    { path: "/admin/members", title: "Members" },
    { path: "/admin/members/addmember", title: "Add Member" },
    //eslint-disable-next-line
    { path: "/admin/members/editmember", title: "Edit Member", replace: /(\/[^\/]+\/editmember)\/\d+$/ },
    { path: "/admin/coach", title: "Coach" },
    { path: "/admin/coach/addcoach", title: "Add Coach" },
    //eslint-disable-next-line
    { path: "/admin/coach/editcoach", title: "Edit Coach", replace: /(\/[^\/]+\/editcoach)\/\d+$/ },
    { path: "/admin/credits", title: "System Settings" },
    { path: "/admin/saleTaxes", title: "System Settings" },
    { path: "/admin/incomeCategory", title: "System Settings" },
    { path: "/admin/memberships", title: "System Settings" },
    { path: "/admin/roles", title: "Roles and Access Management" },
    { path: "/admin/leads", title: "Leads" },
    { path: "/admin/leads/addlead", title: "Leads" },
    { path: "/admin/events", title: "Events" },
    { path: "/admin/events/addevents", title: "Events" },
    { path: "/admin/staff", title: "Staff" },
    { path: "/admin/staff/addstaff", title: "Add Staff" },
    { path: "/admin/mealplans", title: "Meal Plans" },

  ];

  const breadcrumbItems = [
    { path: "/admin/members/addmember", title: "Add Member", pageSetting: "Dashboard" },
    //eslint-disable-next-line
    { path: "/admin/members/editmember", title: "Edit Member", pageSetting: "Dashboard", replace: /(\/[^\/]+\/editmember)\/\d+$/ },
    //eslint-disable-next-line
    { path: "/admin/staff/editstaff", title: "Edit Staff", pageSetting: "Dashboard", replace: /(\/[^\/]+\/editstaff)\/\d+$/ },
    //eslint-disable-next-line
    { path: "/admin/coach/editcoach", title: "Edit Coach", pageSetting: "Dashboard", replace: /(\/[^\/]+\/editcoach)\/\d+$/ },
    //eslint-disable-next-line
    { path: "/admin/coach/addcoach", title: "Add Coach", pageSetting: "Dashboard", replace: /(\/[^\/]+\/addcoach)\/\d+$/ },
    { path: "/admin/staff/addstaff", title: "Add Staff", pageSetting: "Dashboard" },
    { path: "/admin/leads/addlead", title: "Lead data" },
    { path: "/admin/events/addevents", title: "Add Event" },
    { path: "/admin/credits", title: "Credits", pageSetting: "System Setting" },
    { path: "/admin/incomeCategory", title: "Income Categories", pageSetting: "System Setting" },
    { path: "/admin/saleTaxes", title: "Sales Tax", pageSetting: "System Setting" },
    { path: "/admin/memberships", title: "Memberships", pageSetting: "System Setting" },
  ];

  // Helper function to handle path replacement
  const replacePath = (path:string, replace:RegExp| undefined) => replace ? location.pathname.replace(replace, '$1') : location.pathname;

  return (
    <header className="font-poppins sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-1 shadow-sm">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex flex-row h-full justify-between items-center gap-4 w-full">
          <div className="w-full">
            <h1 className="text-2xl pt-2 font-bold pl-7">
              {pageTitles.map(({ path, title, replace }) => (
                <PageTitle
                  key={path}
                  currentPath={replacePath(path, replace)}
                  targetPath={path}
                  title={title}
                />
              ))}
            </h1>

            {breadcrumbItems.map(({ path, title, pageSetting, replace }) => (
              <Breadcrumb
                key={path}
                currentPath={replacePath(path, replace)}
                targetPath={path}
                title={title}
                pageSetting={pageSetting as string}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-3">
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-row justify-center items-center gap-4">
            <div className="w-8 h-8 border-[1px] border-gray-400 rounded-full flex items-center justify-center">
              <i className="fa-regular fa-envelope"></i>
            </div>
            <div className="w-8 h-8 border-[1px] border-gray-400 rounded-full flex items-center justify-center">
              <i className="fa-regular fa-bell"></i>
            </div>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src="/userSvg.svg"
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt="Avatar"
                />
                <h1 className="text-base">{userInfo?.user?.first_name}</h1>
                <Button variant="ghost" size="icon" className="rounded-full w-2 px-2.5">
                  <i className="fa-solid fa-caret-down"></i>
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



