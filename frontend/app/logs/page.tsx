"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/patients.module.css";
import { fetchLogs, fetchMonitoredUsers } from "@/lib/api";

// Define interfaces for the data types
interface User {
  email: string;
}

interface Log {
  user?: User;
  action: string;
  entity: string;
  entityId?: number | string;
  timestamp: string;
}

interface MonitoredUser {
  email: string;
  reason: string;
  createdAt: string;
}

export default function LogsTable() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showMonitoredUsers, setShowMonitoredUsers] = useState(false);
  const [monitoredUsers, setMonitoredUsers] = useState<MonitoredUser[]>([]);

  useEffect(() => {
    loadLogs();
  }, [sortOrder]);

  const loadLogs = async () => {
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const loadMonitoredUsers = async () => {
    try {
      const data = await fetchMonitoredUsers();
      setMonitoredUsers(data);
    } catch (error) {
      console.error("Failed to fetch monitored users:", error);
    }
  };

  const toggleMonitoredUsers = async () => {
    const nextState = !showMonitoredUsers;
    setShowMonitoredUsers(nextState);
    if (nextState) {
      await loadMonitoredUsers();
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="formContainer">
      <h2 className={styles.heading}>Activity Log</h2>

      <div className="searchAddContainer">
        <button className="addButton" onClick={toggleMonitoredUsers}>
          {showMonitoredUsers ? "Hide Monitored Users" : "Show Monitored Users"}
        </button>
      </div>

      {showMonitoredUsers && (
        <div className="mb-6 border border-red-400 p-4 rounded bg-red-50 shadow-sm">
          <h3 className="text-lg font-semibold text-red-600 mb-3">
            Monitored Users
          </h3>
          {monitoredUsers.length === 0 ? (
            <p className="text-gray-600">No suspicious activity detected.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {monitoredUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.email || "Unknown"}</td>
                    <td>{user.reason}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
            <th onClick={toggleSort} className={styles.sortable}>
              Timestamp {sortOrder === "asc" ? "↑" : "↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.user?.email || "Unknown"}</td>
              <td>{log.action}</td>
              <td>{log.entity}</td>
              <td>{log.entityId ?? "-"}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
