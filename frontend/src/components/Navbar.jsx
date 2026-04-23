import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            background: "white", 
            width: "45px", 
            height: "45px", 
            borderRadius: "12px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            overflow: "hidden",
            border: "2px solid white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <img src="/assets/image.png" alt="Scolaris" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.5px", color: "var(--white)" }}>Scolaris</span>
        </Link>
        
        <div className="navbar-right">
          {/* Nom de l'utilisateur cliquable pour déconnexion rapide */}
          {isAuthenticated && (
            <span 
              className="user-badge hide-on-tiny" 
              onClick={() => { if(window.confirm("Voulez-vous vous déconnecter ?")) logout(); }}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
              title="Cliquez pour vous déconnecter"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {user?.fullName} ({user?.role === "parent" ? "Parent" : "Enseignant"})
            </span>
          )}

          {/* Bouton Burger Permanent */}
          <button className="navbar-toggle permanent" onClick={toggleMenu}>
            <span className={isOpen ? "icon open" : "icon"}></span>
          </button>
        </div>
{/* Menu coulissant (Sidebar) */}
<div className={isOpen ? "nav-links active" : "nav-links"}>
  <Link to="/" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    Accueil Scolaris
  </Link>
  <Link to="/devoirs" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    Espace Public (Devoirs)
  </Link>

  {isAuthenticated ? (
    <>
      {user?.role !== "super_admin" && (
        <Link to="/communications" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          Communications
        </Link>
      )}

      {user?.role === "parent" ? (
        <>
          <Link to="/parent/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Mon Tableau de Bord
          </Link>
          <Link to="/bulletins" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Bulletins de Notes
          </Link>
        </>
      ) : (
        <>
          {user?.role !== "super_admin" && (
            <Link to="/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Gestion Administration
            </Link>
          )}

          <Link to="/bulletins" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {user?.role === "super_admin" ? "Tableau de taux réussite généraux" : "Gestion Bulletins"}
          </Link>

          {user?.role === "super_admin" && (
            <Link to="/schools" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Gestion des Écoles
            </Link>
          )}

          {["admin", "director"].includes(user?.role) && (
            <Link to="/classrooms" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Gestion des Classes
            </Link>
          )}

          {user?.role !== "super_admin" && (
            <>
              <Link to="/students" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Élèves
              </Link>
              <Link to="/assignments" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                Devoirs
              </Link>
            </>
          )}
        </>
      )}
              <div className="menu-footer">
                <button onClick={() => { logout(); closeMenu(); }} className="logout-btn btn-block">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>Se connecter</Link>
          )}
        </div>
      </div>
      
      {/* Overlay pour fermer en cliquant à côté */}
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;