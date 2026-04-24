import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentBulletinRequest } from "../services/result.api";
import { getStudentsRequest } from "../services/student.api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReportCardPage() {
  const { studentId } = useParams();
  const [allResults, setAllResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [activePeriod, setActivePeriod] = useState("Trimestre 1");
  const reportRef = useRef();

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

  const handleDownloadPDF = async () => {
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#050505"
        });
        const imgData = canvas.toDataURL("image/png");
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Bulletin_${student?.fullName.replace(/\s+/g, '_')}_${activePeriod}.pdf`);
      } catch (err) {
        console.error("Erreur PDF:", err);
      } finally {
        setPrinting(false);
      }
    }, 100);
  };

  if (loading) return <><Navbar /><Loader /></>;

  const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Examen État"];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        <div ref={reportRef} style={{ 
          padding: printing ? "40px" : "0", 
          background: printing ? "#050505" : "transparent",
          borderRadius: printing ? "0" : "20px"
        }}>
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
                {printing && <p style={{ fontSize: "0.7rem", marginTop: "10px", opacity: 0.5 }}>Document certifié numérique • {new Date().toLocaleDateString()}</p>}
              </div>
            </div>
            
            <div style={{ textAlign: "right", background: "rgba(255,255,255,0.1)", padding: "1rem 2rem", borderRadius: "15px", backdropFilter: "blur(10px)" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", opacity: 0.8, margin: 0 }}>Moyenne ({activePeriod})</p>
              <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: 0 }}>
                {average ? `${average}/20` : "--/20"}
              </p>
            </div>
          </div>

          {/* Liste des notes */}
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
                flexWrap: "nowrap",
                gap: "1rem"
              }}>
                <div style={{ flex: 2 }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{r.subject}</h3>
                  <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${(r.score / r.maxScore) * 100}%`, 
                      height: "100%", 
                      background: r.score >= (r.maxScore / 2) ? "#34A853" : "#D93025" 
                    }}></div>
                  </div>
                </div>
                
                <div style={{ flex: 1, textAlign: "center", minWidth: "80px" }}>
                  <p style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", margin: 0 }}>Note</p>
                  <p style={{ fontSize: "1.4rem", fontWeight: "bold", margin: 0 }}>{r.score}<small style={{ fontSize: "0.8rem", opacity: 0.4 }}>/{r.maxScore}</small></p>
                </div>

                {!printing && (
                  <div style={{ flex: 2, borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "1.5rem" }}>
                    <p style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase", margin: 0 }}>Appréciation</p>
                    <p style={{ fontSize: "0.9rem", fontStyle: "italic", margin: "5px 0 0" }}>
                      {r.appreciation || "Pas de commentaire."}
                    </p>
                  </div>
                )}
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "4rem", opacity: 0.3 }}>
                <h3>Pas encore de notes pour cette période</h3>
              </div>
            )}
          </div>
          
          {printing && (
            <div style={{ marginTop: "40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
              <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>© {new Date().getFullYear()} Scolaris - La plateforme éducative moderne</p>
            </div>
          )}
        </div>

        {!printing && (
          <>
            {/* Sélecteur de Période (Tabs) */}
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              marginBottom: "2rem", 
              marginTop: "2rem",
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

            {/* Footer actions */}
            <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <p style={{ fontSize: "0.8rem", opacity: 0.4 }}>© Scolaris RDC - Système de certification numérique</p>
              <button 
                onClick={handleDownloadPDF} 
                disabled={printing || filteredResults.length === 0}
                className="btn btn-primary"
                style={{ 
                  padding: "0.8rem 1.5rem", 
                  borderRadius: "12px", 
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "bold",
                  opacity: filteredResults.length === 0 ? 0.5 : 1
                }}
              >
                {printing ? "Génération du PDF..." : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Télécharger le bulletin PDF
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default ReportCardPage;
