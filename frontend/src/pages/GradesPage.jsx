/**
 * @file GradesPage.jsx
 * @description Page de consultation et de saisie des notes des élèves.
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentBulletinRequest } from "../services/result.api";
import { getStudentsRequest } from "../services/student.api";
import { useToast } from "../context/ToastContext";

function GradesPage() {
  const { studentId } = useParams();
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentBulletinRequest(studentId);
        const data = response?.data || [];
        setResults(data);
        
        if (data.length > 0 && data[0].student) {
          setStudent(data[0].student);
        } else {
          // Correction de l'extraction des données paginées
          const studentRes = await getStudentsRequest(1, 100);
          const studentList = studentRes?.data?.students || studentRes?.data || [];
          setStudent(studentList.find(s => s._id === studentId));
        }
      } catch (err) {
        showToast("Erreur de chargement des notes.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <><Navbar /><Loader /></>;

  // Organiser les notes par matière
  const subjects = [...new Set(results.map(r => r.subject))];
  const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3"];

  const getScore = (subject, period) => {
    const res = results.find(r => r.subject === subject && r.period === period);
    return res ? `${res.score}/${res.maxScore}` : "-";
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)", marginBottom: "0.5rem" }}>Suivi des Notes</h1>
            <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Tableau récapitulatif annuel de <strong>{student?.fullName}</strong></p>
          </div>
          <Link to={`/bulletin/${studentId}`} className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "0.6rem 1rem" }}>
            Voir le Bulletin Officiel →
          </Link>
        </div>

        {/* Vue Tableau (Desktop) */}
        <div className="desktop-only" style={{ 
          background: "transparent", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.12)", 
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          display: window.innerWidth < 768 ? "none" : "block"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "white", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.08)" }}>
                <th style={{ padding: "1.2rem", fontSize: "0.9rem" }}>Matières</th>
                {periods.map(p => (
                  <th key={p} style={{ padding: "1.2rem", textAlign: "center", fontSize: "0.85rem" }}>{p}</th>
                ))}
                <th style={{ padding: "1.2rem", textAlign: "center", background: "rgba(26, 115, 232, 0.1)", fontSize: "0.85rem" }}>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? subjects.map(subject => {
                const scores = results.filter(r => r.subject === subject);
                const avg = (scores.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 20), 0) / scores.length).toFixed(1);

                return (
                  <tr key={subject} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "1rem 1.2rem", fontWeight: "600", fontSize: "0.9rem" }}>{subject}</td>
                    {periods.map(p => (
                      <td key={p} style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", opacity: getScore(subject, p) === "-" ? 0.3 : 1 }}>
                        {getScore(subject, p)}
                      </td>
                    ))}
                    <td style={{ padding: "1rem", textAlign: "center", fontWeight: "bold", fontSize: "0.95rem", color: avg >= 10 ? "#34A853" : "#D93025", background: "rgba(255, 255, 255, 0.02)" }}>
                      {avg}/20
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: "3rem", textAlign: "center", opacity: 0.5 }}>Aucune note.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Vue Cartes (Mobile) */}
        <div className="mobile-only" style={{ display: window.innerWidth < 768 ? "flex" : "none", flexDirection: "column", gap: "1rem" }}>
          {subjects.length > 0 ? subjects.map(subject => {
            const scores = results.filter(r => r.subject === subject);
            const avg = (scores.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 20), 0) / scores.length).toFixed(1);

            return (
              <div key={subject} style={{ 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: "15px", 
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "1.2rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{subject}</h3>
                  <div style={{ padding: "4px 10px", borderRadius: "8px", background: avg >= 10 ? "rgba(52, 168, 83, 0.2)" : "rgba(217, 48, 37, 0.2)", color: avg >= 10 ? "#34A853" : "#ff5252", fontWeight: "bold", fontSize: "0.9rem" }}>
                    {avg}/20
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {periods.map(p => (
                    <div key={p} style={{ textAlign: "center", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "10px" }}>
                      <p style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase", margin: "0 0 4px 0" }}>{p.replace("Trimestre ", "T")}</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: "bold", margin: 0, opacity: getScore(subject, p) === "-" ? 0.2 : 1 }}>{getScore(subject, p)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }) : (
            <p style={{ textAlign: "center", opacity: 0.5, padding: "2rem" }}>Aucune note disponible.</p>
          )}
        </div>

        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div style={{ background: "rgba(52, 168, 83, 0.1)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(52, 168, 83, 0.2)" }}>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>Statut Général</p>
            <h3 style={{ margin: "0.5rem 0 0", color: "#34A853" }}>{results.length > 0 ? "Évalué" : "En attente"}</h3>
          </div>
          <div style={{ background: "rgba(26, 115, 232, 0.1)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(26, 115, 232, 0.2)" }}>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>Assiduité</p>
            <h3 style={{ margin: "0.5rem 0 0", color: "#1A73E8" }}>Suivie</h3>
          </div>
        </div>
      </main>
    </>
  );
}

export default GradesPage;
