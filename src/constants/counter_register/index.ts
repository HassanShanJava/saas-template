import { registerSessionStorage } from "@/app/types";
import { useGetlastRegisterSessionQuery } from "@/services/registerApi";
import { useEffect, useState } from "react";
import { saveToLocalStorage } from "@/utils/helper";
// Helper function to check if 24 hours have passed based on stored time
const has24HoursPassed = (storedTime: number) => {
  const currentTime = Date.now();
  return currentTime - storedTime > 24 * 60 * 60 * 1000; // 24 hours in milliseconds
};

// Helper function to save session data to localStorage

export function useGetRegisterData(counter_id: number): {
  data: registerSessionStorage | null;
  isRegisterOpen: boolean;
  isLoading: boolean;
  isDayExceed: boolean;
} {
  const [data, setData] = useState<registerSessionStorage | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDayExceed, setIsDayExceed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: counterData,
    isLoading: isDataLoading,
    error,
  } = useGetlastRegisterSessionQuery(counter_id);

  useEffect(() => {
    // Check if localStorage has the session
    const localSession = localStorage.getItem("registerSession");
    if (localSession) {
      const session = JSON.parse(localSession);
      setData(session);
      setIsRegisterOpen(true);

      // Check if 24 hours have passed since the session's stored time
      if (has24HoursPassed(Number(session.time))) {
        setIsDayExceed(true);
      } else {
        setIsDayExceed(false);
      }

      setIsLoading(false);
    } else if (counterData && !isDataLoading && !error) {
      // If no session in localStorage, check API response
      if (!counterData.closing_time) {
        // Register is open if closing_time is null
        const sessionData = {
          time: Date.now().toString(), // Store the current time as the opening time
          isOpen: true,
          isContinue: false,
          sessionId: counterData.id ?? 1,
          opening_balance: counterData.opening_balance as number,
          opening_time: counterData.opening_time as string,
        };

        // Save the session to localStorage
        saveToLocalStorage("registerSession", sessionData);

        setData(sessionData);
        setIsRegisterOpen(true);
      } else {
        // Register is closed if closing_time is present
        setIsRegisterOpen(false);
      }

      // Check if 24 hours have passed since the stored time in localStorage
      if (has24HoursPassed(Date.now())) {
        setIsDayExceed(true);
      } else {
        setIsDayExceed(false);
      }

      setIsLoading(false);
    }
  }, [counterData, isDataLoading, error]);

  return {
    data,
    isRegisterOpen,
    isLoading,
    isDayExceed,
  };
}
