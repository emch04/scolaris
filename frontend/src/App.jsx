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
        const pingURL = isLocal ? "http://localhost:5001/api/status" : "/api/status";
        await axios.get(pingURL, { timeout: 5000 });
        setIsOnline(true);
      } catch (err) {
        // Si on reçoit une réponse (même 404), on est en ligne
        if (err.response) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      }
    };

    checkConnection();

    const handleOnline = () => {
      setIsOnline(true);
      // Réveil du Service Worker pour sortir du mode offline
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => reg.update());
      }
    };
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
      {!isOnline && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          backgroundColor: '#ff4b2b', color: 'white', textAlign: 'center', 
          padding: '10px', zIndex: 9999, fontWeight: 'bold',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          ⚠️ Vous êtes actuellement hors connexion. Certaines fonctionnalités sont limitées.
        </div>
      )}
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
