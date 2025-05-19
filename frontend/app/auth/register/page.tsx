"use client";

import styles from "@/styles/auth.module.css";
import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"DOCTOR" | "ADMIN">("DOCTOR");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, role);
      router.push("/auth/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "DOCTOR" | "ADMIN")}
          className={styles.select}
        >
          <option value="DOCTOR">Doctor (Regular User)</option>
          <option value="ADMIN">Admin</option>
        </select>
        {error && <p className={styles.errorText}>{error}</p>}
        <button
          type="submit"
          className={styles.submitButton}
        >
          Register
        </button>
      </form>
    </div>
  );
}
