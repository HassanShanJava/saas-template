import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  const location = useLocation();

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
