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
    console.log("Is Data Loading:", isDataLoading);
    console.log("Counter Data:", counterData);

    const localSession = localStorage.getItem("registerSession");
    if (localSession) {
      const session = JSON.parse(localSession);
      setData(session);
      if (counterData && !isDataLoading && !error) {
        if (counterData.closing_time) {
          setIsRegisterOpen(false);
          localStorage.removeItem("registerSession"); // Remove the session if closed
          setData(null);
        } else {
          setIsRegisterOpen(true); // Check this condition
        }
      }

      if (has24HoursPassed(Number(session.time))) {
        setIsDayExceed(true);
      } else {
        setIsDayExceed(false);
      }

      setIsLoading(false);
    } else if (counterData && !isDataLoading && !error) {
      console.log("Counter Data:", counterData);
      console.log("Closing Time:", counterData.closing_time);

      if (!counterData.closing_time) {
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
        console.log(
          "Register is closed. Closing Time:",
          counterData.closing_time
        );
        setIsRegisterOpen(false); // This should correctly set the state to false
        setData(null);
        localStorage.removeItem("registerSession");
      }

      // Check if 24 hours have passed since the stored time in localStorage
      if (localStorage.getItem("registerSession")) {
        const storedSession = JSON.parse(
          localStorage.getItem("registerSession")!
        );
        if (has24HoursPassed(Number(storedSession.time))) {
          setIsDayExceed(true);
        } else {
          setIsDayExceed(false);
        }
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
