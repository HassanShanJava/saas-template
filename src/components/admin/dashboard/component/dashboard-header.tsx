const DashboardHeader = () => {
  return (
    <header className="sticky top-16 bg-white p-4">
      <nav>
        <ul className="flex justify-between items-center">
          <li className="flex gap-1 justify-center items-center">
            <img
              src="/src/assets/overview.svg"
              className={`w-5 h-5 items-center `}
            ></img>
            <span className="text-black text-xs cursor-pointer">Overview</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-start items-center gap-1">
            <img
              src="/src/assets/multiuser.svg"
              className={`w-5 h-5 items-center `}
            ></img>
            <span
              className="text-black cursor-pointer text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              CLIENT & MEMBERSHIP
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img
              src="/src/assets/chart-line.svg"
              className={`w-5 h-5 items-center `}
            ></img>
            <span
              className="text-black cursor-pointer text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              SALES & RETENTION
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img
              src="/src/assets/finance.svg"
              className={`w-5 h-5 items-center `}
            ></img>
            <span className="text-black cursor-pointer text-xs">FINANCE</span>
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
            <img
              src="/src/assets/calendar.svg"
              className={`w-5 h-5 items-center `}
            ></img>

            <span className="text-black cursor-pointer text-xs">SCHEDULE</span>
            <i className="ml-2 fa fa-caret-down  text-black "></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            {" "}
            <i className="fa-regular fa-user"></i>
            <span className="text-black cursor-pointer text-xs">STAFF</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className=" flex  justify-center items-center gap-1">
            <img
              src="/src/assets/star.svg"
              className={`w-5 h-5 items-center `}
            ></img>

            <span className="text-black cursor-pointer text-xs">
              ENGAGEMENT
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardHeader;
