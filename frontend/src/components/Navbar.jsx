import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Tshangu Edu Primaire</Link>
      <div className="nav-links">
        <Link to="/devoirs">Devoirs</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/students">Élèves</Link>
            <Link to="/assignments">Devoirs prof</Link>
            <span className="user-badge">{user?.fullName}</span>
            <button onClick={logout} className="logout-btn">Déconnexion</button>
          </>
        ) : <Link to="/login">Connexion</Link>}
      </div>
    </nav>
  );
}
export default Navbar;
