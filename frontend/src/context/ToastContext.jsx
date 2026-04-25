import { createContext, useState, useContext, useCallback } from "react";

/**
 * Contexte pour la gestion globale des notifications (toasts).
 */
const ToastContext = createContext();

/**
 * Composant fournisseur (Provider) pour ToastContext.
 * Gère une file de notifications et les affiche à l'écran.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants à envelopper.
 */
export const ToastProvider = ({ children }) => {
  // Liste des notifications actives
  const [toasts, setToasts] = useState([]);

  /**
   * Affiche une nouvelle notification.
   * 
   * @param {string} message - Le message à afficher.
   * @param {string} [type="success"] - Le type de notification (success, error, info).
   */
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-suppression après 4 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  /**
   * Supprime manuellement une notification par son ID.
   * @param {number} id - L'identifiant unique de la notification.
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Conteneur fixe pour l'affichage des toasts */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none"
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: toast.type === "success" ? "#34A853" : toast.type === "error" ? "#ff5252" : "#0066cc",
              color: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              fontWeight: "bold",
              fontSize: "0.9rem",
              animation: "slideIn 0.3s ease-out forwards",
              cursor: "pointer",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "250px"
            }}
          >
            {/* Icônes SVG basées sur le type de toast */}
            {toast.type === "success" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            )}
            {toast.type === "error" && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder à la fonction d'affichage des toasts.
 * @returns {Object} Un objet contenant la fonction showToast.
 */
export const useToast = () => useContext(ToastContext);
