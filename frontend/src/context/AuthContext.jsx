/**
 * @file AuthContext.jsx
 * @description Contexte global gérant l'état de l'authentification et les notifications d'erreurs.
 */

import { createContext, useState, useEffect } from "react";
import { getMeRequest, loginRequest, logoutRequest } from "../services/auth.api";
import { useToast } from "./ToastContext";
import { setToken, setUser as setStorageUser, removeToken, removeUser, getToken } from "../utils/storage";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoResolvedCount, setAutoResolvedCount] = useState(() => {
    return parseInt(sessionStorage.getItem("ia_stabilized_count")) || 0;
  });
  const { showToast } = useToast();

  const checkAuth = async () => {
    // Si pas de token en storage et pas de cookie (on ne peut pas vérifier le cookie facilement en JS)
    // on tente quand même getMeRequest car withCredentials enverra le cookie si présent
    try {
      const res = await getMeRequest();
      if (res?.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setStorageUser(res.data.user);
        if (res.data.resolvedCount > 0) {
          setAutoResolvedCount(res.data.resolvedCount);
          sessionStorage.setItem("ia_stabilized_count", res.data.resolvedCount);
        }
      } else {

        throw new Error("User data missing");
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      // On ne vide pas forcément le storage ici pour éviter les boucles si c'est une erreur réseau
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginRequest({ email, password });
      const userData = res.data.user;
      const token = res.data.token;

      setUser(userData);
      setIsAuthenticated(true);
      if (res.data.resolvedCount > 0) {
        setAutoResolvedCount(res.data.resolvedCount);
        sessionStorage.setItem("ia_stabilized_count", res.data.resolvedCount);
      }
      
      // Stockage local pour persistance et header Authorization
      if (token) setToken(token);
      setStorageUser(userData);

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
      removeToken();
      removeUser();
      localStorage.clear();
      showToast("Déconnexion réussie.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth, autoResolvedCount, setAutoResolvedCount }}>
      {children}
    </AuthContext.Provider>
  );
};
