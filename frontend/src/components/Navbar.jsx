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
        
        {/* Bouton Retour Navbar (Masqué sur l'accueil) */}
        {!isHome && (
          <button 
            onClick={() => window.history.back()} 
            style={{ 
              background: "rgba(255,255,255,0.1)", 
              border: "none", 
              borderRadius: "8px", 
              width: "35px", 
              height: "35px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              color: "white"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* LOGO */}
        <Link to="/" className="brand" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <div style={{ 
            background: "white", 
            width: "40px", 
            height: "40px", 
            borderRadius: "10px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            overflow: "hidden"
          }}>
            <img src="/assets/image.png" alt="S" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
          </div>
          <span className="brand-text" style={{ fontSize: "1.3rem", fontWeight: "900" }}>Scolaris</span>
        </Link>
        
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Toggle Thème */}
          <button 
            onClick={toggleTheme}
            style={{ 
              background: "rgba(255,255,255,0.1)", 
              border: "none", 
              borderRadius: "50%", 
              width: "35px", 
              height: "35px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              color: "white"
            }}
            title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {/* Badge Utilisateur (Masqué sur Mobile pour éviter l'encombrement) */}
          {isAuthenticated && (
            <button 
              className="user-badge hide-on-mobile" 
              onClick={handleLogout}
              title="Se déconnecter"
              style={{ 
                fontSize: "0.8rem", 
                padding: "6px 12px", 
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,82,82,0.2)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <div style={{ width: "8px", height: "8px", background: "#34A853", borderRadius: "50%" }}></div>
              <span style={{ fontWeight: "600" }}>
                {user?.fullName.split(' ')[0]} ({user?.role === "super_admin" ? "Admin" : user?.role === "student" ? "Élève" : user?.role === "parent" ? "Parent" : "Enseignant"})
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          )}

          {/* Bouton Burger */}
          <button className="navbar-toggle" onClick={toggleMenu} style={{ padding: "10px", marginRight: "-10px" }}>
            <span className={isOpen ? "icon open" : "icon"}></span>
          </button>
        </div>

        {/* Menu Coulissant (Sidebar) */}
        <div className={isOpen ? "nav-links active" : "nav-links"}>
          {/* Header du Menu (Visible sur mobile) */}
          {isAuthenticated && (
            <div className="menu-mobile-header" style={{ padding: "2rem 1.5rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase", fontWeight: "bold" }}>Connecté en tant que</p>
              <h3 style={{ fontSize: "1.1rem", marginTop: "5px" }}>{user?.fullName}</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold" }}>
                {user?.role.toUpperCase()}
              </span>
            </div>
          )}

          <Link to="/" onClick={closeMenu}>Accueil</Link>
          <Link to="/a-propos" onClick={closeMenu}>À Propos</Link>

          {isAuthenticated ? (
            <>
              {/* LIENS SUPER ADMIN */}
              {user?.role === "super_admin" && (
                <>
                  <Link to="/schools" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Gestion des Écoles
                  </Link>
                  <Link to="/students" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Liste Globale Élèves
                  </Link>
                  <Link to="/parents" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Liste Globale Parents
                  </Link>
                  <Link to="/messages" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Messagerie
                  </Link>
                </>
              )}

              {/* LIENS ADMIN / DIRECTEUR ECOLE */}
              {["admin", "director"].includes(user?.role) && (
                <>
                  <Link to="/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Tableau de bord
                  </Link>
                  <Link to="/classrooms" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Gestion des Classes
                  </Link>
                  <Link to="/attendance" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    Suivi Présences
                  </Link>
                  <Link to="/timetable" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Emploi du temps
                  </Link>
                  <Link to="/messages" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Messagerie
                  </Link>
                </>
              )}

              {/* LIENS ENSEIGNANT */}
              {user?.role === "teacher" && (
                <>
                  <Link to="/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    Mes Classes
                  </Link>
                  <Link to="/attendance" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    Faire l'appel
                  </Link>
                  <Link to="/assignments" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    Gérer les Devoirs
                  </Link>
                  <Link to="/messages" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Messagerie
                  </Link>
                </>
              )}

              {/* LIENS ÉLÈVE */}
              {user?.role === "student" && (
                <>
                  <Link to="/student/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Mon Espace
                  </Link>
                  <Link to="/timetable" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Emploi du temps
                  </Link>
                  <Link to="/messages" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Messagerie
                  </Link>
                </>
              )}

              {/* LIENS PARENT */}
              {user?.role === "parent" && (
                <>
                  <Link to="/parent/dashboard" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Suivi de mes enfants
                  </Link>
                  <Link to="/timetable" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Emplois du temps
                  </Link>
                  <Link to="/messages" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Messagerie
                  </Link>
                </>
              )}

              <div className="menu-footer" style={{ marginTop: "auto", padding: "2rem 1.5rem" }}>
                <button onClick={handleLogout} className="logout-btn" style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255,82,82,0.1)", color: "#ff5252", border: "1px solid #ff5252", fontWeight: "bold", cursor: "pointer" }}>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "1.5rem" }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-primary" style={{ display: "block", textAlign: "center", color: "white" }}>
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;