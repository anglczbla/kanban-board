import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "/api",
  baseURL: import.meta.env.VITE_BE_URL,
  // withCredentials: true,
});

export default axiosInstance;
