import axios from "@/lib/axios";

export const fetchPatients = async () => {
  const res = await axios.get("/patients");
  return res.data;
};
