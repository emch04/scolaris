import { createContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../services/auth.api";
import { clearAuthStorage, getToken, getUser, setToken, setUser } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(getUser());
  const [token, setCurrentToken] = useState(getToken());
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginRequest({ email, password });
      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.teacher;
      if (receivedToken) { setToken(receivedToken); setCurrentToken(receivedToken); }
      if (receivedUser) { setUser(receivedUser); setCurrentUser(receivedUser); }
      return response;
    } finally { setLoading(false); }
  };

  const logout = () => { clearAuthStorage(); setCurrentToken(null); setCurrentUser(null); };

  useEffect(() => { setCurrentUser(getUser()); setCurrentToken(getToken()); }, []);

  const value = useMemo(() => ({ user, token, loading, isAuthenticated, login, logout }), [user, token, loading, isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
