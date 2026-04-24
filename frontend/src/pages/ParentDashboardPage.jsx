import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getParentDashboardRequest } from "../services/parent.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function ParentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ children: [], assignments: [], stats: { pendingAssignments: 0 }, signedAssignmentIds: [] });
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
        console.error("Erreur détaillée:", err);
        const msg = err.response?.data?.message || "Erreur de communication avec le serveur.";
        setError(`${msg} (Code: ${err.response?.status || 'Network Error'})`);
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
          marginBottom: "3rem", 
          flexWrap: "wrap", 
          justifyContent: "center" 
        }}>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.8rem 1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
             <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--primary)" }}>{data.children?.length || 0}</span>
             <span style={{ fontSize: "0.75rem", opacity: 0.6, textTransform: "uppercase", fontWeight: "bold" }}>Enfants</span>
          </div>
          <div style={{ background: data.stats?.pendingAssignments > 0 ? "rgba(217, 48, 37, 0.1)" : "rgba(52, 168, 83, 0.1)", padding: "0.8rem 1.5rem", borderRadius: "12px", border: `1px solid ${data.stats?.pendingAssignments > 0 ? '#d93025' : '#34a853'}`, display: "flex", alignItems: "center", gap: "10px" }}>
             <span style={{ fontSize: "1.2rem", fontWeight: "900", color: data.stats?.pendingAssignments > 0 ? "#d93025" : "#34a853" }}>{data.stats?.pendingAssignments || 0}</span>
             <span style={{ fontSize: "0.75rem", opacity: 0.8, textTransform: "uppercase", fontWeight: "bold", color: data.stats?.pendingAssignments > 0 ? "#d93025" : "#34a853" }}>À signer</span>
          </div>

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
          <Link to="/messages" className="btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(249, 171, 0, 0.2)", color: "#F9AB00", border: "1px solid #F9AB00", padding: "0.8rem 1.5rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Messagerie
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
                      background: "transparent", 
                      padding: "1.5rem", 
                      borderRadius: "15px", 
                      border: "3px solid rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.3s ease"
                    }}>
                      <div>
                        <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.5rem" }}>{child.matricule}</div>
                        <h3 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>{child.fullName}</h3>
                        <div style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: "2rem" }}>
                          <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            {child.school?.name || "N/A"}
                          </p>
                          <p style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "0.4rem" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            {child.classroom?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <Link to={`/notes/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          background: "#34A853", color: "white", fontWeight: "bold", padding: "0.6rem", fontSize: "0.8rem", borderRadius: "10px"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                          Notes
                        </Link>
                        <Link to={`/bulletin/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "0.6rem", fontSize: "0.8rem", borderRadius: "10px"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          Bulletin
                        </Link>
                        <Link to={`/timetable/classroom/${child.classroom?._id || child.classroom}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          background: "rgba(26, 115, 232, 0.1)", color: "#1A73E8", border: "1px solid rgba(26, 115, 232, 0.3)", padding: "0.6rem", fontSize: "0.8rem", borderRadius: "10px"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
                          Horaire
                        </Link>
                        <Link to={`/attendance/student/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          background: "rgba(249, 171, 0, 0.1)", color: "#F9AB00", border: "1px solid rgba(249, 171, 0, 0.3)", padding: "0.6rem", fontSize: "0.8rem", borderRadius: "10px"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                          Présence
                        </Link>
                        <Link to="/calendar" className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "0.6rem", fontSize: "0.8rem", borderRadius: "10px",
                          gridColumn: "1 / span 2"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          Calendrier Scolaire
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
                  data.assignments.slice(0, 3).map(a => {
                    const isSigned = data.signedAssignmentIds?.includes(a._id);
                    return (
                      <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ 
                          background: isSigned ? "rgba(52, 168, 83, 0.03)" : "transparent", 
                          padding: "1.5rem", 
                          borderRadius: "15px", 
                          border: isSigned ? "1px solid rgba(52, 168, 83, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
                          transition: "0.2s",
                          cursor: "pointer",
                          position: "relative"
                        }}
                        onMouseOver={e => e.currentTarget.style.background = isSigned ? "rgba(52, 168, 83, 0.06)" : "rgba(255,255,255,0.08)"}
                        onMouseOut={e => e.currentTarget.style.background = isSigned ? "rgba(52, 168, 83, 0.03)" : "transparent"}
                        >
                          {isSigned && (
                            <div style={{ position: "absolute", top: "15px", right: "15px", color: "#34A853" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                          )}
                          <h4 style={{ color: isSigned ? "#34A853" : "var(--primary)", marginBottom: "0.5rem" }}>{a.subject}</h4>
                          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{a.title}</p>
                          <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1rem" }}>{a.description.substring(0, 100)}...</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                            <span style={{ fontSize: "0.7rem", color: isSigned ? "#34A853" : "var(--primary)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                              {isSigned ? "Signé" : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                                  Signer
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
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