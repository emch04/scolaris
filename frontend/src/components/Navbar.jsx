import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

/**
 * Navbar.jsx
 * Rôle : Barre de navigation globale.
 * Gère le menu mobile, le basculement du thème (clair/sombre), 
 * et affiche les liens de navigation conditionnels selon le rôle de l'utilisateur.
 */
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = window.location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  /**
   * handleLogout
   * Logique : Appelle la fonction de déconnexion et ferme le menu mobile.
   */
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) {
      logout();
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Bouton retour intelligent : Masqué sur la page d'accueil */}
        {!isHome && (
          <button onClick={() => window.history.back()} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}

        {/* Brand / Logo */}
        <Link to="/" className="brand" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <div style={{ background: "white", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/assets/android-chrome-512x512.png" alt="S" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "4px" }} />
          </div>
          <span className="brand-text" style={{ fontSize: "1.3rem", fontWeight: "900" }}>Scolaris</span>
        </Link>
        
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Toggle Thème Sombre/Clair */}
          <button onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            {isDarkMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>}
          </button>

          {/* Badge utilisateur et Déconnexion rapide */}
          {isAuthenticated && (
            <button className="user-badge hide-on-mobile" onClick={handleLogout} style={{ fontSize: "0.8rem", padding: "6px 12px", background: "rgba(255,255,255,0.1)", borderRadius: "50px", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>
              <div style={{ width: "8px", height: "8px", background: "#34A853", borderRadius: "50%" }}></div>
              <span style={{ fontWeight: "600" }}>{user?.fullName ? user.fullName.split(' ')[0] : "Utilisateur"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          )}

          {/* Toggle Menu Mobile (Hamburger) */}
          <button className="navbar-toggle" onClick={toggleMenu} style={{ padding: "10px", marginRight: "-10px" }}>
            <span className={isOpen ? "icon open" : "icon"}></span>
          </button>
        </div>

        {/* Liens de navigation avec rendu conditionnel par rôle */}
        <div className={isOpen ? "nav-links active" : "nav-links"} style={{ 
          backdropFilter: "blur(20px)", 
          background: "rgba(10, 10, 10, 0.95)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 0"
        }}>
          {isAuthenticated && (
            <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Connecté en tant que</div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{user?.fullName}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", textTransform: "capitalize" }}>{user?.role?.replace('_', ' ')}</div>
            </div>
          )}

          <Link to="/" onClick={closeMenu}>Accueil</Link>
          
          {isAuthenticated ? (
            <>
              {/* LIENS SUPER ADMIN */}
              {user?.role === "super_admin" && (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>Tableau de Bord</Link>
                  <Link to="/schools" onClick={closeMenu}>Écoles</Link>
                  <Link to="/messages" onClick={closeMenu}>Messagerie</Link>
                  <Link to="/network-contacts" onClick={closeMenu}>Contacts Réseau</Link>
                  <Link to="/calendar" onClick={closeMenu}>Calendrier</Link>
                </>
              )}

              {/* LIENS ADMIN / DIRECTEUR */}
              {["admin", "director"].includes(user?.role) && (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>Tableau de Bord</Link>
                  <Link to="/classrooms" onClick={closeMenu}>Classes</Link>
                  <Link to="/students" onClick={closeMenu}>Élèves</Link>
                  <Link to="/attendance" onClick={closeMenu}>Présences</Link>
                  <Link to="/timetable" onClick={closeMenu}>Emploi du temps</Link>
                  <Link to="/course-plans" onClick={closeMenu}>Plan de Cours</Link>
                  <Link to="/calendar" onClick={closeMenu}>Calendrier</Link>
                  <Link to="/library" onClick={closeMenu}>Bibliothèque</Link>
                  <Link to="/messages" onClick={closeMenu}>Messagerie</Link>
                </>
              )}

              {/* LIENS ENSEIGNANT */}
              {user?.role === "teacher" && (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>Tableau de Bord</Link>
                  <Link to="/assignments" onClick={closeMenu}>Devoirs</Link>
                  <Link to="/attendance" onClick={closeMenu}>Appel</Link>
                  <Link to="/course-plans" onClick={closeMenu}>Plan de Cours</Link>
                  <Link to="/calendar" onClick={closeMenu}>Calendrier</Link>
                  <Link to="/library" onClick={closeMenu}>Bibliothèque</Link>
                  <Link to="/messages" onClick={closeMenu}>Messagerie</Link>
                </>
              )}

              {/* LIENS ÉLÈVE */}
              {user?.role === "student" && (
                <>
                  <Link to="/student/dashboard" onClick={closeMenu}>Mon Espace</Link>
                  <Link to="/timetable" onClick={closeMenu}>Emploi du temps</Link>
                  <Link to="/course-plans" onClick={closeMenu}>Plan de Cours</Link>
                  <Link to="/calendar" onClick={closeMenu}>Calendrier</Link>
                  <Link to="/library" onClick={closeMenu}>Bibliothèque</Link>
                  <Link to={`/chat/${user.classroom}`} onClick={closeMenu}>Chat de Classe</Link>
                </>
              )}

              {/* LIENS PARENT */}
              {user?.role === "parent" && (
                <>
                  <Link to="/parent/dashboard" onClick={closeMenu}>Mes Enfants</Link>
                  <Link to="/course-plans" onClick={closeMenu}>Plan de Cours</Link>
                  <Link to="/calendar" onClick={closeMenu}>Calendrier</Link>
                  <Link to="/messages" onClick={closeMenu}>Messagerie</Link>
                </>
              )}

              <div style={{ marginTop: "auto", padding: "1rem 1.5rem" }}>
                <button onClick={handleLogout} style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#ff5252", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", boxShadow: "0 10px 20px rgba(255,82,82,0.2)" }}>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "1rem 1.5rem" }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "12px" }}>Se connecter</Link>
            </div>
          )}
        </div>
      </div>
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;
