"use client";

import { useState } from "react";
import PatientsTable from "./PatientsTable";
import styles from "@/styles/patients.module.css";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h1 className={styles.heading}>Patients Management</h1>
      <div className={styles.searchAddContainer}>
        <input
          type="text"
          placeholder="Search patients by name..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.addButton}>Add Patient</button>
      </div>
      <PatientsTable searchTerm={searchTerm} />
    </div>
  );
}
