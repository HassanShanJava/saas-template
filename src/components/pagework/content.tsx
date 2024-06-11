import { HomeIcon, MenuIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from "lucide-react";

const menuItems = [
  {
    label: "Home",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    label: "Orders",
    icon: <ShoppingCartIcon className="w-5 h-5" />,
    subMenu: ["Recent Orders", "Pending Orders", "Shipped Orders"],
  },
  {
    label: "Products",
    icon: <PackageIcon className="w-5 h-5" />,
    subMenu: ["All Products", "New Products", "Bestsellers"],
  },
  {
    label: "Customers",
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    icon: <MenuIcon className="w-5 h-5" />,
  },
];

export default menuItems;