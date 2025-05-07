"use client";

import styles from "@/styles/patients.module.css";
import { useEffect, useRef, useState } from "react";
import { fetchDoctors } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DoctorsTable({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<"specialty" | "patientCount" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const loader = useRef<HTMLDivElement | null>(null);
  const limit = 30;

  // Reset on search or sort change
  useEffect(() => {
    setDoctors([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    loadDoctors();
  }, [page, searchTerm, sortBy, sortOrder]);

  const loadDoctors = async () => {
    try {
      const newDoctors = await fetchDoctors(
        page,
        limit,
        searchTerm,
        sortBy,
        sortOrder
      );

      // If it's the first page, replace the list. Otherwise, append.
      setDoctors((prev) =>
        page === 1 ? newDoctors : [...prev, ...newDoctors]
      );

      if (newDoctors.length < limit) setHasMore(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
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

  const handleSort = (field: "specialty" | "patientCount") => {
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
            <th>Specialty</th>
            <th>Contact Number</th>
            <th
              onClick={() => handleSort("patientCount")}
              className={styles.sortable}
            >
              Patient Count{" "}
              {sortBy === "patientCount" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d, i) => (
            <tr
              key={i}
              onClick={() => router.push(`/doctors/edit/${d.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{d.name}</td>
              <td>{d.specialty}</td>
              <td>{d.contactNumber}</td>
              <td>{d.patientCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div ref={loader} style={{ height: 40, marginTop: 20 }}>
          <p>Loading more doctors...</p>
        </div>
      )}
    </>
  );
}
