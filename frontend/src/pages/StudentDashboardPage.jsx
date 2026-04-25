/**
 * @file StudentDashboardPage.jsx
 * @description Tableau de bord personnalisé pour les élèves.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentDashboardRequest } from "../services/student.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(`student_cache_${user?.id}`);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!data);
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

  const fetchDashboardData = () => {
    if (!navigator.onLine && data) return;
    
    setLoading(true);
    getStudentDashboardRequest()
      .then(res => {
        if (res?.data) {
          setData(res.data);
          localStorage.setItem(`student_cache_${user?.id}`, JSON.stringify(res.data));
        }
      })
      .catch(err => console.error("Erreur dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) return <><Navbar /><Loader /></>;
  if (!data) return <><Navbar /><div className="container">Erreur de chargement des données.</div></>;

  const { student, assignments, results, communications } = data;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1rem 1.5rem" }}>
        
        {/* Status de connexion */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: "8px", 
          marginBottom: "0.5rem",
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
            fontWeight: "bold"
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: isOnline ? "#34A853" : "#EA4335" }}></div>
            {isOnline ? "Online" : "Offline"}
          </span>

          <button 
            onClick={fetchDashboardData}
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
              gap: "6px"
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
              <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span className="hide-on-mobile">{loading ? "" : "Sync"}</span>
          </button>
        </div>
        
        {/* Header Profil */}
        <div style={{ 
          background: "linear-gradient(135deg, var(--primary) 0%, #004d99 100%)", 
          borderRadius: "25px", 
          padding: "clamp(1.5rem, 5vw, 2.5rem)", 
          color: "white", 
          marginBottom: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 6vw, 2.2rem)", marginBottom: "0.3rem", fontWeight: "800" }}>Salut, {student.fullName} !</h1>
          <p style={{ opacity: 0.9, fontSize: "clamp(0.85rem, 4vw, 1rem)", margin: 0 }}>
            {student.classroom?.name} • {student.school?.name}
          </p>
          <div style={{ marginTop: "1rem", display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "bold" }}>
            ID : {student.matricule}
          </div>
        </div>

        {/* Actions Rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.8rem", marginBottom: "2rem" }}>
          <Link to={`/chat/${user.classroom}`} className="btn" style={{ background: "var(--primary)", padding: "1.2rem 0.8rem", borderRadius: "16px", textAlign: "center", color: "white", fontWeight: "bold", fontSize: "0.9rem" }}>
             Discussion
          </Link>
          <Link to="/library" className="btn" style={{ background: "rgba(255,255,255,0.05)", padding: "1.2rem 0.8rem", borderRadius: "16px", textAlign: "center", color: "white", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.9rem" }}>
             Bibliothèque
          </Link>
        </div>

        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Communications</h2>
            <Link to="/communications" style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: "bold" }}>Tout voir</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {communications && communications.length > 0 ? (
              communications.slice(0, 2).map(c => (
                <div key={c._id} style={{ 
                  padding: "1rem", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "rgba(255, 255, 255, 0.02)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.55rem", padding: "2px 6px", borderRadius: "4px", background: c.type === "convocation" ? "#ff5252" : "var(--primary)", fontWeight: "900", textTransform: "uppercase" }}>{c.type}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.4 }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <h4 style={{ margin: "5px 0", fontSize: "0.95rem", fontWeight: "700" }}>{c.title}</h4>
                  <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>{c.content.substring(0, 80)}...</p>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.4, fontSize: "0.9rem" }}>Aucun message.</p>
            )}
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Mes Devoirs</h2>
              <Link to="/devoirs" style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: "bold" }}>Voir tout</Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {assignments.length === 0 ? (
                <p style={{ opacity: 0.4, fontSize: "0.9rem" }}>Aucun devoir.</p>
              ) : (
                assignments.slice(0, 4).map(a => (
                  <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.12)", transition: "0.2s", background: "rgba(255,255,255,0.01)" }}>
                      <div style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: "900", textTransform: "uppercase", marginBottom: "3px" }}>{a.subject}</div>
                      <h4 style={{ margin: "0 0 3px 0", fontSize: "0.95rem", fontWeight: "700" }}>{a.title}</h4>
                      <p style={{ fontSize: "0.75rem", opacity: 0.4, margin: 0 }}>Par {a.teacher?.fullName}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Mes Notes</h2>
              <Link to={`/bulletin/${student._id}`} style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: "bold" }}>Bulletin</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {results.length === 0 ? (
                <p style={{ opacity: 0.4, fontSize: "0.9rem" }}>Aucune note.</p>
              ) : (
                results.slice(0, 4).map((r, i) => (
                  <div key={i} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{r.subject}</div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.4 }}>{r.period}</div>
                    </div>
                    <div style={{ background: r.score >= (r.maxScore / 2) ? "rgba(52, 168, 83, 0.15)" : "rgba(217, 48, 37, 0.15)", color: r.score >= (r.maxScore / 2) ? "#34A853" : "#D93025", padding: "5px 12px", borderRadius: "8px", fontWeight: "900", fontSize: "0.9rem" }}>
                      {r.score}/{r.maxScore}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default StudentDashboardPage;
