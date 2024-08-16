import React from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
const { VITE_MAX_IDLE_TIME } = import.meta.env;
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
const IdleLogoutHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleOnIdle = () => {
    dispatch(logout());
    // Clear session (e.g., remove token from localStorage)
    // Redirect to login page
    toast({
      variant: "destructive",
      title: "Session Timeout",
      description: "Session Timeout due to inactivity.",
    });
    navigate("/");
  };
  const idleTimer = useIdleTimer({
    timeout: VITE_MAX_IDLE_TIME * 60 * 1000, // 15 minutes in milliseconds
    onIdle: handleOnIdle,
    debounce: 500, // Debounce the idle state to prevent flickering
  });

  return null; // This component doesn't render anything
};

export default IdleLogoutHandler;
