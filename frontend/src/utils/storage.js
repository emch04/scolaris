const TOKEN_KEY = "tedp_token";
const USER_KEY = "tedp_user";

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const setUser = (user) => {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
    const rawUser = localStorage.getItem(USER_KEY);
    // On vérifie que c'est une chaîne JSON valide et pas "undefined"
    if (!rawUser || rawUser === "undefined") return null;
    return JSON.parse(rawUser);
  } catch (e) {
    return null;
  }
};

export const removeUser = () => localStorage.removeItem(USER_KEY);
export const clearAuthStorage = () => {
  localStorage.clear();
};