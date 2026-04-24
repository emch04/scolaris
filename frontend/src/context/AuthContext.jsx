import { createContext, useEffect, useMemo, useState } from "react";
import { loginRequest, getMeRequest, logoutRequest } from "../services/auth.api";
import { clearAuthStorage, getUser, setUser } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(getUser());
  const [loading, setLoading] = useState(false); // On met à false par défaut pour ne pas bloquer l'UI

  useEffect(() => {
    const checkSession = async () => {
      // Si on n'a pas d'utilisateur du tout dans le storage, on ne fait rien (évite les requêtes inutiles)
      if (!getUser()) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMeRequest();
        if (response?.data?.user) {
          const receivedUser = response.data.user;
          if (receivedUser.role === "student" && receivedUser.classroom && typeof receivedUser.classroom === "object") {
            receivedUser.classroom = receivedUser.classroom._id;
          }
          setUser(receivedUser);
          setCurrentUser(receivedUser);
        }
      } catch (error) {
        console.log("Session non active.");
        clearAuthStorage();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginRequest({ email, password });
      const authData = response?.data;
      const receivedUser = authData?.user;

      if (receivedUser) {
        if (receivedUser.role === "student" && receivedUser.classroom && typeof receivedUser.classroom === "object") {
          receivedUser.classroom = receivedUser.classroom._id;
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

  useEffect(() => {
    let timeoutId;

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

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}