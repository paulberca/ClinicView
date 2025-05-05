"use client";

import PatientForm, { Patient } from "../PatientForm";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function AddPatientPage() {
  const router = useRouter();

  const handleAdd = async (data: Patient) => {
    try {
      await axios.post("/patients", data);
      router.push("/patients");
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  return (
    <PatientForm
      onSubmit={handleAdd}
      onCancel={() => router.push("/patients")}
    />
  );
}
