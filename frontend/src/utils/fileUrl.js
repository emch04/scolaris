export const getFileUrl = (path) => {
  if (!path) return "#";
  
  if (path.startsWith("http")) return path;

  // Détection automatique de l'environnement
  const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
  const productionBase = "https://scolaris-fucv.onrender.com";
  const localBase = "http://localhost:5001";

  const apiBase = import.meta.env.VITE_API_BASE_URL 
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
    : (isProduction ? productionBase : localBase);
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${apiBase}${cleanPath}`;
};