import axios from "axios";
import { getToken } from "../utils/storage";

const apiClient = axios.create({
  // Vérifie que cette variable correspond bien à celle du fichier .env
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 10000
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;