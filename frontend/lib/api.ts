import axios from "@/lib/axios";

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
