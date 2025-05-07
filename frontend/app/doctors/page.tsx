"use client";

import { useState } from "react";
import DoctorsTable from "./DoctorsTable";
import styles from "@/styles/patients.module.css"; // Reusing the same styles
import { useRouter } from "next/navigation";

export default function DoctorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h1 className={styles.heading}>Doctors Management</h1>
      <div className={styles.searchAddContainer}>
        <input
          type="text"
          placeholder="Search doctors by name..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={styles.addButton}
          onClick={() => router.push("/doctors/add")}
        >
          Add Doctor
        </button>
      </div>
      <DoctorsTable searchTerm={searchTerm} />
    </div>
  );
}
