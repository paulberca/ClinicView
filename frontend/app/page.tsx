"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPatients } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Redirect to /patients
    router.push("/patients");
  }, [router]);

  // The rest of the code will still execute but won't be displayed
  // since the page will redirect
  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  return (
    <div>
      <h1>You not really supposed to be here</h1>
    </div>
  );
}
