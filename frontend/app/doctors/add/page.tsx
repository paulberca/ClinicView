"use client";

import DoctorForm, { Doctor } from "../DoctorForm";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function AddDoctorPage() {
  const router = useRouter();

  const handleAdd = async (data: Doctor) => {
    try {
      await axios.post("/doctors", data);
      router.push("/doctors");
    } catch (error) {
      console.error("Failed to add doctor:", error);
    }
  };

  return (
    <DoctorForm onSubmit={handleAdd} onCancel={() => router.push("/doctors")} />
  );
}
