"use client";
import { useEffect, useState } from "react";
import { fetchPatients } from "@/lib/api";

export default function HomePage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      <h2>Count: {patients.length}</h2>
      <ul>
        {patients.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
