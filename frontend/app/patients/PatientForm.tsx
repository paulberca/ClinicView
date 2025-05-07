"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/patients.module.css";
import { fetchDoctors } from "@/lib/api";

export type Patient = {
  id?: number;
  name: string;
  gender: string;
  contactNumber: string;
  bloodType: string;
  admissionDate: string;
  dateOfBirth: string;
  homeAddress: string;
  allergies: string;
  chronicCondition: string;
  familyDoctorId: number;
  insurance: string;
  condition: string;
};

type Doctor = {
  id: number;
  name: string;
};

type Props = {
  patient?: Patient;
  onSubmit: (data: Patient) => void;
  onDelete?: () => void;
  onCancel: () => void;
};

const genderOptions = ["Male", "Female", "Other"];
const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const conditionOptions = ["Stable", "Critical", "Recovered"];

export default function PatientForm({
  patient,
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const formatDate = (date: string) => {
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState<Patient>(
    patient
      ? {
          ...patient,
          admissionDate: formatDate(patient.admissionDate),
          dateOfBirth: formatDate(patient.dateOfBirth),
        }
      : {
          name: "",
          gender: "",
          contactNumber: "",
          bloodType: "",
          admissionDate: "",
          dateOfBirth: "",
          homeAddress: "",
          allergies: "",
          chronicCondition: "",
          familyDoctorId: 0,
          insurance: "",
          condition: "",
        }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>(
    {}
  );

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorList = await fetchDoctors(); // Fetching doctors using the api function
        setDoctors(doctorList);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };

    loadDoctors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "familyDoctorId" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.gender.trim()) newErrors.gender = "Gender is required.";
    if (!form.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required.";
    if (!form.bloodType.trim()) newErrors.bloodType = "Blood type is required.";

    if (!form.admissionDate) {
      newErrors.admissionDate = "Admission date is required.";
    } else if (form.admissionDate > today) {
      newErrors.admissionDate = "Admission date cannot be in the future.";
    } else if (form.admissionDate < form.dateOfBirth) {
      newErrors.admissionDate = "Admission date cannot be before birth date.";
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Birth date is required.";
    } else if (form.dateOfBirth >= today) {
      newErrors.dateOfBirth = "Birth date must be in the past.";
    } else {
      const age =
        new Date(today).getFullYear() -
        new Date(form.dateOfBirth).getFullYear();
      if (age > 120) {
        newErrors.dateOfBirth = "Age cannot be more than 120 years.";
      }
    }

    if (!form.homeAddress.trim())
      newErrors.homeAddress = "Home address is required.";
    if (!form.familyDoctorId)
      newErrors.familyDoctorId = "Family doctor is required.";
    if (!form.insurance.trim()) newErrors.insurance = "Insurance is required.";
    if (!form.condition.trim()) newErrors.condition = "Condition is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const renderInput = (
    label: string,
    name: keyof Patient,
    type: string = "text"
  ) => (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name] as string}
        onChange={handleChange}
        className={errors[name] ? styles.inputError : ""}
      />
      {errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof Patient,
    options: string[] | { label: string; value: string | number }[]
  ) => (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={errors[name] ? styles.inputError : ""}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
      {errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {patient ? "Edit Patient" : "Add New Patient"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={styles.formGrid}
      >
        {renderInput("Name", "name")}
        {renderSelect("Gender", "gender", genderOptions)}
        {renderInput("Contact Number", "contactNumber")}
        {renderSelect("Blood Type", "bloodType", bloodTypeOptions)}
        {renderInput("Admission Date", "admissionDate", "date")}
        {renderInput("Date of Birth", "dateOfBirth", "date")}
        {renderInput("Home Address", "homeAddress")}
        {renderInput("Allergies (comma-separated)", "allergies")}
        {renderInput("Chronic Condition", "chronicCondition")}
        {renderSelect(
          "Family Doctor",
          "familyDoctorId",
          doctors.map((d) => ({ label: d.name, value: d.id }))
        )}
        {renderInput("Insurance", "insurance")}
        {renderSelect("Condition", "condition", conditionOptions)}

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.confirmButton}>
            Confirm
          </button>
          {onDelete && patient && (
            <button
              type="button"
              onClick={onDelete}
              className={styles.deleteButton}
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
