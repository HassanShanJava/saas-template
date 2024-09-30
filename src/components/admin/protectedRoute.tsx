import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "../PageNotFound";
import { extractLinks } from "@/utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const ProtectedRoute = () => {
  const [sidePanel, setSidePanel] = useState<string[]>([]);
  const sidepanel = localStorage.getItem("sidepanel");
  const orgId = useSelector(
    (state: RootState) => state.auth.userInfo?.user?.org_id
  );
  useEffect(() => {
    if (sidepanel) {
      try {
        const decodedSidepanel = JSON.parse(atob(sidepanel));
        console.log({ decodedSidepanel });
        const links = extractLinks(decodedSidepanel)
        setSidePanel(links);
      } catch (error) {
        console.error("Error decoding Base64 string sidepanel:", error);
      }
    }
  }, [sidepanel]);

  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  const location = useLocation();
  // Redirect to login if not authenticated and trying to access a protected route
  // Redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  // Redirect to dashboard if authenticated and trying to access the login page
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/admin/dashboard" />;
  }

  // Check if the current path is not in the links array and redirect to the first available link
  if (isAuthenticated) {
    if (
      sidePanel.some(
        (link) =>
          link == location.pathname || location.pathname.startsWith(link)
      )
    ) {
      return <Outlet />;
    } else if (sidePanel.length > 0) {
      return <NotFoundPage />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;
