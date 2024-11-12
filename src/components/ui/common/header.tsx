import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import userimg from "@/assets/userSvg.svg";
import { setCode, setCounter } from "@/features/counter/counterSlice";
import { Badge } from "../badge";

const pageTitles = [
  { targetPath: "/admin/dashboard", title: "Dashboard" },
  { targetPath: "/admin/members", title: "Members" },
  { targetPath: "/admin/coach", title: "Coach" },
  { targetPath: "/admin/workoutplans", title: "Workout Plans" },
  { targetPath: "/admin/exercise", title: "Exercises" },
  { targetPath: "/admin/facilities", title: "System Settings" },
  { targetPath: "/admin/saleTaxes", title: "System Settings" },
  { targetPath: "/admin/incomeCategory", title: "System Settings" },
  { targetPath: "/admin/memberships", title: "System Settings" },
  { targetPath: "/admin/counter", title: "System Settings" },
  { targetPath: "/admin/paymentMethods", title: "System Settings" },
  { targetPath: "/admin/pos/sell/", title: "Point of Sale" },
  { targetPath: "/admin/pos/register", title: "Point of Sale" },
  { targetPath: "/admin/pos/salesReport", title: "Point of Sale" },
  { targetPath: "/admin/pos/cash", title: "Point of Sale" },
  { targetPath: "/admin/roles", title: "Roles & Access Management" },
  { targetPath: "/admin/staff", title: "Staff" },
  { targetPath: "/admin/mealplans", title: "Meal Plans" },
  { targetPath: "/admin/foods", title: "Foods & Nutritions" },
  {
    targetPath: "/admin/hardware_integration",
    title: "System Settings",
  },
  {
    targetPath: "/admin/members/detail",
    title: "Members",
  },
];

const breadcrumbs = [
  {
    targetPath: "/admin/facilities",
    title: "Facilities",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/incomeCategory",
    title: "Income Categories",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/saleTaxes",
    title: "Sales Tax",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/memberships",
    title: "Memberships",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/counter",
    title: "Counter Management",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/paymentMethods",
    title: "Payment Methods",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/pos/register",
    title: "Register",
    pageSetting: "Point of Sales",
  },
  {
    targetPath: "/admin/pos/cash",
    title: "Cash Management",
    pageSetting: "Point of Sales",
  },
  {
    targetPath: "/admin/pos/salesReport",
    title: "Sales Report",
    pageSetting: "Point of Sales",
  },
  {
    targetPath: "/admin/pos/sell/",
    title: "Sell",
    pageSetting: "Point of Sales",
  },
  {
    targetPath: "/admin/hardware_integration",
    title: "Hardware Integration",
    pageSetting: "System Setting",
  },
  {
    targetPath: "/admin/members/detail",
    title: "Hardware Integration",
    pageSetting: "Member",
  },
];

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
    <div className="pl-7  text-sm">
      <span className="text-gray-400 pr-1 font-semibold text-sm">
        {pageSetting}
      </span>{" "}
      <span className="text-gray-400 font-semibold ">/</span>
      <span className="pl-1 text-primary font-semibold text-sm">{title}</span>
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
  const counter_number =
    (localStorage.getItem("counter_number") as string) == ""
      ? null
      : Number(localStorage.getItem("counter_number") as string);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(setCode(null));
    dispatch(setCounter(null));
    dispatch(logout());
    toast({
      variant: "success",
      title: "Logout",
      description: "You are Successfully Logged Out",
    });
    navigate("/");
  };

  return (
    <header className="font-poppins sticky top-0 z-30 flex h-32 slg:h-16 items-center justify-between border-b bg-white px-1 shadow-sm">
      <div className="flex w-full justify-between items-start gap-4 flex-col slg:flex-row slg:items-center">
        <div className="w-full slg:!w-[calc(100%-280px)] flex flex-row h-full justify-between items-center ">
          <div className="w-full flex flex-col my-0">
            <h1 className="text-2xl  font-bold  pl-7 ">
              {pageTitles.map(({ targetPath, title }, index) => (
                <PageTitle
                  key={index}
                  currentPath={location.pathname}
                  targetPath={targetPath}
                  title={title}
                />
              ))}
            </h1>
            <div className="flex ">
              {breadcrumbs.map(({ targetPath, title, pageSetting }, index) => (
                <Breadcrumb
                  key={index}
                  currentPath={location.pathname}
                  targetPath={targetPath}
                  title={title}
                  pageSetting={pageSetting}
                />
              ))}
            </div>
          </div>

          {counter_number && (
            <Badge className=" text-white  mx-2">
              <span className="text-nowrap">
                Opened Counter: {counter_number}
              </span>
            </Badge>
          )}
        </div>

        <div className="w-full slg:max-w-[280px] flex flex-row justify-end slg:justify-center items-center gap-3 px-2 slg:px-0">
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
