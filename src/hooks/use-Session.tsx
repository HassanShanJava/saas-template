import { useState, useEffect } from "react";

//custom hook to manage session using sessionStorage
export const useSession = <T extends object>(key: string) => {
  const [session, setSession] = useState<T | null>(null);

  // Function to initialize session from sessionStorage
  const loadSession = () => {
    const storedSession = sessionStorage.getItem(key);
    if (storedSession) {
      setSession(JSON.parse(storedSession) as T);
    }
  };

  // Function to save session data
  const saveSession = (sessionData: T) => {
    sessionStorage.setItem(key, JSON.stringify(sessionData));
    setSession(sessionData);
  };

  // Function to clear session
  const clearSession = () => {
    sessionStorage.removeItem(key);
    setSession(null);
  };

  // Load session on initial render
  useEffect(() => {
    loadSession();
  }, []);

  return {
    session,
    saveSession,
    clearSession,
  };
};
