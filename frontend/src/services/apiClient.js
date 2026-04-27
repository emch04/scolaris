import axios from "axios";
import { getToken, setToken } from "../utils/storage";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Utilisation du port 5001 pour le backend local
const baseURL = isLocal ? "http://localhost:5001/api" : "https://scolaris-fucv.onrender.com/api";

// Variables pour l'IA Prédictive Frontend
let consecutiveErrors = 0;

const reportPredictiveIssue = async (message, level = 'WARN') => {
  try {
    const token = getToken();
    await axios.post(`${baseURL}/logs/report`, {
      message: `🔮 [PRÉDICTION IA FRONTEND] ${message}`,
      stack: "Détecté par apiClient interceptor",
      url: window.location.href,
      level: level
    }, {
      timeout: 3000,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  } catch (e) {
    console.error("Échec du rapport prédictif", e);
  }
};

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
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
  (response) => {
    // Analyse prédictive : Latence réseau
    const duration = new Date() - response.config.metadata.startTime;
    if (duration > 3000) { // Plus de 3 secondes = lent
      reportPredictiveIssue(`Latence réseau importante détectée (${duration}ms) sur l'URL: ${response.config.url}`);
    }
    
    // Réinitialiser le compteur d'erreurs en cas de succès
    consecutiveErrors = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Analyse prédictive : Suivi des échecs consécutifs
    if (error.response?.status !== 401 && originalRequest.url !== '/logs/report') {
      consecutiveErrors++;
      if (consecutiveErrors >= 3) {
        reportPredictiveIssue(`Défaillance réseau répétée (${consecutiveErrors} erreurs consécutives).`, 'FATAL');
        consecutiveErrors = 0;
      }
    }

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        
        if (res.data?.data?.token) {
          setToken(res.data.data.token);
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn("Échec du rafraîchissement automatique de la session.");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
