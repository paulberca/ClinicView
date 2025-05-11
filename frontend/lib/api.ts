import axios from "@/lib/axios";

let token: string | null = null;

// Called after login to set the token
export const setToken = (newToken: string) => {
  token = newToken;
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
  limit = 10,
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

export const createDoctor = async (doctorData: any) => {
  const res = await axios.post("/doctors", doctorData);
  return res.data;
};

export const updateDoctor = async (id: number, doctorData: any) => {
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
