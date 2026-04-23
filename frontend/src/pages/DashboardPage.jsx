import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();

  // Données fictives pour les statistiques
  const stats = [
    { label: "Élèves", value: 1250, color: "#34A853", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
    { label: "Écoles", value: 48, color: "#0066cc", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    { label: "Devoirs", value: 850, color: "#F9AB00", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Taux de réussite", value: "92%", color: "#9b59b6", icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" }
  ];

  return (
    <>
      <Navbar />
      <main className="container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start",
        paddingTop: "5vh",
        minHeight: "80vh",
        textAlign: "center" 
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>Tableau de Bord</h1>
        <p style={{ opacity: 0.6, marginBottom: "3rem" }}>Bienvenue, <strong>{user?.fullName}</strong>. Voici l'état de votre réseau.</p>

        {/* Section Stats Visuelles */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1.5rem", 
          width: "100%", 
          maxWidth: "1100px",
          marginBottom: "4rem"
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ 
              background: "rgba(255,255,255,0.03)", 
              padding: "1.5rem", 
              borderRadius: "20px", 
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "20px"
            }}>
              <div style={{ 
                background: `${s.color}20`, 
                color: s.color, 
                width: "50px", 
                height: "50px", 
                borderRadius: "12px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon}></path>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</h4>
                <p style={{ fontSize: "1.8rem", fontWeight: "900" }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Graphique SVG simple - Tendance Inscriptions */}
        <div style={{ 
          width: "100%", 
          maxWidth: "1100px", 
          background: "rgba(255,255,255,0.03)", 
          padding: "2rem", 
          borderRadius: "30px", 
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "4rem",
          textAlign: "left"
        }}>
          <h3 style={{ marginBottom: "2rem", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Tendance des Inscriptions (7 derniers mois)
          </h3>
          <div style={{ height: "200px", width: "100%", display: "flex", alignItems: "flex-end", gap: "15px", paddingBottom: "20px" }}>
            {[40, 65, 45, 90, 75, 120, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ 
                  width: "100%", 
                  height: `${h}px`, 
                  background: i === 5 ? "var(--primary)" : "rgba(255,255,255,0.1)", 
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }} 
                onMouseOver={e => e.currentTarget.style.background = "var(--primary)"}
                onMouseOut={e => e.currentTarget.style.background = i === 5 ? "var(--primary)" : "rgba(255,255,255,0.1)"}
                ></div>
                <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Actions Rapides */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          margin: "2rem 0", 
          flexWrap: "wrap", 
          justifyContent: "center" 
        }}>
          <Link to="/students" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(52, 168, 83, 0.2)", color: "#34A853", border: "1px solid #34A853", padding: "0.8rem 1.5rem", fontSize: "0.9rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
            Inscrire un Élève
          </Link>
          <Link to="/assignments" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(26, 115, 232, 0.2)", color: "#1A73E8", border: "1px solid #1A73E8", padding: "0.8rem 1.5rem", fontSize: "0.9rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
            </svg>
            Publier un Devoir
          </Link>
          <Link to="/communications" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(249, 171, 0, 0.2)", color: "#F9AB00", border: "1px solid #F9AB00", padding: "0.8rem 1.5rem", fontSize: "0.9rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
            </svg>
            Envoyer un Message
          </Link>
          {user?.role === "super_admin" && (
            <Link to="/schools" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(155, 89, 182, 0.2)", color: "#9b59b6", border: "1px solid #9b59b6", padding: "0.8rem 1.5rem", fontSize: "0.9rem" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Gérer les Écoles
            </Link>
          )}
        </div>

        <div className="grid" style={{ 
          justifyContent: "center", 
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "stretch"
        }}>
          {user?.role === "super_admin" && (
            <Link to="/schools" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
              <Card title="Gestion des Écoles" style={{ height: "100%", width: "100%" }}>
                <p>Validez les inscriptions et gérez les établissements partenaires.</p>
              </Card>
            </Link>
          )}
          <Link to="/students" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
            <Card title="Gestion des Élèves" style={{ height: "100%", width: "100%" }}>
              <p>Accédez à la liste et inscrivez de nouveaux élèves.</p>
            </Card>
          </Link>
          <Link to="/parents" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
            <Card title="Gestion des Parents" style={{ height: "100%", width: "100%" }}>
              <p>Reliez les comptes parents aux élèves inscrits.</p>
            </Card>
          </Link>
          <Link to="/assignments" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
            <Card title="Gestion des Devoirs" style={{ height: "100%", width: "100%" }}>
              <p>Publiez et suivez les leçons pour vos classes.</p>
            </Card>
          </Link>
          <Link to="/communications" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
            <Card title="Communications" style={{ height: "100%", width: "100%" }}>
              <p>Consultez les communiqués et les convocations.</p>
            </Card>
          </Link>
        </div>
      </main>
    </>
  );
}

export default DashboardPage;