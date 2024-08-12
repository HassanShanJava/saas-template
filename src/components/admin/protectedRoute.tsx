import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
