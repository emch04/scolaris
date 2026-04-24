export const getFileUrl = (path) => {
  if (!path) return "#";
  
  // Si c'est déjà une URL complète (ex: https://...), on la retourne telle quelle
  if (path.startsWith("http")) return path;

  // On récupère la base de l'API et on enlève le suffixe /api
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api").replace("/api", "");
  
  // On s'assure que le chemin commence par un /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${apiBase}${cleanPath}`;
};