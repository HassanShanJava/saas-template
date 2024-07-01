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
import  {useNavigate} from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useToast } from "../use-toast";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate=useNavigate();
  
  const dispatch = useDispatch<AppDispatch>();
  
  const handleLogout = () => {
      dispatch(logout());
      navigate("/");
     	toast({
        variant:"destructive",
        title: "Logout",
        description: "You are Successfully Logged Out",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
  };
  
  function isActiveLink(currentPath: string, targetPath: string) {
     return currentPath===targetPath;
  }
  
  console.log("click", location.pathname);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-1 shadow-sm ">
        <div className="flex w-full justify-between items-center gap-4">
          <div className="flex flex-row h-full justify-between items-center gap-4">
            <div className="w-full">
              <h1 className="text-3xl font-bold">
                {isActiveLink(location.pathname, "/admin/dashboard")
                  ? "Dashboard"
                  : ""}
                {isActiveLink(location.pathname, "/admin/client")
                  ? "Clients"
                  : ""}
                {isActiveLink(location.pathname, "/admin/client/addclient")
                  ? "Add Client"
                  : ""}
                {isActiveLink(location.pathname, "/admin/leads") ? "Leads" : ""}

                {isActiveLink(location.pathname, "/admin/leads/addlead")
                  ? "Leads"
                  : ""}

                {isActiveLink(location.pathname, "/admin/events")
                  ? "Events"
                  : ""}
                {isActiveLink(location.pathname, "/admin/events/addevents")
                  ? "Events"
                  : ""}
              </h1>
              {isActiveLink(location.pathname, "/admin/client/addclient") ? (
                <>
                  <span className="text-gray-400 pr-1 font-bold">
                    Dashboard
                  </span>{" "}
                  <span className="text-gray-400 font-bold">/</span>
                  <span className="pl-1 text-primary font-bold text-base">
                    Add Client
                  </span>
                </>
              ) : (
                ""
              )}
              {isActiveLink(location.pathname, "/admin/leads/addlead") ? (
                <>
                  <span className="text-gray-400 pr-1 font-bold">
                    Dashboard
                  </span>{" "}
                  <span className="text-gray-400 font-bold">/</span>
                  <span className="pl-1 text-primary font-bold text-base">
                    Lead data
                  </span>
                </>
              ) : (
                ""
              )}
              {isActiveLink(location.pathname, "/admin/events/addevents") ? (
                <>
                  <span className="text-gray-400 pr-1 font-bold">
                    Dashboard
                  </span>{" "}
                  <span className="text-gray-400 font-bold">/</span>
                  <span className="pl-1 text-primary font-bold text-base">
                    Add Event
                  </span>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center w-full gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
              <FontAwesomeIcon icon={faSearch} color="gray" className="pr-2" />
              <input
                id="text"
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-3">
            <div className="flex flex-row gap-3 p-3 justify-center items-center">
              <div className="w-8 h-8  border-[1px] border-gray-400 rounded-full justify-center flex items-center">
                <i className="fa-solid fa-globe "></i>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-2"
                  >
                    <i className="fa-solid fa-caret-down"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator /> */}
                  {/* <DropdownMenuItem>Logout</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator orientation="vertical" className=" h-10" />
            <div className="flex flex-row  justify-center items-center gap-4">
              <div className="w-8 h-8  border-[1px] border-gray-400 rounded-full justify-center flex items-center">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="w-8 h-8  border-[1px] border-gray-400 rounded-full justify-center flex items-center">
                <i className="fa-regular fa-bell"></i>
              </div>
            </div>
            <Separator orientation="vertical" className=" h-10" />

            <div className="justify-center items-center flex gap-1">
              <img
                src="/userSvg.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
              />
              <h1 className="text-black text-base"> Akira One</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-2"
                  >
                    <i className="fa-solid fa-caret-down"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
