const TOKEN_KEY = "tedp_token";
const USER_KEY = "tedp_user";
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);
  return rawUser ? JSON.parse(rawUser) : null;
};
export const removeUser = () => localStorage.removeItem(USER_KEY);
export const clearAuthStorage = () => { removeToken(); removeUser(); };
