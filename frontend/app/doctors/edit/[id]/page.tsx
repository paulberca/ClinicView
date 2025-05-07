"use client";

import { useEffect, useState } from "react";
import DoctorForm, { Doctor } from "../../DoctorForm";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";

export default function EditDoctorPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/doctors/${id}`).then((res) => setDoctor(res.data));
  }, [id]);

  const handleUpdate = async (data: Doctor) => {
    await axios.put(`/doctors/${id}`, data);
    router.push("/doctors");
  };

  const handleDelete = async () => {
    await axios.delete(`/doctors/${id}`);
    router.push("/doctors");
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <DoctorForm
      doctor={doctor}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      onCancel={() => router.push("/doctors")}
    />
  );
}
