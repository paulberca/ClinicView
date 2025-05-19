"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPatients } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      router.push("/patients");
    }
  }, [router]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
