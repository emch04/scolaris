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
          padding: "5px", 
          fontSize: "0.8rem", 
          fontWeight: "bold",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999
        }}>
          Mode hors-ligne : les données affichées peuvent ne pas être à jour.
        </div>
      )}
      <AppRouter />
    </>
  );
}

export default App;