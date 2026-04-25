import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * ProtectedRoute.jsx
 * Rôle : Gardien des routes privées de l'application.
 * Vérifie si l'utilisateur est authentifié et possède le rôle requis 
 * avant d'autoriser l'accès au composant enfant.
 * 
 * @param {ReactNode} children - Le composant à afficher si autorisé.
 * @param {Array} allowedRoles - Liste des rôles autorisés (ex: ['admin', 'teacher']).
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Si l'état d'authentification est en cours de chargement, on affiche un indicateur
  if (loading) return <p>Chargement...</p>;

  // 1. Cas : Utilisateur non connecté
  // Redirection vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cas : Connecté mais rôle non autorisé pour cette route spécifique
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirection vers le tableau de bord par défaut correspondant au rôle
    return user?.role === "parent" 
      ? <Navigate to="/parent/dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  // 3. Cas : Autorisation accordée
  return children;
}

export default ProtectedRoute;
