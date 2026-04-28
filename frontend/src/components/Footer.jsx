import { Link } from "react-router-dom";

/**
 * Footer.jsx
 * Rôle : Pied de page informatif.
 * Contient les informations de contact, les liens sociaux et la navigation secondaire.
 * Reflète l'identité visuelle moderne de Scolaris.
 */
function Footer() {
  return (
    <footer style={{ 
      background: "rgba(0, 0, 0, 0.4)", 
      backdropFilter: "blur(15px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      padding: "clamp(3rem, 10vw, 5rem) 1.5rem 2rem",
      marginTop: "auto"
    }}>
      <div className="container" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
        gap: "clamp(2rem, 5vw, 4rem)",
        marginBottom: "3rem"
      }}>
        {/* Colonne 1 : Identité & Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              background: "white", 
              width: "35px", 
              height: "35px", 
              borderRadius: "10px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0
            }}>
              <img src="/assets/image.jpg" alt="Scolaris" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--white)", letterSpacing: "-0.5px" }}>Scolaris</span>
          </div>
          <p style={{ opacity: 0.6, lineHeight: "1.6", fontSize: "0.9rem", margin: 0 }}>
            L'outil indispensable pour une école moderne et connectée. 
            Une création signée <strong>Emmanouch KONGO BOLA</strong>.
          </p>
          
          {/* Icônes Sociales */}
          <div style={{ display: "flex", gap: "0.8rem" }}>
            {[
              { id: 'fb', icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { id: 'tw', icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.48 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
              { id: 'wa', icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.328-.884-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.149-.471-1.138-.646-1.558-.171-.41-.338-.354-.471-.354-.122-.005-.262-.006-.403-.006s-.369.053-.561.25c-.193.198-.737.72-.737 1.755s.752 2.035.856 2.184c.105.15 1.48 2.259 3.585 3.166.5.216.89.345 1.196.44.502.159.958.137 1.319.07.402-.075 1.758-.72 2.03-1.414.272-.694.272-1.29.19-1.414-.083-.124-.272-.198-.57-.347zM12.002 21.003c-1.63 0-3.224-.436-4.614-1.261l-4.888 1.282 1.305-4.762c-.903-1.564-1.378-3.342-1.378-5.161 0-5.733 4.665-10.398 10.398-10.398 2.778 0 5.39 1.082 7.351 3.044s3.044 4.574 3.044 7.354c0 5.733-4.665 10.398-10.398 10.398zm8.568-17.766C18.431 1.102 15.347 0 12.002 0 5.385 0 0 5.385 0 12.002c0 2.114.55 4.178 1.594 5.992L0 24l6.155-1.614c1.764.961 3.754 1.468 5.845 1.468 6.617 0 12.002-5.385 12.002-12.002 0-3.197-1.244-6.202-3.502-8.461z" }
            ].map(social => (
              <a key={social.id} href="#" style={{ 
                width: "35px", 
                height: "35px", 
                borderRadius: "10px", 
                background: "rgba(255,255,255,0.06)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                transition: "all 0.3s ease",
                color: "white"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.icon}></path>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div>
          <h4 style={{ marginBottom: "1.2rem", fontSize: "1rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.9rem" }}>
            <li><Link to="/" style={{ color: "white", opacity: 0.6, textDecoration: "none" }}>Accueil</Link></li>
            <li><Link to="/guide" style={{ color: "white", opacity: 0.6, textDecoration: "none" }}>Guide</Link></li>
            <li><Link to="/register-school" style={{ color: "white", opacity: 0.6, textDecoration: "none" }}>Inscrire une École</Link></li>
            <li><Link to="/devoirs" style={{ color: "white", opacity: 0.6, textDecoration: "none" }}>Espace Devoirs</Link></li>
            <li><Link to="/contact" style={{ color: "white", opacity: 0.6, textDecoration: "none" }}>Contact</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact Direct */}
        <div>
          <h4 style={{ marginBottom: "1.2rem", fontSize: "1rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>Scolaris Global - Support</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", opacity: 0.6 }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "3px", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Quartier Kingasani, N'djili
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +243 81 234 56 78
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              contact@scolaris.cd
            </li>
          </ul>
        </div>
      </div>

      {/* Barre Inférieure : Droits & Légales */}
      <div style={{ 
        borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
        paddingTop: "1.5rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: "0.75rem",
        opacity: 0.4
      }}>
        <p style={{ margin: 0 }}>&copy; 2026 Scolaris. Tous droits réservés.</p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/privacy" style={{ color: "white", textDecoration: "none" }}>Confidentialité</Link>
          <Link to="/terms" style={{ color: "white", textDecoration: "none" }}>Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
