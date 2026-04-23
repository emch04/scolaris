import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentDashboardRequest } from "../services/student.api";
import formatDate from "../utils/formatDate";
import useAuth from "../hooks/useAuth";

function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboardRequest()
      .then(res => setData(res?.data))
      .catch(err => console.error("Erreur dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loader /></>;
  if (!data) return <><Navbar /><div className="container">Erreur de chargement des données.</div></>;

  const { student, assignments, results, communications } = data;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        
        {/* Header Profil */}
        <div style={{ 
          background: "linear-gradient(135deg, var(--primary) 0%, #004d99 100%)", 
          borderRadius: "25px", 
          padding: "3rem", 
          color: "white", 
          marginBottom: "3rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Bonjour, {student.fullName} !</h1>
          <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
            {student.classroom?.name} • {student.school?.name}
          </p>
          <div style={{ marginTop: "1.5rem", display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "5px 15px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: "bold" }}>
            Matricule : {student.matricule}
          </div>
        </div>

        {/* Section Communications (Nouvelle) */}
        {/* Actions Rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          <Link to={`/chat/${user.classroom}`} className="btn" style={{ background: "var(--primary)", padding: "1.5rem", borderRadius: "20px", textAlign: "center", color: "white", fontWeight: "bold" }}>
             Discussion de Classe
          </Link>
          <Link to="/library" className="btn" style={{ background: "rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "20px", textAlign: "center", color: "white", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.2)" }}>
             Bibliothèque
          </Link>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem" }}>Dernières Communications</h2>
            <Link to="/communications" style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: "600" }}>Tout voir →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {communications && communications.length > 0 ? (
              communications.slice(0, 3).map(c => (
                <div key={c._id} style={{ 
                  padding: "1.5rem", 
                  borderRadius: "20px", 
                  border: "3px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(255, 255, 255, 0.03)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ 
                      fontSize: "0.6rem", 
                      padding: "2px 8px", 
                      borderRadius: "4px", 
                      background: c.type === "convocation" ? "#ff5252" : "#0066cc",
                      textTransform: "uppercase",
                      fontWeight: "bold"
                    }}>
                      {c.type}
                    </span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <h4 style={{ marginBottom: "0.8rem" }}>{c.title}</h4>
                  <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "0" }}>{c.content.substring(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.5 }}>Aucune communication récente.</p>
            )}
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem" }}>
          
          {/* Colonne : Devoirs récents */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Mes Devoirs</h2>
              <Link to="/devoirs" style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: "600" }}>Tout voir →</Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {assignments.length === 0 ? (
                <p style={{ opacity: 0.5 }}>Aucun devoir pour le moment.</p>
              ) : (
                assignments.slice(0, 5).map(a => (
                  <Link key={a._id} to={`/assignment/${a._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ padding: "1.5rem", borderRadius: "15px", border: "3px solid rgba(255, 255, 255, 0.1)", transition: "0.2s" }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "5px" }}>{a.subject}</div>
                      <h4 style={{ marginBottom: "5px" }}>{a.title}</h4>
                      <p style={{ fontSize: "0.85rem", opacity: 0.5 }}>Par {a.teacher?.fullName} • {formatDate(a.createdAt)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Colonne : Résultats récents */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Mes Notes</h2>
              <Link to={`/bulletin/${student._id}`} style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: "600" }}>Voir mon bulletin →</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.length === 0 ? (
                <p style={{ opacity: 0.5 }}>Pas encore de notes enregistrées.</p>
              ) : (
                results.slice(0, 5).map((r, i) => (
                  <div key={i} style={{ padding: "1.2rem", borderRadius: "15px", border: "3px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{r.subject}</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{r.period}</div>
                    </div>
                    <div style={{ background: r.score >= (r.maxScore / 2) ? "rgba(52, 168, 83, 0.1)" : "rgba(217, 48, 37, 0.1)", color: r.score >= (r.maxScore / 2) ? "#34A853" : "#D93025", padding: "8px 15px", borderRadius: "10px", fontWeight: "bold" }}>
                      {r.score} / {r.maxScore}
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
