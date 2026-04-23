import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentBulletinRequest } from "../services/result.api";
import { getStudentsRequest } from "../services/student.api";

function ReportCardPage() {
  const { studentId } = useParams();
  const [allResults, setAllResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState("Trimestre 1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentBulletinRequest(studentId);
        const data = response?.data || [];
        setAllResults(data);
        
        // Si on a des résultats, l'objet student est dedans
        if (data.length > 0 && data[0].student) {
          setStudent(data[0].student);
        } else {
          // Si pas de notes, on essaie quand même de charger l'élève
          const studentRes = await getStudentsRequest();
          setStudent(studentRes?.data?.find(s => s._id === studentId));
        }
      } catch (err) {
        console.error("Erreur de chargement du bulletin");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  // Filtrer les résultats par période
  const filteredResults = allResults.filter(r => r.period === activePeriod);
  
  // Calcul de la moyenne de la période
  const average = filteredResults.length > 0 
    ? (filteredResults.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 20), 0) / filteredResults.length).toFixed(2)
    : null;

  if (loading) return <><Navbar /><Loader /></>;

  const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Examen État"];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* Header Profil Étudiant */}
        <div style={{ 
          background: "linear-gradient(135deg, #1A73E8 0%, #004d99 100%)", 
          borderRadius: "20px", 
          padding: "2.5rem", 
          color: "white", 
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold"
            }}>
              {student?.fullName?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: "1.8rem", margin: 0, color: "white" }}>{student?.fullName}</h1>
              <p style={{ opacity: 0.8, margin: "5px 0 0" }}>
                {student?.classroom?.name} • {student?.matricule}
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: "right", background: "rgba(255,255,255,0.1)", padding: "1rem 2rem", borderRadius: "15px", backdropFilter: "blur(10px)" }}>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", opacity: 0.8, margin: 0 }}>Moyenne Générale ({activePeriod})</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: 0 }}>
              {average ? `${average}/20` : "--/20"}
            </p>
          </div>
        </div>

        {/* Sélecteur de Période (Tabs) */}
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          marginBottom: "2rem", 
          overflowX: "auto", 
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          {periods.map(p => (
            <button 
              key={p}
              onClick={() => setActivePeriod(p)}
              style={{ 
                padding: "0.8rem 1.5rem", 
                borderRadius: "10px", 
                border: "none", 
                background: activePeriod === p ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                transition: "0.3s",
                whiteSpace: "nowrap"
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Liste des notes style "Espace Formation" */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredResults.length > 0 ? filteredResults.map((r, index) => (
            <div key={index} style={{ 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "15px", 
              padding: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div style={{ flex: 2, minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{r.subject}</h3>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ 
                    width: `${(r.score / r.maxScore) * 100}%`, 
                    height: "100%", 
                    background: r.score >= (r.maxScore / 2) ? "#34A853" : "#D93025" 
                  }}></div>
                </div>
              </div>
              
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", margin: 0 }}>Note</p>
                <p style={{ fontSize: "1.4rem", fontWeight: "bold", margin: 0 }}>{r.score} <span style={{ fontSize: "0.9rem", opacity: 0.4 }}>/ {r.maxScore}</span></p>
              </div>

              <div style={{ flex: 2, borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", margin: 0 }}>Appréciation</p>
                <p style={{ fontSize: "0.9rem", fontStyle: "italic", margin: "5px 0 0" }}>
                  {r.appreciation || "Aucun commentaire pour cette matière."}
                </p>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Pas encore de notes pour le {activePeriod}</h3>
              <p style={{ opacity: 0.5 }}>Les résultats s'afficheront ici dès qu'ils seront publiés par les professeurs.</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.8rem", opacity: 0.4 }}>© Scolaris RDC - Système de certification numérique</p>
          <button onClick={() => window.print()} style={{ 
            background: "none", 
            border: "1px solid rgba(255,255,255,0.2)", 
            color: "white", 
            padding: "0.6rem 1.2rem", 
            borderRadius: "8px", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Télécharger le relevé PDF
          </button>
        </div>
      </main>
    </>
  );
}

export default ReportCardPage;
