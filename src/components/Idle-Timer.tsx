import React from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
const { VITE_MAX_IDLE_TIME } = import.meta.env;
const IdleLogoutHandler = () => {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    // Clear session (e.g., remove token from localStorage)
    localStorage.removeItem("userToken");
    // Redirect to login page
    toast({
      variant: "destructive",
      title: "Session Timeout",
      description: "You have been inactive for too long.",
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
