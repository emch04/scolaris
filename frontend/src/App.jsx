import { useState, useEffect } from "react";
import AppRouter from "./app/router.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import axios from "axios";
import { getToken } from "./utils/storage";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const lastCrashed = sessionStorage.getItem('last_crashed_url');
    if (lastCrashed && lastCrashed === window.location.href) {
      const healthTimer = setTimeout(async () => {
        try {
          const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
          const baseURL = isLocal ? "http://localhost:5001/api" : "/api";
          const token = getToken();

          await axios.post(`${baseURL}/logs/report`, {
            message: `✅ [CERTITUDE 100%] L'utilisateur a stabilisé le parcours corrompu : ${window.location.pathname}`,
            url: window.location.href,
            level: 'INFO',
            resolved: true
          }, { 
            headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
          });

          sessionStorage.removeItem('last_crashed_url');
          sessionStorage.removeItem('silent_recovery_attempts');
        } catch (e) {}
      }, 5000);
      return () => clearTimeout(healthTimer);
    }
  }, [window.location.href]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const pingURL = isLocal ? "http://localhost:5001/" : "/";
        await axios.get(pingURL, { timeout: 3000 });
        setIsOnline(true);
      } catch (err) {
        if (err.response || err.request) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      }
    };

    checkConnection();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
