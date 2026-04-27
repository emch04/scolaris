import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook personnalisé pour accéder facilement au contexte d'authentification.
 * Ce hook utilise `useContext` pour récupérer les données et fonctions exposées
 * par le AuthProvider (utilisateur actuel, état de chargement, login, logout).
 * 
 * @returns {Object} La valeur du contexte AuthContext.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  // Sécurité : Si le contexte est introuvable, on renvoie un état par défaut non connecté
  if (!context) {
    return { user: null, isAuthenticated: false, loading: true };
  }
  return context;
};

export default useAuth;
