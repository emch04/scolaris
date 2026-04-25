import { createContext, useEffect, useMemo, useState } from "react";
import { loginRequest, getMeRequest, logoutRequest } from "../services/auth.api";
import { clearAuthStorage, getUser, setUser } from "../utils/storage";

/**
 * Contexte pour la gestion globale de l'authentification.
 * Ce contexte permet de suivre l'état de l'utilisateur connecté, le chargement,
 * et fournit des fonctions pour se connecter et se déconnecter.
 */
export const AuthContext = createContext(null);

/**
 * Composant fournisseur (Provider) pour AuthContext.
 * Il initialise l'état de l'utilisateur à partir du stockage local et vérifie la session.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants à envelopper.
 */
export function AuthProvider({ children }) {
  // État de l'utilisateur (récupéré depuis le localStorage au démarrage)
  const [user, setCurrentUser] = useState(getUser());
  // État de chargement pour les vérifications initiales de session
  const [loading, setLoading] = useState(false); // On met à false par défaut pour ne pas bloquer l'UI

  useEffect(() => {
    /**
     * Vérifie si la session actuelle est toujours valide auprès du serveur.
     */
    const checkSession = async () => {
      if (!getUser()) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMeRequest();
        if (response?.data?.user) {
          const receivedUser = response.data.user;
          // Normalisation de la classe pour les étudiants
          if (receivedUser.role === "student" && receivedUser.classroom && typeof receivedUser.classroom === "object") {
            receivedUser.classroom = receivedUser.classroom._id;
          }
          setUser(receivedUser);
          setCurrentUser(receivedUser);
        }
      } catch (error) {
        // Ne déconnecter que si le serveur répond explicitement que le token est invalide
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("Session expirée ou invalide.");
          clearAuthStorage();
          setCurrentUser(null);
        } else {
          // Erreur réseau ou serveur injoignable, on garde la session locale
          console.log("Serveur injoignable ou erreur réseau, conservation de la session locale.");
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  /**
   * Fonction de connexion de l'utilisateur.
   * 
   * @param {string} email - L'adresse email de l'utilisateur.
   * @param {string} password - Le mot de passe de l'utilisateur.
   * @returns {Promise<Object>} Les données d'authentification reçues.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginRequest({ email, password });
      const authData = response?.data;
      const receivedUser = authData?.user;
      const token = authData?.token;

      if (receivedUser) {
        // Normalisation de la classe
        if (receivedUser.role === "student" && receivedUser.classroom && typeof receivedUser.classroom === "object") {
          receivedUser.classroom = receivedUser.classroom._id;
        }
        // Stockage du token
        if (token) {
          const { setToken } = await import("../utils/storage");
          setToken(token);
        }
        setUser(receivedUser);
        setCurrentUser(receivedUser);
      }
      return authData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction de déconnexion de l'utilisateur.
   * Supprime les données locales et redirige vers la page de connexion.
   */
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error("Erreur déconnexion serveur");
    } finally {
      clearAuthStorage();
      setCurrentUser(null);
      window.location.href = "/login";
    }
  };

  // Gestion de l'expiration de session par inactivité
  useEffect(() => {
    let timeoutId;

    /**
     * Réinitialise le minuteur d'inactivité.
     */
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (user) {
          console.log("Session expirée pour inactivité (15 min).");
          logout();
        }
      }, 15 * 60 * 1000); // 15 minutes
    };

    if (user) {
      // Liste étendue d'événements pour détecter l'activité
      const events = [
        "mousedown", "mousemove", "keypress", 
        "scroll", "touchstart", "click", 
        "keydown", "wheel"
      ];
      
      const handleActivity = () => resetTimer();

      events.forEach((event) => {
        window.addEventListener(event, handleActivity, { passive: true });
      });

      resetTimer(); // Démarrer le minuteur initial

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        events.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [user]);

  // Optimisation de la valeur du contexte pour éviter des rendus inutiles
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
