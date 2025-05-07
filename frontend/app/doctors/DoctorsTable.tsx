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
  const loader = useRef<HTMLDivElement | null>(null);
  const limit = 30;

  useEffect(() => {
    setDoctors([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    loadDoctors();
  }, [page, searchTerm]);

  const loadDoctors = async () => {
    try {
      const newDoctors = await fetchDoctors(page, limit, searchTerm);

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

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Contact Number</th>
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
