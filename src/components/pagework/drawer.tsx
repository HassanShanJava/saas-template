
import { ChevronDownIcon, ChevronLeftIcon, MountainIcon, ShoppingCartIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";
import { MenuIcon } from "lucide-react";
import { PackageIcon } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import menuItems from "./content";
import { RadioGroupForm } from "./shadcn";
import { SelectForm } from "./shadcnn";
import { Toaster } from "../ui/toaster";

export default function Component() {
  const [activeMenu, setActiveMenu] = useState("main");
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (index:any) => {
    setActiveSubMenu(activeSubMenu === index ? index : index);
  };

  const renderBackButton = () => (
    <button
      className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
      onClick={() => setActiveMenu("main")}
    >
      <ChevronLeftIcon className="w-5 h-5" />
      <span>Back</span>
    </button>
  );

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="w-64 transition-all duration-300 bg-slate-400 text-white">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="#" className="flex items-center gap-2 font-semibold">
            <span>Acme Inc</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {activeMenu === "main" ? (
            <>
              {menuItems
                .filter((menuItem) => menuItem.subMenu) // Filter out items without submenu
                .map((menuItem, index) =>
                  console.log(menuItem)
                  // <Link
                  //   key={index}
                  //   to="#"
                  //   className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
                  //   onClick={() => {
                  //     setActiveMenu(menuItem.label.toLowerCase());
                  //     toggleSubMenu(index);
                  //   }}
                  // >
                  //   {menuItem.icon}
                  //   <span>{menuItem.label}</span>
                  //   {menuItem.subMenu && (
                  //     <ChevronDownIcon className="ml-auto w-5 h-5" />
                  //   )}
                  // </Link>
                )}
            </>
          ) : (
            <></>
          )}
          {/* {activeMenu === "main" ? (
            <>
              <Link
                to="#"
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <div className="flex flex-col gap-1 px-3 py-2 transition-colors rounded-md hover:bg-gray-800 text-sm">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setActiveMenu("orders");
                    toggleSubMenu(0);
                  }}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Orders</span>
                  <ChevronDownIcon className="ml-auto w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1 px-3 py-2 transition-colors rounded-md hover:bg-gray-800 text-sm">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setActiveMenu("products");
                    toggleSubMenu(1);
                  }}
                >
                  <PackageIcon className="w-5 h-5" />
                  <span>Products</span>
                  <ChevronDownIcon className="ml-auto w-5 h-5" />
                </div>
              </div>
              <Link
                to="#"
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
              >
                <UsersIcon className="w-5 h-5" />
                <span>Customers</span>
              </Link>
              <Link
                to="#"
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
              >
                <span>Analytics</span>
              </Link>
            </>
          ) : (
            <>
              {renderBackButton()}
              {activeSubMenu === 0 && (
                <>
                  <div className="flex flex-col gap-1 px-3 py-2 transition-colors rounded-md hover:bg-gray-800 text-sm">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Orders</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <Link to="#" className="text-sm">
                      Recent Orders
                    </Link>
                    <Link to="#" className="text-sm">
                      Pending Orders
                    </Link>
                    <Link to="#" className="text-sm">
                      Shipped Orders
                    </Link>
                  </div>
                </>
              )}

              {activeSubMenu === 1 && (
                <>
                  <div className="flex flex-col gap-1 px-3 py-2 transition-colors rounded-md hover:bg-gray-800 text-sm">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Products</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <Link to="#" className="text-sm">
                      All Products
                    </Link>
                    <Link to="#" className="text-sm">
                      New Products
                    </Link>
                    <Link to="#" className="text-sm">
                      Bestsellers
                    </Link>
                  </div>
                </>
              )}
            </>
          )} */}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <RadioGroupForm />
          <SelectForm />
          <Toaster />
        </main>
      </div>
    </div>
  );
}















// import { useState } from "react";
// import { Link } from "react-router-dom";
// import  React  from 'react';
// import { ChevronDownIcon, ChevronLeftIcon, MountainIcon } from "lucide-react";

// export default function TextComp({ menuItems }:any) {
//   const [activeMenu, setActiveMenu] = useState("main");
//   const [activeSubMenu, setActiveSubMenu] = useState(null);

//   const toggleSubMenu = (index:any) => {
//     setActiveSubMenu(activeSubMenu === index ? null : index);
//   };

//   const renderBackButton = () => (
//     <button
//       className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
//       onClick={() => setActiveMenu("main")}
//     >
//       <ChevronLeftIcon className="w-5 h-5" />
//       <span>Back</span>
//     </button>
//   );

//   return (
//     <div className="flex w-full h-screen overflow-hidden">
//       <div className="w-64 transition-all duration-300 bg-slate-400 text-white">
//         <div className="flex items-center justify-between h-16 px-4">
//           <Link to="#" className="flex items-center gap-2 font-semibold">
//             <MountainIcon className="w-6 h-6" />
//             <span>Acme Inc</span>
//           </Link>
//         </div>
//         <nav className="flex flex-col gap-1 px-2">
//           {menuItems.map((menuItem:any, index:any) => (
//             <React.Fragment key={index}>
//               <Link
//                 to="#"
//                 className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-gray-800"
//                 onClick={() => {
//                   setActiveMenu(menuItem.label.toLowerCase());
//                   toggleSubMenu(index);
//                 }}
//               >
//                 {menuItem.icon}
//                 <span>{menuItem.label}</span>
//                 {menuItem.subMenu && (
//                   <ChevronDownIcon className="ml-auto w-5 h-5" />
//                 )}
//               </Link>
//               {activeMenu === menuItem.label.toLowerCase() &&
//                 menuItem.subMenu && (
//                   <div className="flex flex-col gap-1 px-3 py-2 transition-colors rounded-md hover:bg-gray-800 text-sm">
//                     {menuItem.subMenu.map((subMenuItem:any, subIndex:any) => (
//                       <Link key={subIndex} to="#" className="text-sm ml-4">
//                         {subMenuItem}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//             </React.Fragment>
//           ))}
//         </nav>
//       </div>
//       <div className="flex-1 overflow-auto">
//         <main className="p-6"></main>
//       </div>
//     </div>
//   );
// }


