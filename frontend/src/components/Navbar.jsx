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

  const role = user?.role;

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
            <img src="/assets/android-chrome-512x512.png" alt="S" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "4px" }} />
          </div>
          <span className="brand-text" style={{ fontSize: "1.3rem", fontWeight: "900" }}>Scolaris</span>
        </Link>
        
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            {isDarkMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>}
          </button>

          {isAuthenticated && (
            <button className="user-badge hide-on-mobile" onClick={handleLogout} style={{ fontSize: "0.8rem", padding: "6px 12px", background: "rgba(255,255,255,0.1)", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>
              <div style={{ width: "8px", height: "8px", background: role === 'hero_admin' ? '#ff5252' : '#34A853', borderRadius: "50%" }}></div>
              <span style={{ fontWeight: "600" }}>{user?.fullName?.split(' ')[0]}</span>
            </button>
          )}

          <button className="navbar-toggle" onClick={toggleMenu} style={{ padding: "10px", marginRight: "-10px" }}>
            <span className={isOpen ? "icon open" : "icon"}></span>
          </button>
        </div>

        <div className={isOpen ? "nav-links active" : "nav-links"} style={{ backdropFilter: "blur(20px)", background: "rgba(10, 10, 10, 0.95)", display: "flex", flexDirection: "column", padding: "2rem 0" }}>
          {isAuthenticated && (
            <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Espace Scolaris</div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                {user?.fullName} 
                {role === 'hero_admin' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M19 16v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3"></path></svg>
                )}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold" }}>{role?.replace('_', ' ')}</div>
            </div>
          )}

          <Link to="/" onClick={closeMenu}>Accueil</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>Tableau de Bord</Link>
              
              {["hero_admin", "super_admin", "admin", "director", "secretary"].includes(role) && (
                <>
                  <Link to="/treasury" onClick={closeMenu} style={{ color: "#34A853", fontWeight: "bold" }}>💰 Trésorerie</Link>
                  <Link to="/students" onClick={closeMenu}>Élèves</Link>
                  <Link to="/classrooms" onClick={closeMenu}>Classes</Link>
                  <Link to="/parents" onClick={closeMenu}>Parents</Link>
                </>
              )}

              {["hero_admin", "super_admin"].includes(role) && <Link to="/schools" onClick={closeMenu}>Écoles</Link>}
              {["hero_admin", "admin", "director"].includes(role) && <Link to="/teachers" onClick={closeMenu}>Personnel</Link>}
              
              {role === "hero_admin" && (
                <>
                  <Link to="/blackbox" onClick={closeMenu} style={{ color: "#00C851", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                    Centre IA
                  </Link>
                  <Link to="/logs" onClick={closeMenu} style={{ color: "#ff5252" }}>🚨 Surveillance</Link>
                  <Link to="/system-settings" onClick={closeMenu}>Paramètres</Link>
                </>
              )}

              <Link to="/messages" onClick={closeMenu}>Messagerie</Link>

              <div style={{ marginTop: "auto", padding: "1rem 1.5rem" }}>
                <button onClick={handleLogout} style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#ff5252", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "1rem 1.5rem" }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "12px" }}>Connexion</Link>
            </div>
          )}
        </div>
      </div>
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;
