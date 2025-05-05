"use client";

import { useEffect, useState } from "react";
import PatientForm, { Patient } from "../../PatientForm";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";

export default function EditPatientPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/patients/${id}`).then((res) => setPatient(res.data));
  }, [id]);

  const handleUpdate = async (data: Patient) => {
    await axios.put(`/patients/${id}`, data);
    router.push("/patients");
  };

  const handleDelete = async () => {
    await axios.delete(`/patients/${id}`);
    router.push("/patients");
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <PatientForm
      patient={patient}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      onCancel={() => router.push("/patients")}
    />
  );
}
