"use client";

import { useEffect, useState } from "react";
import DoctorForm, { Doctor } from "../../DoctorForm";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";

export default function EditDoctorPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/doctors/${params.id}`);
        setDoctor(data);
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
      }
    };

    if (params.id) fetchDoctor();
  }, [params.id]);

  const handleEdit = async (data: Doctor) => {
    try {
      await axios.put(`/doctors/${params.id}`, data);
      router.push("/doctors");
    } catch (error) {
      console.error("Failed to update doctor:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/doctors/${params.id}`);
      router.push("/doctors");
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <DoctorForm
      doctor={doctor}
      onSubmit={handleEdit}
      onDelete={handleDelete}
      onCancel={() => router.push("/doctors")}
    />
  );
}
