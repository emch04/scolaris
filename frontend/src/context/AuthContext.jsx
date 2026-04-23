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
      
      // On accepte 'user' (nouveau backend) ou 'teacher' (ancien backend)
      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.user || response?.data?.teacher;

      if (receivedToken) {
        setToken(receivedToken);
        setCurrentToken(receivedToken);
      }
      if (receivedUser) {
        setUser(receivedUser);
        setCurrentUser(receivedUser);
      }
      return response;
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
          console.log("Inactivité détectée, déconnexion...");
          logout();
        }
      }, 15 * 60 * 1000); // 15 minutes
    };

    if (token) {
      const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "visibilitychange"];
      
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      resetTimer(); // Démarrer le minuteur initial

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
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