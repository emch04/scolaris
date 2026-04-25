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

function GradesPage() {
  const { studentId } = useParams();
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentBulletinRequest(studentId);
        const data = response?.data || [];
        setResults(data);
        
        if (data.length > 0 && data[0].student) {
          setStudent(data[0].student);
        } else {
          const studentRes = await getStudentsRequest();
          setStudent(studentRes?.data?.find(s => s._id === studentId));
        }
      } catch (err) {
        console.error("Erreur de chargement");
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
      <main className="container">
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>Suivi des Notes</h1>
            <p style={{ opacity: 0.6 }}>Tableau récapitulatif annuel de <strong>{student?.fullName}</strong></p>
          </div>
          <Link to={`/bulletin/${studentId}`} className="btn btn-primary" style={{ fontSize: "0.8rem" }}>
            Voir le Bulletin Officiel →
          </Link>
        </div>

        <div style={{ 
          background: "transparent", 
          borderRadius: "20px", 
          border: "3px solid rgba(255, 255, 255, 0.1)", 
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "white", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.08)" }}>
                <th style={{ padding: "1.5rem", fontSize: "1rem" }}>Matières</th>
                {periods.map(p => (
                  <th key={p} style={{ padding: "1.5rem", textAlign: "center" }}>{p}</th>
                ))}
                <th style={{ padding: "1.5rem", textAlign: "center", background: "rgba(26, 115, 232, 0.1)" }}>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? subjects.map(subject => {
                // Calcul de la moyenne pour la ligne
                const scores = results.filter(r => r.subject === subject);
                const avg = (scores.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 20), 0) / scores.length).toFixed(1);

                return (
                  <tr key={subject} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "1.2rem", fontWeight: "600" }}>{subject}</td>
                    {periods.map(p => (
                      <td key={p} style={{ padding: "1.2rem", textAlign: "center", opacity: getScore(subject, p) === "-" ? 0.3 : 1 }}>
                        {getScore(subject, p)}
                      </td>
                    ))}
                    <td style={{ padding: "1.2rem", textAlign: "center", fontWeight: "bold", color: avg >= 10 ? "#34A853" : "#D93025", background: "rgba(255, 255, 255, 0.02)" }}>
                      {avg}/20
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: "3rem", textAlign: "center", opacity: 0.5 }}>
                    Aucune note n'a été saisie pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div style={{ background: "rgba(52, 168, 83, 0.1)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(52, 168, 83, 0.2)" }}>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>Meilleure Matière</p>
            <h3 style={{ margin: "0.5rem 0 0", color: "#34A853" }}>Mathématiques</h3>
          </div>
          <div style={{ background: "rgba(26, 115, 232, 0.1)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(26, 115, 232, 0.2)" }}>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>Assiduité</p>
            <h3 style={{ margin: "0.5rem 0 0", color: "#1A73E8" }}>Excellente</h3>
          </div>
        </div>
      </main>
    </>
  );
}

export default GradesPage;
