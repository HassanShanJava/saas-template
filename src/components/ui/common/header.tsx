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
import userimg from "@/assets/userSvg.svg";
const Breadcrumb = ({
  currentPath,
  targetPath,
  title,
  pageSetting,
}: {
  currentPath: string;
  targetPath: string;
  title: string;
  pageSetting?: string;
}) => {
  if (!isActiveLink(currentPath, targetPath)) return null;
  return (
    <div className="pl-7 pb-4 text-sm">
      <span className="text-gray-400 pr-1 font-semibold text-sm">
        {pageSetting}
      </span>{" "}
      <span className="text-gray-400 font-semibold">/</span>
      <span className="pl-1 text-primary font-semibold text-sm ">{title}</span>
    </div>
  );
};

const PageTitle = ({
  currentPath,
  targetPath,
  title,
}: {
  currentPath: string;
  targetPath: string;
  title: string;
}) => {
  if (!isActiveLink(currentPath, targetPath)) return null;
  return <p className="text-lg">{title}</p>;
};

const isActiveLink = (currentPath: string, targetPath: string) =>
  currentPath === targetPath;

export const Header = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      variant: "success",
      title: "Logout",
      description: "You are Successfully Logged Out",
    });
    navigate("/");
  };

  return (
    <header className="font-poppins sticky top-0 z-30  0 flex h-16 items-center justify-between border-b bg-white px-1 shadow-sm">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex flex-row h-full justify-between items-center gap-4">
          <div className="w-full">
            <h1 className="text-2xl pt-2 font-bold pl-7">
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/dashboard"
                title="Dashboard"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/members"
                title="Members"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/members/addmember"
                title="Add Member"
              />
              <PageTitle
                currentPath={location.pathname.replace(
                  //eslint-disable-next-line
                  /(\/[^\/]+\/editmember)\/\d+$/,
                  "$1"
                )}
                targetPath="/admin/members/editmember"
                title="Edit Member"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/coach"
                title="Coach"
              />

              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/exercise"
                title="Exercise"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/coach/addcoach"
                title="Add Coach"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/workoutplans"
                title="Workout Plans"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/pos/register"
                title="Open/Close Register"
              />
              {/* <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/exercise"
                title="Exercises"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/exercise/addexercise"
                title="Add Exercise"
              /> */}
              <PageTitle
                currentPath={location.pathname.replace(
                  //eslint-disable-next-line
                  /(\/[^\/]+\/editcoach)\/\d+$/,
                  "$1"
                )}
                targetPath="/admin/coach/editcoach"
                title="Edit Coach"
              />

              <PageTitle
                currentPath={location.pathname.replace(
                  //eslint-disable-next-line
                  /(\/[^\/]+\/editstaff)\/\d+$/,
                  "$1"
                )}
                targetPath="/admin/staff/editstaff"
                title="Edit Staff"
              />

              {/* <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/leads"
                title="Leads"
              /> */}
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/facilities"
                title="System Settings"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/saleTaxes"
                title="System Settings"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/incomeCategory"
                title="System Settings"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/memberships"
                title="System Settings"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/roles"
                title="Roles & Access Management"
              />
              {/* <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/leads"
                title="Leads"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/leads/addlead"
                title="Leads"
              /> */}
              {/* <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/events"
                title="Events"
              />
              <PageTitle
                  currentPath={location.pathname}
                targetPath="/admin/events/addevents"
                title="Events"
              /> */}

              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/staff"
                title="Staff"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/staff/addstaff"
                title="Add Staff"
              />

              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/mealplans"
                title="Meal Plans"
              />
              <PageTitle
                currentPath={location.pathname}
                targetPath="/admin/foods"
                title="Food/ Nutrition"
              />
            </h1>

            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/members/addmember"
              title="Add Member"
              pageSetting="Dashboard"
            />

            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/exercise/addexercise"
              title="Add Exercise"
              pageSetting="Dashboard"
            />

            <Breadcrumb
              currentPath={location.pathname.replace(
                //eslint-disable-next-line
                /(\/[^\/]+\/editmember)\/\d+$/,
                "$1"
              )}
              targetPath="/admin/members/editmember"
              title="Edit Member"
              pageSetting="Dashboard"
            />

            <Breadcrumb
              currentPath={location.pathname.replace(
                //eslint-disable-next-line
                /(\/[^\/]+\/editstaff)\/\d+$/,
                "$1"
              )}
              targetPath="/admin/staff/editstaff"
              title="Edit Staff"
              pageSetting="Dashboard"
            />

            <Breadcrumb
              currentPath={location.pathname.replace(
                //eslint-disable-next-line
                /(\/[^\/]+\/editcoach)\/\d+$/,
                "$1"
              )}
              targetPath="/admin/coach/editcoach"
              title="Edit Coach"
              pageSetting="Dashboard"
            />
            <Breadcrumb
              currentPath={location.pathname.replace(
                //eslint-disable-next-line
                /(\/[^\/]+\/addcoach)\/\d+$/,
                "$1"
              )}
              targetPath="/admin/coach/addcoach"
              title="Add Coach"
              pageSetting="Dashboard"
            />

            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/staff/addstaff"
              title="Add Staff"
              pageSetting="Dashboard"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/leads/addlead"
              title="Lead data"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/events/addevents"
              title="Add Event"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/facilities"
              title="Facilities"
              pageSetting="System Setting"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/incomeCategory"
              title="Income Categories"
              pageSetting="System Setting"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/saleTaxes"
              title="Sales Tax"
              pageSetting="System Setting"
            />
            <Breadcrumb
              currentPath={location.pathname}
              targetPath="/admin/memberships"
              title="Memberships"
              pageSetting="System Setting"
            />
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
                <img
                  src={userimg}
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt="Avatar"
                />
                <h1 className="text-base capitalize">
                  {userInfo?.user?.first_name}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-2 px-2.5"
                >
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
