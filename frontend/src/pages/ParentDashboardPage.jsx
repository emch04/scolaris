import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getParentDashboardRequest } from "../services/parent.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function ParentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ children: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await getParentDashboardRequest();
        if (response?.success) {
          setData(response.data);
        } else {
          setError("Impossible de charger vos données.");
        }
      } catch (err) {
        setError("Erreur de communication avec le serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchParentData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Espace Parent
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Bienvenue, <strong>{user?.fullName}</strong>. Suivez les progrès de vos enfants.</p>
        </div>

        {/* Section Actions Rapides Parent */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          marginBottom: "4rem", 
          flexWrap: "wrap", 
          justifyContent: "center" 
        }}>
          <Link to="/communications" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(26, 115, 232, 0.2)", color: "#1A73E8", border: "1px solid #1A73E8", padding: "0.8rem 1.5rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
            </svg>
            Communications
          </Link>
          <Link to="/devoirs" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(52, 168, 83, 0.2)", color: "#34A853", border: "1px solid #34A853", padding: "0.8rem 1.5rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Espace Devoirs
          </Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "rgba(217, 48, 37, 0.05)", borderRadius: "20px", border: "1px solid var(--danger)" }}>
            <p className="error-text">{error}</p>
          </div>
        ) : (
          <>
            <section style={{ marginBottom: "4rem" }}>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Mes Enfants
              </h2>
              <div className="grid">
                {data.children && data.children.length > 0 ? (
                  data.children.map(child => (
                    <div key={child._id} style={{ 
                      background: "rgba(255, 255, 255, 0.05)", 
                      padding: "2rem", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      position: "relative",
                      transition: "transform 0.3s ease"
                    }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{child.matricule}</div>
                      <h3 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>{child.fullName}</h3>
                      <div style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: "2rem" }}>
                        <p>🏫 {child.school?.name || "N/A"}</p>
                        <p>📚 {child.classroom?.name || "N/A"}</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link to={`/notes/${child._id}`} className="btn" style={{ 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          background: "#34A853", 
                          color: "white", 
                          fontWeight: "bold",
                          padding: "0.8rem"
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                          Suivi des Notes
                        </Link>
                        <Link to={`/bulletin/${child._id}`} className="btn" style={{ 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          background: "rgba(255,255,255,0.1)", 
                          color: "white", 
                          border: "1px solid rgba(255,255,255,0.2)",
                          padding: "0.8rem"
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          Bulletin de Notes
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", opacity: 0.5 }}>
                    <p>Aucun enfant n'est actuellement rattaché à votre compte.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Derniers Devoirs
              </h2>
              <div className="grid">
                {data.assignments && data.assignments.length > 0 ? (
                  data.assignments.slice(0, 3).map(a => (
                    <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ 
                        background: "rgba(255, 255, 255, 0.03)", 
                        padding: "1.5rem", 
                        borderRadius: "15px", 
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "0.2s",
                        cursor: "pointer"
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      >
                        <h4 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>{a.subject}</h4>
                        <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{a.title}</p>
                        <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1rem" }}>{a.description.substring(0, 100)}...</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold" }}>✍️ Signer</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p style={{ opacity: 0.5 }}>Aucun devoir récent.</p>
                )}
              </div>
              {data.assignments?.length > 3 && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <Link to="/devoirs" style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.9rem" }}>
                    Voir tous les devoirs →
                  </Link>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default ParentDashboardPage;