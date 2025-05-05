import axios from "@/lib/axios";

export const fetchPatients = async (page = 1, limit = 10, search = "") => {
  const res = await axios.get("/patients", {
    params: { page, limit, search },
  });
  return res.data;
};
