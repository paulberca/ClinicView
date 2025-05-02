import axios from "axios";

const API_BASE = "http://localhost:4000";

export const fetchPatients = async () => {
  const res = await axios.get(`${API_BASE}/patients`);
  return res.data;
};
