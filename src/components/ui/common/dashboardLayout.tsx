import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import "./style.css";
import { Separator } from "@/components/ui/separator";

import dashboardsvg from "@/assets/dashboard-svg.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { resourceTypes } from "@/app/types";
import { useDispatch } from "react-redux";
import {
  backPageCount,
  resetBackPageCount,
  setCode,
  setCounter,
} from "@/features/counter/counterSlice";
import { Button } from "../button";
import { extractLinks } from "@/utils/helper";
import { useUpdateCountersMutation } from "@/services/counterApi";
import { toast } from "../use-toast";

const DashboardLayout: React.FC = () => {
  const { isOpen } = JSON.parse(localStorage.getItem("registerSession") as string) ?? { isOpen: false };
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seperatePanel, setSeperatePanel] = useState<resourceTypes[]>([]);
  const [backtogym, setBacktogym] = useState<string>("");
  const [sidePanel, setSidePanel] = useState<resourceTypes[]>([]);
  const orgName = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_name
  );
  const { code, counter_number } = useSelector(
    (state: RootState) => state.counter
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

  useEffect(() => {
    const posPanel = localStorage.getItem("posPanel");
    if (code == "pos" && posPanel) {
      try {
        const decodedPosPanel = JSON.parse(atob(posPanel));
        setSeperatePanel(decodedPosPanel.children);
      } catch (error) {
        console.error("Error decoding Base64 string posPanel:", error);
      }
    }
  }, [code]);


  useEffect(() => {
    console.log({ pathname, code, counter_number }, pathname.includes("pos") && counter_number == null, "pathname")
    if (pathname.includes("pos") && counter_number == null) {
      dispatch(setCode("pos"));
      navigate("counter-selection", { replace: true })
      // <Navigate to="/counter-selection" />
      console.log({ counter_number }, "counterselection")
    } else if (!pathname.includes("pos")) {
      dispatch(setCounter(null));
      dispatch(resetBackPageCount());
    }
  }, [pathname, counter_number])

  const isActiveLink = (targetPath: string): boolean => {
    const currentPath = pathname;
    return currentPath === targetPath;
  };

  const [assignCounter] = useUpdateCountersMutation();

  const closeCounter = async () => {


    try {

      const payload = {
        id: counter_number ?? Number(localStorage.getItem('counter_number') as string),
        staff_id: null,
        is_open: false,
      };

      const resp = await assignCounter(payload).unwrap();
      if (resp) {
        dispatch(setCode(null));
        dispatch(setCounter(null));
        dispatch(resetBackPageCount());
        toast({
          variant: "success",
          title: "Counter Closed Successfully",
        });
      }
    } catch (error) {
      console.error("Error assigning counter:", error);
    }
  };

  const closePOSPanel = () => {
    if (isOpen) {
      toast({
        variant: "destructive",
        title: "Cannot close counter while register is open",
      })
      return;
    }
    closeCounter()
    navigate('/', { replace: true });
  }

  return (
    <div className="font-poppins flex h-full w-full relative ">
      <nav
        className={`bg-white border-r text-black shadow-md transition-all duration-300  h-screen  custom-scrollbar-right ${isSidebarOpen ? "w-full max-w-[275px]" : "max-w-16"}`}
      >
        <div
          style={{ direction: "ltr" }}
          className="flex h-16 items-center justify-between px-4 border-gradient sticky top-0 z-30 bg-white "
        >
          {code !== "pos" &&
            (<Link
              to="/"
              className="flex items-center gap-2 font-semibold "
              onClick={() => {
                dispatch(setCode(null))
              }}>
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
            )}

          {code == "pos" && (
            <div
              className="flex items-center gap-2 font-semibold cursor-pointer"
              onClick={() => {
                if (isOpen) {
                  toast({
                    variant: "destructive",
                    title: "Cannot close counter while register is open",
                  })
                  return;
                }
                dispatch(setCode(null));
                dispatch(setCounter(null));
                dispatch(resetBackPageCount());
                navigate("/", { replace: true })
              }}
            >
              <i className="rounded-[50%] fa fa-arrow-left px-2 py-0.5 text-lg border-2 border-primary text-primary"></i>
              <span
                className={`${!isSidebarOpen && "hidden"} text-2xl text-center font-extrabold`}
                style={{ fontFamily: "Jockey One" }}
              >
                Back to Gym
              </span>
            </div>
          )}

          {/* Uncomment the button if needed */}
          {/* <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon className="h-6 w-6" />
            </Button> */}
        </div>
        <div
          style={{ direction: "ltr" }}
          className="flex flex-col gap-2 px-2 py-2 "
        >
          {code !== "pos" &&
            sidePanel &&
            sidePanel?.map((item: any, i: number) => (
              <>
                {item.children && item.children?.length == 0 && (
                  <Link
                    key={i}
                    to={item.link}
                    onClick={() =>
                      dispatch(setCode(item.code == "pos" ? item.code : null))
                    }
                    className={`flex items-center gap-2 rounded-md p-1 transition-colors  ${isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"} ${isActiveLink(item.link) ? "bg-primary hover:bg-primary" : "hover:bg-hoverprimary  "}`}
                  >
                    <div
                      className={` w-7 h-7 ${isActiveLink(item.link) ? "bg-[#3ED13E]" : "bg-gray-100"} rounded-lg justify-center flex items-center`}
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

                {item.children && item.children?.length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value="item-1 !border-none"
                      id="accordion"
                      onClick={() => {
                        dispatch(
                          setCode(item.code == "pos" ? item.code : null)
                        );
                        item.code == "pos" && navigate(item.link);
                      }}
                    >
                      <AccordionTrigger
                        className={`flex items-center gap-2 rounded-md p-1 transition-colors !no-underline ${isSidebarOpen ? "justify-between text-sm" : "justify-center text-lg "} `}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 bg-gray-100 rounded-lg justify-center flex items-center`}
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
                        <div className="ml-7 flex flex-col  gap-1 mt-2 [data-state=closed]:animate-accordion-up [data-state=open]:animate-accordion-down ">
                          {item.children &&
                            item.children?.map((child: any, index: number) => (
                              <Link
                                key={index}
                                to={child.link}
                                onClick={() =>
                                  dispatch(
                                    setCode(
                                      item.code == "pos" ? item.code : null
                                    )
                                  )
                                }
                                className={`justify-start rounded-md px-3  py-1 ${isActiveLink(child.link) ? "bg-hoverprimary" : "hover:bg-muted"} ${!isSidebarOpen && "hidden"}`}
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
            ))}
          {code == "pos" && seperatePanel && (
            <>
              {seperatePanel.map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  onClick={() => dispatch(backPageCount(1))}
                  className={`flex items-center gap-2 rounded-md p-1 transition-colors  ${isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"} ${isActiveLink(item.link) ? "bg-primary hover:bg-primary" : "hover:bg-hoverprimary  "}`}
                >
                  <div
                    className={` w-7 h-7 ${isActiveLink(item.link) ? "bg-[#3ED13E]" : "bg-gray-100"} rounded-lg justify-center flex items-center`}
                  >
                    <i
                      className={`${item.icon} text-md ${isActiveLink(item.link) ? "" : "text-gray-500 stroke-current"}`}
                    ></i>
                  </div>
                  <span className={`${!isSidebarOpen && "hidden"}`}>
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="pt-4 w-full flex  flex-col gap-2">
                <div className="pb-4">
                  <Separator />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={closePOSPanel}
                    className={`flex items-center w-40 gap-2 rounded-md p-1 text-gray-900 transition-colors    hover:bg-primary  `}
                  >
                    <i className="fa-solid fa-arrow-up-from-bracket -rotate-90"></i>
                    <span className={`text-sm ${!isSidebarOpen && "hidden"}`}>
                      Close Counter
                    </span>
                  </Button>
                </div>
              </div>
            </>
          )}
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
