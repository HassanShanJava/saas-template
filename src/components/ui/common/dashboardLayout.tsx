import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./style.css"
import { Link, Outlet } from "react-router-dom";
import { Header } from "./header";

const DashboardLayout =()=>{
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`bg-white  text-black shadow-md transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-gradient">
          <Link to="#" className="flex items-center gap-2 font-semibold ">
            <img
              src="/dashboardlogo.svg"
              className={`h-8 w-9 ${!isSidebarOpen && "hidden"}`}
            ></img>
            <span
              className={`${!isSidebarOpen && "hidden"} italic font-Roboto text-2xl text-center font-extrabold `}
            >
              {" "}
              Let's Move
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <div className="bg-gray-600">
              <img
                src="/dashboardicon.svg"
                className={`h-4 w-4 ${!isSidebarOpen && "hidden"} items-center`}
              ></img>
            </div>
            <span className={`${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Client</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-rocket h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Leads</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-wrench h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Schedule</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-book-open h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Task</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <i className="fa-solid fa-wrench h-5 w-5"></i>
            <span className={`${!isSidebarOpen && "hidden"}`}>Manage</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Coach</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Engagements</span>
          </Link>
          <Link
            to="/admin/client"
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#D0FD3E] ${
              isSidebarOpen ? "justify-start text-sm" : "justify-center text-lg"
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span className={`${!isSidebarOpen && "hidden"}`}>System Design</span>
          </Link>
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-0">
          <Outlet />
          {/* <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    View and manage your recent orders.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#3210</TableCell>
                        <TableCell>Olivia Martin</TableCell>
                        <TableCell>February 20, 2022</TableCell>
                        <TableCell>$42.25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#3209</TableCell>
                        <TableCell>Ava Johnson</TableCell>
                        <TableCell>January 5, 2022</TableCell>
                        <TableCell>$74.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#3204</TableCell>
                        <TableCell>Michael Johnson</TableCell>
                        <TableCell>August 3, 2021</TableCell>
                        <TableCell>$64.75</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    View and manage your top-selling products.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>T-Shirt</TableCell>
                        <TableCell>1,234</TableCell>
                        <TableCell>$12,345.67</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hoodie</TableCell>
                        <TableCell>789</TableCell>
                        <TableCell>$7,890.12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jeans</TableCell>
                        <TableCell>456</TableCell>
                        <TableCell>$4,567.89</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View and analyze your business performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          </div> */}
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
