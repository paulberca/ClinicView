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
