const DashboardHeader = () => {
  return (
    <header className="sticky top-16 bg-white p-4 z-30">
      <nav>
        <ul className="flex justify-between items-center">
          <li className="flex gap-1 justify-center items-center">
            <img src="/overview.svg" className={`w-5 h-5 items-center `}></img>
            <span className="text-black text-xs cursor-pointer">Overview</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-start items-center gap-1">
            <img src="/multiuser.svg" className={`w-5 h-5 items-center `}></img>
            <span
              className="text-black cursor-pointer text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              Client & Membership
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img
              src="/chart-line.svg"
              className={`w-5 h-5 items-center `}
            ></img>
            <span
              className="text-black cursor-pointer text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              Sales & Retention
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img src="/finance.svg" className={`w-5 h-5 items-center `}></img>
            <span className="text-black cursor-pointer text-xs">Finance</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <i className="fa-solid fa-check w-5 h-5  flex justify-center items-center"></i>
            <span
              className="text-black cursor-pointer text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              CHECK INS
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img src="/calendar.svg" className={`w-5 h-5 items-center `}></img>

            <span className="text-black cursor-pointer text-xs">Schedule</span>
            <i className="ml-2 fa fa-caret-down  text-black "></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            {" "}
            <i className="fa-regular fa-user"></i>
            <span className="text-black cursor-pointer text-xs">Staff</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img src="/star.svg" className={`w-5 h-5 items-center `}></img>

            <span className="text-black cursor-pointer text-xs">
              Engagement
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default DashboardHeader;