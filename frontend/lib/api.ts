import axios from "@/lib/axios";

// Import the Doctor type from DoctorForm
import { Doctor } from "@/app/doctors/DoctorForm";

let token: string | null = null;

// On app load, try to load token from localStorage
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

// Called after login to set the token
export const setToken = (newToken: string) => {
  token = newToken;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", newToken);
  }
};

// Optionally, add a logout function
export const clearToken = () => {
  token = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// Automatically attach the token to all requests
axios.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPatients = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "",
  sortOrder = "asc"
) => {
  const res = await axios.get("/patients", {
    params: {
      page,
      limit,
      search,
      ...(sortBy && { sortBy }),
      ...(sortBy && sortOrder && { sortOrder }),
    },
  });
  return res.data;
};

export const fetchDoctors = async (
  page = 1,
  limit = 100,
  search = "",
  sortBy = "",
  sortOrder = "asc"
) => {
  const res = await axios.get("/doctors", {
    params: {
      page,
      limit,
      search,
      ...(sortBy && { sortBy }),
      ...(sortBy && sortOrder && { sortOrder }),
    },
  });
  return res.data;
};

export const fetchDoctorById = async (id: number) => {
  const res = await axios.get(`/doctors/${id}`);
  return res.data;
};

export const createDoctor = async (doctorData: Doctor) => {
  const res = await axios.post("/doctors", doctorData);
  return res.data;
};

export const updateDoctor = async (id: number, doctorData: Doctor) => {
  const res = await axios.put(`/doctors/${id}`, doctorData);
  return res.data;
};

export const deleteDoctor = async (id: number) => {
  const res = await axios.delete(`/doctors/${id}`);
  return res.data;
};

// Authentication API
export const login = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password });
  setToken(res.data.token);
};

export const register = async (
  email: string,
  password: string,
  role: "ADMIN" | "DOCTOR"
) => {
  const res = await axios.post("/auth/register", { email, password, role });
  return res.data;
};

export const fetchLogs = async () => {
  const res = await axios.get("/logs");
  return res.data;
};

export const fetchMonitoredUsers = async () => {
  const res = await axios.get("/logs/monitored-users");
  return res.data;
};
