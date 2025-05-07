"use client";

import { useState } from "react";
import styles from "@/styles/patients.module.css";

export type Doctor = {
  id?: number;
  name: string;
  specialty: string;
  contactNumber: string;
};

type Props = {
  doctor?: Doctor;
  onSubmit: (data: Doctor) => void;
  onDelete?: () => void;
  onCancel: () => void;
};

export default function DoctorForm({
  doctor,
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Doctor>(
    doctor ?? {
      name: "",
      specialty: "",
      contactNumber: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Doctor, string>>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.specialty.trim()) newErrors.specialty = "Specialty is required.";
    if (!form.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const renderInput = (label: string, name: keyof Doctor) => (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        value={form[name]}
        onChange={handleChange}
        className={errors[name] ? styles.inputError : ""}
      />
      {errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {doctor ? "Edit Doctor" : "Add New Doctor"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={styles.formGrid}
      >
        {renderInput("Name", "name")}
        {renderInput("Specialty", "specialty")}
        {renderInput("Contact Number", "contactNumber")}

        <div className={styles.buttonGroup}>
          {doctor ? (
            <>
              <button type="submit" className={styles.confirmButton}>
                Confirm
              </button>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={styles.deleteButton}
              >
                Delete Doctor
              </button>
            </>
          ) : (
            <>
              <button type="submit" className={styles.addButton}>
                Add
              </button>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
                style={{ backgroundColor: "#f44336" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
