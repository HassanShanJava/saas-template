import React from "react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface WithAuthProps {
  children?: ReactNode;
}
const withAuth = <P extends WithAuthProps>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const isAuthenticated = Boolean(localStorage.getItem("userToken")); // Replace with your auth logic

    if (!isAuthenticated) {
      return <Component {...props} />;
    }

    return <Navigate to="/admin/dashboard" />;
  };
};

export default withAuth;
