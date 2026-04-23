import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Si on est en train de charger l'utilisateur, on n'affiche rien (évite les clignotements)
  if (loading) return <p>Chargement...</p>;

  // 1. Pas connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Connecté mais rôle non autorisé
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // On redirige vers l'accueil correspondant à son rôle
    return user?.role === "parent" 
      ? <Navigate to="/parent/dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;