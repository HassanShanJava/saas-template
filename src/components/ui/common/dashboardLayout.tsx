import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import "./style.css";
import { Separator } from "@/components/ui/separator";
import { demoSidePanel } from "@/constants/dashboard";
import dashboardsvg from "@/assets/dashboard-svg.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { ResourceTypes } from "@/app/types/roles";
import { useDispatch } from "react-redux";

import { Button } from "../button";
import { extractLinks } from "@/utils/helper";
import { toast } from "../use-toast";
import { LoadingButton } from "../loadingButton/loadingButton";
import IMAGES from "@/assets/IMAGES";

const DashboardLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seperatePanel, setSeperatePanel] = useState<ResourceTypes[]>([]);
  const [backtogym, setBacktogym] = useState<string>("");
  const [sidePanel, setSidePanel] = useState<ResourceTypes[]>([]);
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Use useEffect to fetch and set sidePanel from localStorage
  useEffect(() => {
    const sidepanel = localStorage.getItem("sidepanel");
    if (sidepanel) {
      try {
        const decodedSidepanel = JSON.parse(atob(sidepanel));
        const links = extractLinks(decodedSidepanel);
        setSidePanel(decodedSidepanel);
        setBacktogym(links[0]);
      } catch (error) {
        console.error("Error decoding Base64 string sidepanel:", error);
      }
    }
  }, []);

  const isActiveLink = (targetPath: string) => {
    // Exact match
    if (pathname === targetPath) {
      return true;
    }

    // Match `/admin/members` with sub-paths like `/admin/members/detail/48`
    if (pathname.startsWith(targetPath)) {
      const remainingPath = pathname.slice(targetPath.length);
      // Ensure the remaining path starts with "/" or is empty
      return remainingPath === "" || remainingPath.startsWith("/");
    }

    // Default case: No match
    return false;
  };

  return (
    <div className="font-poppins flex h-full w-full relative ">
      <nav
        className={`bg-white border-r text-black shadow-md transition-all duration-300  h-screen  custom-scrollbar-right ${isSidebarOpen ? "w-full max-w-[275px]" : "max-w-16"}`}
      >
        <div
          style={{ direction: "ltr" }}
          className="flex h-16 items-center justify-between px-4 border-gradient sticky top-0 z-30 bg-white "
        >
          <Link to="/" className="flex items-center gap-2 font-semibold ">
            <img
              src={IMAGES.dashboard_logo}
              className={`h-[7rem] w-[12rem] ${!isSidebarOpen && "hidden"}`}
              alt="Dashboard"
            />
            <span
              className={`${!isSidebarOpen && "flex"} text-2xl text-center font-extrabold`}
              style={{ fontFamily: "Jockey One" }}
            >
              {orgName?.split(" ")[0]}
            </span>
          </Link>
          {/* <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            close
          </button> */}

          {/* Uncomment the button if needed */}
          {/* <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon className="h-6 w-6" />
            </Button> */}
        </div>
        <div
          style={{ direction: "ltr" }}
          className="flex flex-col gap-2 px-2 py-2 "
        >
          {demoSidePanel?.map((item: any, i: number) => (
            <>
              {item.children?.length == 0 && (
                <Link
                  key={i}
                  to={item.link}
                  className={`group mb-1 flex items-center gap-2 rounded-md p-1 transition-colors ${isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"} ${isActiveLink(item.link) ? "bg-[#C53643]" : "hover:bg-[#eca8ad]"}`}
                >
                  <div
                    className={`w-7 h-7 ${isActiveLink(item.link) ? "bg-gradient-to-t from-[#E14746] to-[#C53643]" : "bg-gray-100"} rounded-lg justify-center flex items-center`}
                  >
                    {/* Icon */}
                    <img
                      src={item.icon}
                      alt=""
                      className={`${isActiveLink(item.link) ? "brightness-0 invert" : ""} w-full h-full`}
                    />
                  </div>
                  <span
                    className={`${!isSidebarOpen && "hidden"} ${isActiveLink(item.link) ? "text-[white]" : "text-gray-500 group-hover:text-[white]"} `}
                  >
                    {item.name}
                  </span>
                </Link>
              )}

              {item.children && item.children?.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1 !border-none" id="accordion">
                    <AccordionTrigger
                      className={`flex items-center gap-2 rounded-md p-1 transition-colors !no-underline ${isSidebarOpen ? "justify-between text-sm" : "justify-center text-lg "} `}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7  rounded-lg justify-center flex items-center`}
                        >
                          <i
                            className={`${item.icon}  w-4 h-4 text-gray-500 stroke-current`}
                          ></i>
                        </div>
                        <span
                          className={`${!isSidebarOpen && "hidden"} font-normal`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-2 flex flex-col  gap-1 mt-2 [data-state=closed]:animate-accordion-up [data-state=open]:animate-accordion-down ">
                        {item.children &&
                          item.children?.map((child: any, index: number) => (
                            <Link
                              key={index}
                              to={child.link}
                              className={`justify-start rounded-md px-3 flex gap-1 items-center py-1 ${isActiveLink(child.link) ? "bg-[#eca8ad] text-black" : "hover:bg-muted"}  ${!isSidebarOpen && "hidden"}`}
                            >
                              <span>
                                <img
                                  src={IMAGES.RBAC_icon}
                                  alt=""
                                  className={`size-6 ${isActiveLink(child.link) ? "brightness-0" : ""}`}
                                />
                              </span>
                              <span className="pt-1">{child.name}</span>
                            </Link>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          ))}
        </div>
      </nav>
      <div className=" flex-1 overflow-y-auto h-screen   w-[calc(100%-275px)]">
        <Header />
        <main className="bg-outletcolor min-h-screen ">
          <div className="w-full mx-auto max-w-[1600px]">
            <Outlet />
            <Toaster />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
