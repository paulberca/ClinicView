import axios from "axios";
import { showConnectionError } from "@/contexts/ConnectionErrorContext";

const instance = axios.create({
  baseURL: "http://localhost:4000", // your backend base URL
  timeout: 5000,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      showConnectionError(); // triggers global error state
    }
    return Promise.reject(err);
  }
);

export default instance;
