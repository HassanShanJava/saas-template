import { registerSessionStorage } from "@/app/types";
import { useGetlastRegisterSessionQuery } from "@/services/registerApi";
import { useEffect, useState } from "react";
import { saveToLocalStorage } from "@/utils/helper";

const has24HoursPassed = (storedTime: number) => {
  const currentTime = Date.now();
  return currentTime - storedTime > 24 * 60 * 60 * 1000;
};

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
    const localSession = localStorage.getItem("registerSession");

    if (localSession) {
      // Local session data is available
      const session = JSON.parse(localSession);
      setData(session);

      // Check if 24 hours have passed
      if (has24HoursPassed(Number(session.time))) {
        setIsDayExceed(true);
      } else {
        setIsDayExceed(false);
      }

      // If API has loaded, use it to verify local storage data
      if (counterData && !isDataLoading && !error) {
        if (counterData.closing_time) {
          // Register is closed, clear local session
          setIsRegisterOpen(false);
          localStorage.removeItem("registerSession");
          setData(null);
        } else {
          // Register is open, keep session from local storage
          setIsRegisterOpen(true);
        }
      }
    } else if (counterData && !isDataLoading && !error) {
      // No local session, use API data
      if (!counterData.closing_time) {
        // Register is open, save session to local storage
        const sessionData = {
          time: Date.now().toString(),
          isOpen: true,
          isContinue: false,
          sessionId: counterData.id ?? 1,
          opening_balance: counterData.opening_balance as number,
          opening_time: counterData.opening_time as string,
        };

        saveToLocalStorage("registerSession", sessionData);
        setData(sessionData);
        setIsRegisterOpen(true);
      } else {
        // Register is closed, no need for session
        setIsRegisterOpen(false);
        setData(null);
        localStorage.removeItem("registerSession");
      }

      setIsDayExceed(false); // Reset day exceed if register is open
    }

    // Stop loading when everything is processed
    setIsLoading(isDataLoading || error ? true : false);
  }, [counterData, isDataLoading, error]);

  return {
    data,
    isRegisterOpen,
    isLoading,
    isDayExceed,
  };
}
