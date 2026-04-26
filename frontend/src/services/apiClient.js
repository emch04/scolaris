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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token via le cookie refreshToken
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        
        // Si le rafraîchissement réussit, on relance la requête initiale
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue (refresh token expiré ou absent)
        console.warn("Échec du rafraîchissement automatique de la session.");
        
        // On ne redirige pas brutalement ici, on laisse le contexte d'auth gérer
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
