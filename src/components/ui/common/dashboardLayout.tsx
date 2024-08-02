import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import "./style.css";
import { IoIosFitness } from "react-icons/io";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavItem {
  name: string;
  link: string;
  dropdown: boolean;
  icon:
    | React.FC<React.SVGProps<SVGSVGElement>>
    | React.FC<React.ImgHTMLAttributes<HTMLImageElement>>;
  children?: any;
  hiddenRoutes?: string[];
}

const DashBoardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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

const MultiUserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.7573 2.24268C12.2728 0.758197 10.0165 0.758196 8.53202 2.24268L7.70711 3.06759C7.31658 3.45811 7.31658 4.09128 7.70711 4.4818C8.09763 4.87233 8.7308 4.87233 9.12132 4.4818L9.94624 3.65688C10.3368 3.26636 10.97 3.26636 11.3605 3.65688C11.751 4.04741 11.751 4.68057 11.3605 5.0711L10.5355 5.89602C10.145 6.28655 10.145 6.91971 10.5355 7.31024C10.9261 7.70076 11.5592 7.70076 11.9497 7.31024L12.7746 6.48532C14.2591 5.00084 14.2591 2.7445 12.7746 1.26002L13.7573 2.24268ZM5.18934 8.51002L2.84187 10.8575C2.66897 11.0304 2.54822 11.2526 2.49548 11.4965L1.7472 14.9333C1.68062 15.251 1.77372 15.5784 1.99986 15.8045C2.22599 16.0307 2.55341 16.1238 2.87106 16.0572L6.30786 15.3089C6.55173 15.2562 6.77389 15.1355 6.9468 14.9626L9.29426 12.6151C9.57716 12.3322 9.57716 11.8674 9.29426 11.5845L5.18934 8.51002ZM7.67458 4.11092L11.889 8.32534L10.5962 9.6181L6.3818 5.40369L7.67458 4.11092ZM0.999994 0.99999L4.70709 1.29287L2.4083 3.59167L4.73225 5.91562L3.43947 7.2084L1.14868 4.9096L0.8558 8.61671L0.999994 0.99999Z"
      fill="#2D3748"
    />
  </svg>
);

const EventsIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => <img {...props} src="/events.svg" alt="Events" />;

const ManageIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => <img {...props} src="/manage.svg" alt="manage" />;

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    link: "/admin/dashboard",
    icon: DashBoardIcon,
    dropdown: false,
  },
  {
    name: "Members",
    link: "/admin/members",
    hiddenRoutes: ["/admin/members/addmember", "/admin/members/editmember"],
    icon: MultiUserIcon,
    dropdown: false,
  },
  {
    name: "Leads",
    link: "/admin/leads",
    icon: RocketIcon,
    dropdown: false,
    hiddenRoutes: ["/admin/leads/addlead", "/admin/leads/editleads"],
  },
  {
    name: "Events",
    link: "/admin/events",
    icon: EventsIcon,
    dropdown: false,
    hiddenRoutes: ["/admin/events/addevents", "/admin/events/editevents"],
  },
  {
    name: "Coach",
    link: "/admin/coach",
    icon: MultiUserIcon,
    dropdown: false,
    hiddenRoutes: ["/admin/coach/addcoach", "/admin/coach/editcoach"],
  },
  {
    name: "Exercise",
    link: "/admin/exercise",
    icon: IoIosFitness,
    dropdown: false,
    hiddenRoutes: ["/admin/exercise/addexercise"],
  },
  {
    name: "Roles & Access Management",
    link: "/admin/roles",
    icon: EventsIcon,
    dropdown: false,
  },
  {
    name: "Manage",
    dropdown: true,
    icon: ManageIcon,
    link: "",
    children: [
      {
        name: "Staff",
        link: "/admin/staff",
        icon: "fa fa-user",
      },
    ],
    hiddenRoutes: ["/admin/staff/addstaff", "/admin/staff/editstaff"],
  },
  {
    name: "System Settings",
    dropdown: true,
    icon: MultiUserIcon,
    link: "",
    children: [
      {
        name: "Credit",
        link: "/admin/credits",
        icon: "fa fa-user",
      },
      {
        name: "Sale Taxes",
        link: "/admin/saleTaxes",
        icon: "fa fa-user",
      },
      {
        name: "Income Category",
        link: "/admin/incomeCategory",
        icon: "fa fa-user",
      },
      {
        name: "Memberships",
        link: "/admin/memberships",
        icon: "fa fa-user",
      },
    ],
  },
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const isActiveLink = (
    targetPath: string,
    hiddenRoutes: string[] = []
  ): boolean => {
    const currentPath = location.pathname;
    return (
      currentPath === targetPath ||
      hiddenRoutes.some((route) => currentPath.startsWith(route))
    );
  };

  return (
    <div className="font-poppins flex h-screen w-full relative overflow-y-hidden">
      <div
        className={`bg-white border-r text-black shadow-md transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-16"}`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-gradient">
          <Link to="#" className="flex items-center gap-2 font-semibold">
            <img
              src="/dashboard-svg.svg"
              className={`h-8 w-9 ${!isSidebarOpen && "hidden"}`}
              alt="Dashboard"
            />
            <span
              className={`${!isSidebarOpen && "hidden"} text-2xl text-center font-extrabold`}
              style={{ fontFamily: "Jockey One" }}
            >
              Let's Move
            </span>
          </Link>
          {/* Uncomment the button if needed */}
          {/* <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon className="h-6 w-6" />
          </Button> */}
        </div>
        <nav className="flex flex-col gap-1 px-2 py-2">
          {navItems.map(
            ({ name, link, icon: Icon, dropdown, children, hiddenRoutes }) => (
              <>
                {!dropdown && (
                  <Link
                    key={name}
                    to={link}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-primary ${isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"} ${isActiveLink(link, hiddenRoutes) ? "bg-primary" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 ${isActiveLink(link, hiddenRoutes) ? "bg-[#3ED13E]" : "bg-gray-100"} rounded-lg justify-center flex items-center`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActiveLink(link, hiddenRoutes) ? "" : "text-gray-500 stroke-current"}`}
                      />
                    </div>
                    <span className={`${!isSidebarOpen && "hidden"}`}>
                      {name}
                    </span>
                  </Link>
                )}

                {dropdown && children && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1 !border-none" id="accordion">
                      <AccordionTrigger
                        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors !no-underline ${isSidebarOpen ? "justify-between text-sm" : "justify-center text-lg "} `}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 bg-gray-100 rounded-lg justify-center flex items-center`}
                          >
                            <Icon
                              className={`w-4 h-4 text-gray-500 stroke-current`}
                            />
                          </div>
                          <span
                            className={`${!isSidebarOpen && "hidden"} font-normal`}
                          >
                            {name}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-7 flex flex-col mt-2 [data-state=closed]:animate-accordion-up [data-state=open]:animate-accordion-down">
                          {children.map((child: any, index: number) => (
                            <Link
                              key={index}
                              to={child.link}
                              className={`justify-start py-2 ${isActiveLink(child.link, hiddenRoutes) ? "text-primary" : ""} ${!isSidebarOpen && "hidden"}`}
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
      <div className="relative flex-1 max-h-[100vh] w-[80%]">
        <Header />
        <main className="p-0 bg-outletcolor overflow-y-auto h-[90vh] relative">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
