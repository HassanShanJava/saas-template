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
    const isAuthenticated = Boolean(localStorage.getItem("userToken"));
    if (!isAuthenticated) return; // Do nothing if the user is not logged in
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
  const timer = VITE_MAX_IDLE_TIME * 60 * 1000;
  console.log("timer", timer / 1000);
  const idleTimer = useIdleTimer({
    timeout: timer, // 15 minutes in milliseconds
    onIdle: handleOnIdle,
    debounce: 500, // Debounce the idle state to prevent flickering
    events: ["mousemove", "keydown", "wheel", "scroll", "touchstart"], // Common idle detection events
  });

  return null; // This component doesn't render anything
};

export default IdleLogoutHandler;
