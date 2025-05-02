"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "@/lib/axios";
import ConnectionLostPopup from "@/components/connections/ConnectionLostPopup";
import ConnectionRegainedPopup from "@/components/connections/ConnectionRegainedPopup";

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
  const [popupVisible, setPopupVisible] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  externalSetShow = setShow;

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get("/ping");
        if (show) {
          setShow(false);
          setReconnected(true);
          setPopupVisible(true);
        }
      } catch {
        if (!show) {
          setShow(true);
          setPopupVisible(true);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [show]);

  const closePopup = () => setPopupVisible(false);

  return (
    <ConnectionErrorContext.Provider value={{ show, setShow }}>
      {children}
      {popupVisible && show && (
        <ConnectionLostPopup
          message="Lost connection to the server."
          onClose={closePopup}
        />
      )}
      {popupVisible && reconnected && !show && (
        <ConnectionRegainedPopup
          message="Connection restored!"
          onClose={closePopup}
        />
      )}
    </ConnectionErrorContext.Provider>
  );
}

export function useConnectionError() {
  return useContext(ConnectionErrorContext);
}

export function showConnectionError() {
  if (externalSetShow) externalSetShow(true);
}
