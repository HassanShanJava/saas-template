const DashboardHeader = () => {
  return (
    <header className="sticky top-16 bg-white p-4 z-30">
      <nav>
        <ul className="flex">
          <li className="mr-6">
            <span className="text-black cursor-pointer">Overview</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">
              Client & Membership
            </span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">Sales & Retention</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">Finance</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">CHECK INS</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">Schedule</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            {" "}
            <span className="text-black cursor-pointer">Staff</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
          <li className="mr-6">
            <span className="text-black cursor-pointer">Engagement</span>
            <i className="ml-2 fa fa-caret-down  text-black"></i>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default DashboardHeader;