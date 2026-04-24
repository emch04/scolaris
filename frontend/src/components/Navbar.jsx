import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = window.location.pathname === "/";

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) {
      logout();
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isHome && (
          <button onClick={() => window.history.back()} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}

        <Link to="/" className="brand" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <div style={{ background: "white", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/assets/image.jpg" alt="S" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
          </div>
          <span className="brand-text" style={{ fontSize: "1.3rem", fontWeight: "900" }}>Scolaris</span>
        </Link>
        
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            {isDarkMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>}
          </button>

          {isAuthenticated && (
            <button className="user-badge hide-on-mobile" onClick={handleLogout} style={{ fontSize: "0.8rem", padding: "6px 12px", background: "rgba(255,255,255,0.1)", borderRadius: "50px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>
              <div style={{ width: "8px", height: "8px", background: "#34A853", borderRadius: "50%" }}></div>
              <span style={{ fontWeight: "600" }}>{user?.fullName.split(' ')[0]}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          )}

          <button className="navbar-toggle" onClick={toggleMenu} style={{ padding: "10px", marginRight: "-10px" }}>
            <span className={isOpen ? "icon open" : "icon"}></span>
          </button>
        </div>

        <div className={isOpen ? "nav-links active" : "nav-links"}>
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
                  <Link to="/network-contacts" onClick={closeMenu}>Contacts Réseau</Link>
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
                  <Link to="/network-contacts" onClick={closeMenu}>Contacts Réseau</Link>
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

              <button onClick={handleLogout} className="logout-btn" style={{ margin: "1rem 1.5rem", padding: "10px", borderRadius: "8px", background: "rgba(255,82,82,0.1)", color: "#ff5252", border: "1px solid #ff5252", cursor: "pointer", fontWeight: "bold" }}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="btn btn-primary" style={{ margin: "1rem 1.5rem", textAlign: "center", color: "white" }}>Se connecter</Link>
          )}
        </div>
      </div>
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;