/**
 * @file App.jsx
 * @description Composant racine de l'application React. Gère l'état de la connexion réseau et définit la structure globale avec le routeur.
 */

import { useState, useEffect } from "react";
import AppRouter from "./app/router.jsx";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
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
      {!isOnline && (
        <div style={{ 
          background: "#D93025", 
          color: "white", 
          textAlign: "center", 
          padding: "8px", 
          fontSize: "0.85rem", 
          fontWeight: "bold",
          position: "fixed",
          bottom: 0, /* Déplacé en bas */
          left: 0,
          right: 0,
          zIndex: 9999,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.3)"
        }}>
          Mode hors-ligne : les données affichées peuvent ne pas être à jour.
        </div>
      )}
      <AppRouter />
    </>
  );
}

export default App;