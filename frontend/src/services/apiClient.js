import axios from "axios";
import { getToken } from "../utils/storage";

const apiClient = axios.create({
  // Vérifie que cette variable correspond bien à celle du fichier .env
  baseURL: "https://scolaris-fucv.onrender.com/api",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
