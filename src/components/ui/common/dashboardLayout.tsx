import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import "./style.css"
import { Link, Outlet } from "react-router-dom";
import { Header } from "./header";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ScrollBar } from "../scroll-area";

interface NavItem {
	name: string,
	link: string,
	iconComponent: React.ReactNode,
	children: NavItem[] | null
}
const DashboardLayout =()=>{
  function isActiveLink(currentPath:string, targetPath:string) {
    return currentPath.startsWith(targetPath);
  }
  const location=useLocation();
  console.log("click",location.pathname)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen w-full relative overflow-y-hidden">
      <div
        className={`bg-white  text-black shadow-md transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-gradient">
          <Link to="#" className="flex items-center gap-2 font-semibold ">
            <img
              src="/dashboard-svg.svg"
              className={`h-8 w-9 ${!isSidebarOpen && "hidden"}`}
            ></img>
            <span
              className={`${!isSidebarOpen && "hidden"}  text-2xl text-center font-extrabold `}
              style={{
                fontFamily: "Jockey One",
              }}
            >
              {" "}
              Let's Move
            </span>
          </Link>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button> */}
        </div>
        <nav className="flex flex-col gap-1 px-2 py-2 ">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }
             ${
               isActiveLink(location.pathname, "/admin/dashboard")
                 ? "bg-primary"
                 : ""
             }
            `}
          >
            <div
              className={`w-8 h-8   ${
                isActiveLink(location.pathname, "/admin/dashboard")
                  ? "bg-[#3ED13E]"
                  : "bg-gray-100"
              }
              rounded-lg justify-center flex items-center`}
            >
              <DashBoardIcon
                className={`w-4 h-4 ${isActiveLink(location.pathname, "/admin/dashboard") ? "" : "text-gray-500 stroke-current"}`}
              />
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>
          {/* <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }
             ${
               isActiveLink(location.pathname, "/admin/dashboard")
                 ? "bg-primary"
                 : ""
             }
            `}
          >
            <div
              className={`w-8 h-8   ${
                isActiveLink(location.pathname, "/admin/dashboard")
                  ? "bg-[#3ED13E]"
                  : "bg-gray-100"
              }
              rounded-lg justify-center flex items-center`}
            >
              <DashBoardIcon
                className={`w-4 h-4 ${isActiveLink(location.pathname, "/admin/dashboard") ? "" : "text-gray-500 stroke-current"}`}
              />
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link> */}
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }
             ${
               isActiveLink(location.pathname, "/admin/client")
                 ? "bg-primary"
                 : ""
             }
            `}
          >
            <div
              className={`w-8 h-8   ${
                isActiveLink(location.pathname, "/admin/client")
                  ? "bg-[#3ED13E]"
                  : "bg-gray-100"
              }
              rounded-lg justify-center flex items-center`}
            >
              <MultiUserIcon
                className={`w-4 h-4 ${isActiveLink(location.pathname, "/admin/client") ? "" : "text-gray-500 stroke-current"}`}
              />
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Client</span>
          </Link>

          <Link
            to="/admin/leads"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }
             ${
               isActiveLink(location.pathname, "/admin/leads")
                 ? "bg-primary"
                 : ""
             }
            `}
          >
            <div
              className={`w-8 h-8   ${
                isActiveLink(location.pathname, "/admin/leads")
                  ? "bg-[#3ED13E]"
                  : "bg-gray-100"
              }
              rounded-lg justify-center flex items-center`}
            >
              <img
                src="/rocket.svg"
                className={`w-6 h-6 ${
                  isActiveLink(location.pathname, "/admin/leads")
                    ? ""
                    : "bg-transparent text-gray-500"
                }`}
              />
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Leads</span>
          </Link>

          <Link
            to="/admin/events"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }
             ${
               isActiveLink(location.pathname, "/admin/events")
                 ? "bg-primary"
                 : ""
             }
            `}
          >
            <div
              className={`w-8 h-8   ${
                isActiveLink(location.pathname, "/admin/events")
                  ? "bg-[#3ED13E]"
                  : "bg-gray-100"
              }
              rounded-lg justify-center flex items-center`}
            >
              <img
                src="/events.svg"
                className={`w-4 h-4 ${
                  isActiveLink(location.pathname, "/admin/events")
                    ? ""
                    : "bg-transparent text-gray-500"
                }`}
              />
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Events</span>
          </Link>
          <Link
            to="events"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-wrench h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Events</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-book-open h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Task</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-wrench h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Manage</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Coach</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Engagements</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>
              System Design
            </span>
          </Link>
        </nav>
      </div>
      <div className="relative flex-1 w-full max-h-[100vh]  ">
        <Header />

        <main className="p-0 bg-bgbackground overflow-y-auto h-[90vh] relative  ">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
}
export default DashboardLayout;
// function HomeIcon(props:any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//       <polyline points="9 22 9 12 15 12 15 22" />
//     </svg>
//   );
// }

function MultiUserIcon(props:any) {
  return (
    <svg
      {...props}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.35693 13V11.6667C1.35693 10.9594 1.63789 10.2811 2.13798 9.78105C2.63808 9.28095 3.31636 9 4.0236 9H6.69027C7.39751 9 8.07579 9.28095 8.57589 9.78105C9.07598 10.2811 9.35693 10.9594 9.35693 11.6667V13M10.0236 1.08667C10.5972 1.23354 11.1056 1.56714 11.4687 2.03488C11.8318 2.50262 12.0288 3.07789 12.0288 3.67C12.0288 4.26212 11.8318 4.83739 11.4687 5.30513C11.1056 5.77287 10.5972 6.10647 10.0236 6.25334M13.3569 13V11.6667C13.3535 11.0781 13.1555 10.5072 12.7938 10.043C12.432 9.57869 11.9268 9.24715 11.3569 9.10002M8.0236 3.66667C8.0236 5.13943 6.82969 6.33333 5.35693 6.33333C3.88417 6.33333 2.69027 5.13943 2.69027 3.66667C2.69027 2.19391 3.88417 1 5.35693 1C6.82969 1 8.0236 2.19391 8.0236 3.66667Z"
        stroke="#2D3748"
        strokeWidth="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function MenuIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

// function MountainIcon(props:any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   );
// }

// function PackageIcon(props:any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m7.5 4.27 9 5.15" />
//       <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
//       <path d="m3.3 7 8.7 5 8.7-5" />
//       <path d="M12 22V12" />
//     </svg>
//   );
// }

// function ShoppingCartIcon(props:any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="8" cy="21" r="1" />
//       <circle cx="19" cy="21" r="1" />
//       <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
//     </svg>
//   );
// }
function DashBoardIcon(props:any){
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.33333 8.41927H6.33333C6.79167 8.41927 7.16667 8.04427 7.16667 7.58594V0.919271C7.16667 0.460937 6.79167 0.0859375 6.33333 0.0859375H1.33333C0.875 0.0859375 0.5 0.460937 0.5 0.919271V7.58594C0.5 8.04427 0.875 8.41927 1.33333 8.41927ZM1.33333 15.0859H6.33333C6.79167 15.0859 7.16667 14.7109 7.16667 14.2526V10.9193C7.16667 10.4609 6.79167 10.0859 6.33333 10.0859H1.33333C0.875 10.0859 0.5 10.4609 0.5 10.9193V14.2526C0.5 14.7109 0.875 15.0859 1.33333 15.0859ZM9.66667 15.0859H14.6667C15.125 15.0859 15.5 14.7109 15.5 14.2526V7.58594C15.5 7.1276 15.125 6.7526 14.6667 6.7526H9.66667C9.20833 6.7526 8.83333 7.1276 8.83333 7.58594V14.2526C8.83333 14.7109 9.20833 15.0859 9.66667 15.0859ZM8.83333 0.919271V4.2526C8.83333 4.71094 9.20833 5.08594 9.66667 5.08594H14.6667C15.125 5.08594 15.5 4.71094 15.5 4.2526V0.919271C15.5 0.460937 15.125 0.0859375 14.6667 0.0859375H9.66667C9.20833 0.0859375 8.83333 0.460937 8.83333 0.919271Z"
        fill="currentColor"
      />
    </svg>
  );
}
function UsersIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
