import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "../PageNotFound";
import AuthenticationPage from "../app/login/login";
import DashboardLayout from "../ui/common/dashboardLayout";
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

  const navigate = useNavigate()
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

  return <Outlet />;
  
};




export default ProtectedRoute;
