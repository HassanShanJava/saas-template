import { Navigate, Outlet, useLocation } from "react-router-dom";
import NotFoundPage from "../PageNotFound";
import { getLinks } from "@/utils/helper";

const ProtectedRoute = () => {
  const links = getLinks() || ['/']; // Return landing page as default;
  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  const location = useLocation();

  console.log(isAuthenticated, location.pathname);

  // Redirect to login if not authenticated and trying to access a protected route
  // if (!isAuthenticated && location.pathname !== "/") {
  //   return <Navigate to="/" />;
  // }

  // Redirect to dashboard if authenticated and trying to access the login page
  // if (isAuthenticated && location.pathname === "/login") {
  //   return <Navigate to={links[0]} />;
  // }

  // Check if the current path is not in the links array and redirect to the first available link
  // if (isAuthenticated) {
  //   if (
  //     links.some(
  //       (link) =>
  //         link == location.pathname || location.pathname.startsWith(link)
  //     )
  //   ) {
  //     return <Outlet />;
  //   } else if (links.length > 0) {
  //     return <NotFoundPage />;
  //   }
  // }
  return <Outlet />;
};

export default ProtectedRoute;
