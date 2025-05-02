"use client";
import React from "react";
import styles from "./ConnectionPopup.module.css";

interface Props {
  message: string;
  onClose: () => void;
}

const ConnectionRegainedPopup: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      className={styles.popup}
      style={{ backgroundColor: "rgba(0, 255, 0, 0.8)" }}
    >
      {" "}
      {/* Green for "Connection Restored" */}
      <div className={styles.popupMessage}>{message}</div>
      <button onClick={onClose} className={styles.closeButton}>
        X
      </button>
    </div>
  );
};

export default ConnectionRegainedPopup;
