import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "85vh",
        textAlign: "center" 
      }}>
        <div style={{ maxWidth: "800px" }}>
          <img 
            src="/assets/image.png" 
            alt="Scolaris Logo" 
            style={{ width: "500px", maxWidth: "90%", borderRadius: "30px", marginBottom: "2rem" }} 
          />
          
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "1rem", lineHeight: "1.2" }}>
            L'excellence éducative au bout des doigts
          </h1>
          
          <p style={{ fontSize: "1.2rem", opacity: 0.8, marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            Scolaris simplifie la gestion des établissements scolaires, le suivi des élèves et la diffusion des savoirs.
          </p>
          
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: "1.2rem 2.5rem", fontSize: "1.1rem" }}>
              Espace Personnel
            </Link>
            <Link to="/devoirs" className="btn" style={{ 
              background: "rgba(255,255,255,0.1)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              padding: "1.2rem 2.5rem", 
              fontSize: "1.1rem",
              color: "white"
            }}>
              Consulter les devoirs
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", width: "100%", maxWidth: "1000px" }}>
          <div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--primary)" }}>Suivi des Élèves</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>Gestion complète des inscriptions et des matricules.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--primary)" }}>Devoirs & Leçons</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>Diffusion rapide des supports pédagogiques.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--primary)" }}>Communications</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>Communiqués et convocations en temps réel.</p>
          </div>
        </div>
      </main>
    </>
  );
}
export default HomePage;
