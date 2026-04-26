import axios from "axios";
import { getToken } from "../utils/storage";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Utilisation du port 5001 pour le backend local
const baseURL = isLocal ? "http://localhost:5001/api" : "https://scolaris-fucv.onrender.com/api";

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Anti-cache pour mobile
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
