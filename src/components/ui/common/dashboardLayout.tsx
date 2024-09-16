  import { useEffect, useState } from "react";
  import { Link, Outlet, useLocation } from "react-router-dom";
  import { Header } from "./header";
  import { Toaster } from "@/components/ui/toaster";
  import "./style.css";

  import dashboardsvg from "@/assets/dashboard-svg.svg";
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { RootState } from "@/app/store";
  import { useSelector } from "react-redux";

  const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const [sidePanel, setSidePanel] = useState([]);
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
          console.log({ decodedSidepanel });
          const filteredPanel = decodedSidepanel.filter((sidepanel: any) => {
            // If the parent has no children, handle based on the parent's access_type
            if (!sidepanel.children || sidepanel.children.length === 0) {
              return sidepanel.access_type !== "no_access";
            }

            // If the parent has children, filter out the children with access_type == "no_access"
            const filteredChildren = sidepanel.children.filter((child: any) => child.access_type !== "no_access");

            // If after filtering, no children are left, we filter out the parent as well
            if (filteredChildren.length === 0) {
              return false; // Filter out the parent if all children have "no_access"
            }

            // Otherwise, keep the parent and assign the filtered children
            sidepanel.children = filteredChildren;
            return true;
          });
          setSidePanel(filteredPanel);
        } catch (error) {
          console.error("Error decoding Base64 string:", error);
        }
      }
    }, []);

    const isActiveLink = (targetPath: string): boolean => {
      const currentPath = location.pathname;
      return currentPath === targetPath;
    };

    console.log({ sidePanel })

    return (
      <div className="font-poppins flex h-full w-full relative ">
        <div
          className={`bg-white border-r text-black shadow-md transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-16"} max-h-screen custom-scrollbar-right `}
        >
          <div
            style={{ direction: "ltr" }}
            className="flex h-16 items-center justify-between px-4 border-gradient sticky top-0 z-30 bg-white "
          >
            <Link to="#" className="flex items-center gap-2 font-semibold">
              <img
                src={dashboardsvg}
                className={`h-8 w-9 ${!isSidebarOpen && "hidden"}`}
                alt="Dashboard"
              />
              <span
                className={`${!isSidebarOpen && "hidden"} text-2xl text-center font-extrabold`}
                style={{ fontFamily: "Jockey One" }}
              >
                {orgName}
              </span>
            </Link>
            {/* Uncomment the button if needed */}
            {/* <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon className="h-6 w-6" />
            </Button> */}
          </div>
          <nav
            style={{ direction: "ltr" }}
            className="flex flex-col gap-1 px-2 py-2 "
          >
            {sidePanel && sidePanel?.map((item: any, i: number) => (
              <>
                {item.children && item.children?.length == 0 && (
                  <Link
                    key={i}
                    to={item.link}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"} ${isActiveLink(item.link) ? "bg-primary" : ""}`}
                  >
                    <div
                      className={` w-8 h-8 ${isActiveLink(item.link) ? "bg-[#3ED13E]" : "bg-gray-100"} rounded-lg justify-center flex items-center`}
                    >
                      <i
                        className={`${item.icon} text-md ${isActiveLink(item.link) ? "" : "text-gray-500 stroke-current"}`}
                      ></i>
                    </div>
                    <span className={`${!isSidebarOpen && "hidden"}`}>
                      {item.name}
                    </span>
                  </Link>
                )}

                {item.children
                  && item.children?.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1 !border-none" id="accordion">
                        <AccordionTrigger
                          className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors !no-underline ${isSidebarOpen ? "justify-between text-sm" : "justify-center text-lg "} `}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 bg-gray-100 rounded-lg justify-center flex items-center`}
                            >
                              <i
                                className={`${item.icon} w-4 h-4 text-gray-500 stroke-current`}
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
                          <div className="ml-7 flex flex-col mt-2 [data-state=closed]:animate-accordion-up [data-state=open]:animate-accordion-down">
                            {item.children && item.children?.map((child: any, index: number) => (
                              <Link
                                key={index}
                                to={child.link}
                                className={`justify-start py-2 ${isActiveLink(child.link) ? "text-primary" : ""} ${!isSidebarOpen && "hidden"}`}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
              </>
            )
            )}
          </nav>
        </div>
        <div className="relative flex-1 max-h-screen w-[80%]">
          <Header />
          <main className="p-0 bg-outletcolor overflow-y-auto h-[90vh] relative">
            <div className="2xl:max-w-[1400px] mx-auto 4xl:max-w-[2200px]">
              <Outlet />
              <Toaster />
            </div>
          </main>
        </div>
      </div>
    );
  };

  export default DashboardLayout;
