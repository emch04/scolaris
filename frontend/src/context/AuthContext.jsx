import { createContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../services/auth.api";
import { clearAuthStorage, getToken, getUser, setToken, setUser } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(getUser());
  const [token, setCurrentToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  // Correction de la connexion : accepter 'user' ou 'teacher'
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginRequest({ email, password });
      
      // Le backend renvoie { success: true, message: "...", data: { token, user } }
      const authData = response?.data;
      const receivedToken = authData?.token;
      const receivedUser = authData?.user || authData?.teacher;

      if (receivedToken) {
        setToken(receivedToken);
        setCurrentToken(receivedToken);
      }
      if (receivedUser) {
        // Normalisation de la classe pour les élèves
        if (receivedUser.role === "student" && receivedUser.classroom && typeof receivedUser.classroom === "object") {
          receivedUser.classroom = receivedUser.classroom._id;
        }
        setUser(receivedUser);
        setCurrentUser(receivedUser);
      }
      // On retourne authData pour que LoginPage y accède directement
      return authData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setCurrentToken(null);
    setCurrentUser(null);
    window.location.href = "/login"; // Redirection propre
  };

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (token) {
          console.log("Session expirée pour inactivité (15 min).");
          logout();
        }
      }, 15 * 60 * 1000); // 15 minutes
    };

    if (token) {
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
  }, [token]);

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    if (storedUser) setCurrentUser(storedUser);
    if (storedToken) setCurrentToken(storedToken);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}