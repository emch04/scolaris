import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ 
      background: "rgba(0, 0, 0, 0.3)", 
      backdropFilter: "blur(10px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      padding: "5rem 1.5rem 2rem",
      marginTop: "auto"
    }}>
      <div className="container" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "4rem",
        marginBottom: "4rem"
      }}>
        {/* Colonne 1: Brand & Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              <img src="/assets/image.png" alt="Scolaris" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--white)" }}>Scolaris</span>
          </div>
          <p style={{ opacity: 0.6, lineHeight: "1.6", fontSize: "0.95rem" }}>
            La plateforme d'excellence pour la gestion scolaire en République Démocratique du Congo. 
            Connecter les esprits, bâtir l'avenir.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            {/* Social Icons Placeholders */}
            {["facebook", "twitter", "instagram", "linkedin"].map(social => (
              <div key={social} style={{ 
                width: "35px", 
                height: "35px", 
                borderRadius: "50%", 
                background: "rgba(255,255,255,0.05)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--primary)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                <div style={{ width: "15px", height: "15px", background: "white", borderRadius: "2px", opacity: 0.8 }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne 2: Liens Rapides */}
        <div>
          <h4 style={{ marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: "700" }}>Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li><Link to="/" style={{ color: "white", opacity: 0.6, transition: "0.3s" }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.6}>Accueil</Link></li>
            <li><Link to="/register-school" style={{ color: "white", opacity: 0.6, transition: "0.3s" }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.6}>Inscrire mon École</Link></li>
            <li><Link to="/devoirs" style={{ color: "white", opacity: 0.6, transition: "0.3s" }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.6}>Espace Devoirs</Link></li>
            <li><Link to="/contact" style={{ color: "white", opacity: 0.6, transition: "0.3s" }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.6}>Contact</Link></li>
            <li><Link to="/login" style={{ color: "white", opacity: 0.6, transition: "0.3s" }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.6}>Connexion</Link></li>
          </ul>
        </div>

        {/* Colonne 3: Contact */}
        <div>
          <h4 style={{ marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: "700" }}>Contact</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.2rem", fontSize: "0.95rem", opacity: 0.6 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Quartier Kingasani, N'djili, Kinshasa, RDC
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +243 81 234 56 78
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              contact@scolaris.cd
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ 
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
        paddingTop: "2rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: "0.85rem",
        opacity: 0.4
      }}>
        <p>&copy; 2026 Scolaris - Système de Gestion Scolaire. Tous droits réservés.</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link to="/privacy" style={{ color: "white" }}>Confidentialité</Link>
          <Link to="/terms" style={{ color: "white" }}>Conditions d'utilisation</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;