"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "@/lib/axios";

const ConnectionErrorContext = createContext<{
  show: boolean;
  setShow: (val: boolean) => void;
}>({
  show: false,
  setShow: () => {},
});

let externalSetShow: (val: boolean) => void;

export function ConnectionErrorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  externalSetShow = setShow;

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await axios.get("/ping");
        setShow(false);
      } catch (error) {
        setShow(true);
      }
    };

    // Immediately ping once on mount
    pingBackend();

    // Ping every 5 seconds
    const interval = setInterval(pingBackend, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionErrorContext.Provider value={{ show, setShow }}>
      {children}
    </ConnectionErrorContext.Provider>
  );
}

export function useConnectionError() {
  return useContext(ConnectionErrorContext);
}

// Called from outside React (e.g., Axios interceptors)
export function showConnectionError() {
  if (externalSetShow) externalSetShow(true);
}
