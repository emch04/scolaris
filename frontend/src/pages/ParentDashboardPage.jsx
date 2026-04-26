/**
 * @file ParentDashboardPage.jsx
 * @description Tableau de bord spécifique pour les parents, affichant le suivi de leurs enfants.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getParentDashboardRequest } from "../services/parent.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function ParentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(`parent_cache_${user?.id}`);
    const defaultData = { children: [], assignments: [], stats: { pendingAssignments: 0 }, signedAssignmentIds: [] };
    return cached ? JSON.parse(cached) : defaultData;
  });
  const [loading, setLoading] = useState(!localStorage.getItem(`parent_cache_${user?.id}`));
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      const response = await getParentDashboardRequest();
      if (response?.success) {
        setData(response.data);
        localStorage.setItem(`parent_cache_${user?.id}`, JSON.stringify(response.data));
        setError("");
        setIsOnline(true);
      } else {
        setError("Impossible de charger vos données.");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err);
      if (!err.response) {
        setIsOnline(false);
      }
      if (!data.children.length) {
        const msg = err.response?.data?.message || "Erreur de connexion.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
    const interval = setInterval(fetchParentData, 30000); // Polling toutes les 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1rem 1.5rem" }}>
        {/* Status de connexion */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: "8px", 
          marginTop: "0.5rem",
          alignItems: "center"
        }}>
          <span style={{ 
            padding: "4px 10px", 
            borderRadius: "20px", 
            fontSize: "0.6rem", 
            background: isOnline ? "rgba(52, 168, 83, 0.1)" : "rgba(234, 67, 53, 0.1)",
            color: isOnline ? "#34A853" : "#EA4335",
            border: `1px solid ${isOnline ? "#34A85340" : "#EA433540"}`,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "bold",
            textTransform: "uppercase"
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: isOnline ? "#34A853" : "#EA4335" }}></div>
            {isOnline ? "Online" : "Offline"}
          </span>

          <button 
            onClick={fetchParentData}
            disabled={loading || !isOnline}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              cursor: "pointer",
              padding: "5px 12px",
              borderRadius: "10px",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: isOnline ? 1 : 0.5
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
              <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span className="hide-on-mobile">{loading ? "" : "Sync"}</span>
          </button>
        </div>

        <div style={{ textAlign: "center", padding: "1rem 0 1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: "1.1" }}>
            Espace Parent
          </h1>
          <p style={{ opacity: 0.6, fontSize: "clamp(0.85rem, 4vw, 1rem)", marginTop: "0.5rem" }}>Tableau de bord de <strong>{user?.fullName}</strong></p>
        </div>

        {/* Section Actions Rapides Parent */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.8rem", 
          marginBottom: "2rem"
        }}>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.8rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
             <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--primary)" }}>{data.children?.length || 0}</span>
             <span style={{ fontSize: "0.6rem", opacity: 0.6, textTransform: "uppercase", fontWeight: "bold" }}>Enfants</span>
          </div>
          <div style={{ background: data.stats?.pendingAssignments > 0 ? "rgba(217, 48, 37, 0.1)" : "rgba(52, 168, 83, 0.1)", padding: "0.8rem", borderRadius: "12px", border: `1px solid ${data.stats?.pendingAssignments > 0 ? '#d93025' : '#34a853'}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
             <span style={{ fontSize: "1.2rem", fontWeight: "900", color: data.stats?.pendingAssignments > 0 ? "#d93025" : "#34a853" }}>{data.stats?.pendingAssignments || 0}</span>
             <span style={{ fontSize: "0.6rem", opacity: 0.8, textTransform: "uppercase", fontWeight: "bold", color: data.stats?.pendingAssignments > 0 ? "#d93025" : "#34a853" }}>Devoirs à signer</span>
          </div>

          <Link to="/communications" className="btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(26, 115, 232, 0.15)", color: "#1A73E8", border: "1px solid rgba(26, 115, 232, 0.3)", padding: "0.8rem", fontSize: "0.8rem", borderRadius: "12px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
            Comms
          </Link>
          <Link to="/messages" className="btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(249, 171, 0, 0.15)", color: "#F9AB00", border: "1px solid rgba(249, 171, 0, 0.3)", padding: "0.8rem", fontSize: "0.8rem", borderRadius: "12px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Messages
          </Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ textAlign: "center", padding: "2rem", background: "rgba(217, 48, 37, 0.05)", borderRadius: "15px", border: "1px solid var(--danger)" }}>
            <p style={{ fontSize: "0.9rem", color: "#ff5252", margin: 0 }}>{error}</p>
          </div>
        ) : (
          <>
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                Mes Enfants
              </h2>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {data.children && data.children.length > 0 ? (
                  data.children.map(child => (
                    <div key={child._id} style={{ 
                      background: "rgba(255,255,255,0.02)", 
                      padding: "1.2rem", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{child.fullName}</h3>
                          <p style={{ margin: "2px 0 0", fontSize: "0.7rem", opacity: 0.4, fontWeight: "bold" }}>{child.matricule}</p>
                        </div>
                        <div style={{ background: "rgba(26, 115, 232, 0.1)", color: "var(--primary)", padding: "3px 8px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: "bold" }}>{child.classroom?.name}</div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "0.5rem" }}>
                        <Link to={`/notes/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: "#34A853", color: "white", padding: "8px", fontSize: "0.75rem", borderRadius: "8px", fontWeight: "bold"
                        }}>
                          Notes
                        </Link>
                        <Link to={`/bulletin/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: "rgba(255,255,255,0.08)", color: "white", padding: "8px", fontSize: "0.75rem", borderRadius: "8px"
                        }}>
                          Bulletin
                        </Link>
                        <Link to={`/timetable/classroom/${child.classroom?._id || child.classroom}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: "rgba(26, 115, 232, 0.08)", color: "#1A73E8", padding: "8px", fontSize: "0.75rem", borderRadius: "8px"
                        }}>
                          Horaire
                        </Link>
                        <Link to={`/attendance/student/${child._id}`} className="btn" style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          background: "rgba(249, 171, 0, 0.08)", color: "#F9AB00", padding: "8px", fontSize: "0.75rem", borderRadius: "8px"
                        }}>
                          Présence
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", gridColumn: "1/-1", opacity: 0.4, padding: "2rem", fontSize: "0.9rem" }}>Aucun enfant lié.</p>
                )}
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
                Devoirs Récents
              </h2>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {data.assignments && data.assignments.length > 0 ? (
                  data.assignments.slice(0, 3).map(a => {
                    const isSigned = data.signedAssignmentIds?.includes(a._id);
                    return (
                      <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ 
                          background: isSigned ? "rgba(52, 168, 83, 0.03)" : "rgba(255,255,255,0.01)", 
                          padding: "1rem", 
                          borderRadius: "16px", 
                          border: `1px solid ${isSigned ? 'rgba(52, 168, 83, 0.2)' : 'rgba(255,255,255,0.08)'}`,
                          position: "relative"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <h4 style={{ color: isSigned ? "#34A853" : "var(--primary)", margin: 0, fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase" }}>{a.subject}</h4>
                            {isSigned && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                          </div>
                          <p style={{ fontWeight: "700", fontSize: "0.95rem", margin: "2px 0 5px 0" }}>{a.title}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <span style={{ fontSize: "0.65rem", opacity: 0.4 }}>{formatDate(a.createdAt)}</span>
                            {!isSigned && <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold" }}>Signer →</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p style={{ opacity: 0.4, fontSize: "0.9rem" }}>Aucun devoir récent.</p>
                )}
              </div>
              {data.assignments?.length > 3 && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <Link to="/devoirs" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: "bold" }}>Voir tous les devoirs</Link>
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