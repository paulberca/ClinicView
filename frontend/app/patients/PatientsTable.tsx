"use client";

import styles from "@/styles/patients.module.css";
import { useEffect, useRef, useState } from "react";
import { fetchPatients } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PatientsTable({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<"condition" | "admissionDate" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const loader = useRef<HTMLDivElement | null>(null);
  const limit = 30;

  // Reset on search or sort change
  useEffect(() => {
    setPatients([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    loadPatients();
  }, [page, searchTerm, sortBy, sortOrder]);

  const loadPatients = async () => {
    try {
      const newPatients = await fetchPatients(
        page,
        limit,
        searchTerm,
        sortBy,
        sortOrder
      );
      setPatients((prev) => [...prev, ...newPatients]);
      if (newPatients.length < limit) setHasMore(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    if (!loader.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleSort = (field: "condition" | "admissionDate") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Contact Number</th>
            <th>Blood Type</th>
            <th
              onClick={() => handleSort("admissionDate")}
              className={styles.sortable}
            >
              Admission Date{" "}
              {sortBy === "admissionDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("condition")}
              className={styles.sortable}
            >
              Condition{" "}
              {sortBy === "condition" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr
              key={i}
              onClick={() => router.push(`/patients/edit/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.contactNumber}</td>
              <td>{p.bloodType}</td>
              <td>{new Date(p.admissionDate).toLocaleDateString()}</td>
              <td>
                <span className={styles[p.condition.toLowerCase()]}>
                  {p.condition}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div ref={loader} style={{ height: 40, marginTop: 20 }}>
          <p>Loading more patients...</p>
        </div>
      )}
    </>
  );
}
