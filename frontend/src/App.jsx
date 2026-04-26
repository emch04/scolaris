/**
 * @file App.jsx
 * @description Composant racine de l'application React. Gère l'état de la connexion réseau et définit la structure globale avec le routeur.
 */

import { useState, useEffect } from "react";
import AppRouter from "./app/router.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import axios from "axios";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Vérification réelle de la connexion au démarrage
    const checkConnection = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const pingURL = isLocal ? "http://localhost:5001/" : "/";
        // On tente de joindre la racine du serveur
        await axios.get(pingURL, { timeout: 3000 });
        setIsOnline(true);
      } catch (err) {
        // Si on reçoit n'importe quelle réponse (même une erreur 404), on est en ligne
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
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  );
}

export default App;
