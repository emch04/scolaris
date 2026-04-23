import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start",
        paddingTop: "8vh",
        minHeight: "80vh",
        textAlign: "center" 
      }}>
        <h1>Tableau de Bord</h1>
        <p>Bienvenue, <strong>{user?.fullName}</strong>.</p>

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
        </div>

        <div className="grid" style={{ 
          justifyContent: "center", 
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "stretch"
        }}>
          <Link to="/students" style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
            <Card title="Gestion des Élèves" style={{ height: "100%", width: "100%" }}>
              <p>Accédez à la liste et inscrivez de nouveaux élèves.</p>
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