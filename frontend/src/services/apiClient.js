import axios from "axios";
import { getToken } from "../utils/storage";

// Détection automatique de l'environnement
const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
const productionURL = "https://scolaris-fucv.onrender.com/api";
const localURL = "http://localhost:5001/api";

const baseURL = import.meta.env.VITE_API_BASE_URL || (isProduction ? productionURL : localURL);

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 15000,
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
