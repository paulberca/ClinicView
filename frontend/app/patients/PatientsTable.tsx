import styles from "@/styles/patients.module.css";

const dummyPatients = [
  {
    name: "Lisa Lopez",
    gender: "Male",
    contact: "(552)463-7813",
    bloodType: "O-",
    admissionDate: "2023-12-18",
    condition: "Stable",
  },
  {
    name: "Katrina Davis",
    gender: "Male",
    contact: "001-760-273-8853x268",
    bloodType: "B-",
    admissionDate: "2024-08-05",
    condition: "Stable",
  },
];

export default function PatientsTable() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Contact Number</th>
          <th>Blood Type</th>
          <th>Admission Date</th>
          <th>Condition</th>
        </tr>
      </thead>
      <tbody>
        {dummyPatients.map((p, i) => (
          <tr key={i}>
            <td>{p.name}</td>
            <td>{p.gender}</td>
            <td>{p.contact}</td>
            <td>{p.bloodType}</td>
            <td>{p.admissionDate}</td>
            <td>
              <span className={styles[p.condition.toLowerCase()]}>
                {p.condition}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
