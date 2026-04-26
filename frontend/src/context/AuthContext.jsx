/**
 * @file AuthContext.jsx
 * @description Contexte global gérant l'état de l'authentification et les notifications d'erreurs.
 */

import { createContext, useState, useEffect } from "react";
import { getMeRequest, loginRequest, logoutRequest } from "../services/auth.api";
import { useToast } from "./ToastContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const checkAuth = async () => {
    try {
      const res = await getMeRequest();
      if (res?.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // CORRECTION : On envoie un objet contenant l'email et le mot de passe
      const res = await loginRequest({ email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion.";
      showToast(msg, "error");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      showToast("Déconnexion réussie.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
