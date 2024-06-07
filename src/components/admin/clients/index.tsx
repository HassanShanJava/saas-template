import { RxSlash } from "react-icons/rx";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoDownload } from "react-icons/go";
import { SideBarForm } from "./component/form-sidebar";
const Client = () => {

  return (
    <div className="bg-[#F8F9FA] w-full h-full ">
      <div className="mx-2 py-4 flex justify-start items-center ">
        <h1 className="text-3xl font-bold pr-2">Client</h1>
        <p className="text-3xl text-gray-400">(50)</p>
      </div>
      <div className="flex ">
        <div className="px-2 text-gray-400">
          <Link to="/admin/dashboard">
            <i className="fa-regular fa-folder pr-1 text-gray-300"></i>Dashboard
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <RxSlash className="h-4 w-4" />
          <div>
            <i className="fa-regular fa-folder pr-1"></i> Client
          </div>
        </div>
      </div>
      <div className="py-4 flex  justify-between px-4">
        <div className="px-2 flex justify-start items-center gap-4">
          <h1 className="text-gray-400 text-base font-semibold">Show</h1>
          <div className="flex items-center w-28 gap-2 px-2 py-2 rounded-md border shadow-sm border-[#DBE2EC]  focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
            <input
              id="text"
              type="text"
              placeholder="number"
              className="w-full bg-transparent outline-none"
            />
            <RiArrowDropDownLine className="h-8 w-8 text-gray-400" />
          </div>
          <div className="flex items-center w-48 gap-2 px-2 py-2 rounded-md border shadow-sm border-[#DBE2EC]  focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
            <input
              id="text"
              type="text"
              placeholder="All Status"
              className="w-full bg-transparent outline-none"
            />
            <RiArrowDropDownLine className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="px-2 flex justify-start items-center gap-2">
          <div className="flex items-center w-64 gap-2 px-2 py-2 rounded-md border shadow-sm border-[#DBE2EC]  focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
            <IoSearchOutline className="h-8 w-8 text-gray-400 font-bold" />
            <input
              id="text"
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <SideBarForm />
          <div className="bg-gray-100 rounded-full w-10 h-10 border border-gray-200 justify-center items-center flex">
            <GoDownload className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
