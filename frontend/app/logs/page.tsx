"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/patients.module.css";
import { fetchLogs } from "@/lib/api";

export default function LogsTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadLogs();
  }, [sortOrder]);

  const loadLogs = async () => {
    try {
      const data = await fetchLogs();
      // const sorted = [...data].sort((a, b) =>
      //   sortOrder === "asc"
      //     ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      //     : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      // );
      // setLogs(sorted);
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4">
      <h2 className={styles.heading}>Activity Log</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
            {/* <th onClick={toggleSort} className={styles.sortable}>
              Timestamp {sortOrder === "asc" ? "↑" : "↓"}
            </th> */}
            <th>Timestamp</th>
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
