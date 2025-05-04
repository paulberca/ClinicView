import PatientsTable from "./PatientsTable";
import styles from "@/styles/patients.module.css";

export default function PatientsPage() {
  return (
    <div>
      <h1 className={styles.heading}>Patients Management</h1>
      <div className={styles.searchAddContainer}>
        <input
          type="text"
          placeholder="Search patients by name..."
          className={styles.searchInput}
        />
        <button className={styles.addButton}>Add Patient</button>
      </div>
      <PatientsTable />
    </div>
  );
}
