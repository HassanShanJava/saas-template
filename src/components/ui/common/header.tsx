import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex w-full justify-between items-start gap-4">
          <div className="flex flex-row justify-center items-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center w-full gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
              <FontAwesomeIcon icon={faSearch} color="gray" className="pr-2" />
              <input
                id="text"
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-5">
            <div className="border-r-2 border-gray-400 flex flex-row gap-3 p-3">
              <i className="fa-solid fa-globe"></i>
              <i className="fa-solid fa-caret-down"></i>
            </div>
            <div className="flex flex-row gap-4">
              <i className="fa-regular fa-envelope"></i>
              <i className="fa-regular fa-bell"></i>
            </div>
            <div className="justify-center flex">
              <img
                src="/userSvg.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <i className="fa-solid fa-caret-down"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
