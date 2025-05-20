import axios from "axios";
import { showConnectionError } from "@/contexts/ConnectionErrorContext";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
