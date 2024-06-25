import { useLocalStorage } from "../../hooks/useLocalStorage";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const [ token, setToken ] = useLocalStorage("userToken", null)

  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
