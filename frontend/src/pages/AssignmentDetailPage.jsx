/**
 * @file AssignmentDetailPage.jsx
 * @description Page affichant les détails d'un devoir spécifique, incluant les instructions et les soumissions.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAssignmentsRequest } from "../services/assignment.api";
import { getParentDashboardRequest } from "../services/parent.api";
import { submitAssignmentSignatureRequest } from "../services/submission.api";
import apiClient from "../services/apiClient"; // Pour l'appel OTP
import useAuth from "../hooks/useAuth";
import formatDate from "../utils/formatDate";
import { useToast } from "../context/ToastContext";
import { getFileUrl } from "../utils/fileUrl";

function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [assignment, setAssignment] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("");
  const [comment, setComment] = useState("");
  const [certified, setCertified] = useState(false);
  
  // États pour OTP
  const [step, setStep] = useState(1); // 1: Info, 2: Code
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAssign = await getAssignmentsRequest();
        const current = resAssign?.data?.find(a => a._id === assignmentId);
        setAssignment(current);

        if (user?.role === "parent") {
          const resParent = await getParentDashboardRequest();
          const myChildren = resParent?.data?.children || [];
          setChildren(myChildren);
          if (myChildren.length > 0) setSelectedChild(myChildren[0]._id);
        }
        
        setParentName(user?.fullName || "");
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, user]);

  const handleRequestOtp = async () => {
    if (!certified || !parentName.trim()) return showToast("Veuillez remplir les informations et certifier.", "error");
    setSendingOtp(true);
    try {
      await apiClient.post("/submissions/request-otp");
      setStep(2);
      showToast("Un code de sécurité a été envoyé sur votre téléphone.");
    } catch (err) {
      showToast("Erreur lors de l'envoi du code.", "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!otpCode) return showToast("Veuillez saisir le code reçu.", "error");
    try {
      await submitAssignmentSignatureRequest({
        assignment: assignmentId,
        student: selectedChild,
        parent: user.id,
        signatureUrl: parentName,
        comment,
        otpCode
      });
      showToast("Signature confirmée avec succès !");
      navigate("/parent/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Code incorrect ou expiré.", "error");
    }
  };

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ maxWidth: "700px", padding: "1.5rem" }}>
        
        {/* En-tête du Devoir */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "1.5rem", 
          borderRadius: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ 
              fontSize: "0.6rem", padding: "3px 10px", borderRadius: "50px", 
              background: "rgba(26, 115, 232, 0.15)", color: "var(--primary)", 
              fontWeight: "900", textTransform: "uppercase" 
            }}>
              {assignment?.subject}
            </span>
            <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>
              {formatDate(assignment?.createdAt)}
            </span>
          </div>
          
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "800", marginBottom: "1rem" }}>{assignment?.title}</h1>
          <div style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8, whiteSpace: "pre-wrap", marginBottom: "1.5rem" }}>
            {assignment?.description}
          </div>

          {assignment?.fileUrl && (
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "var(--primary)", padding: "8px", borderRadius: "8px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </div>
                <div><h4 style={{ margin: 0, fontSize: "0.9rem" }}>Ressource jointe</h4><p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>Document PDF / Image</p></div>
              </div>
              <a href={getFileUrl(assignment.fileUrl)} download target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.8rem", flex: window.innerWidth < 480 ? "1" : "auto", textAlign: "center" }}>Ouvrir</a>
            </div>
          )}
        </div>

        {/* Vue Staff */}
        {["super_admin", "admin", "director", "teacher"].includes(user?.role) && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.5rem", borderRadius: "20px", border: "1px dashed rgba(255, 255, 255, 0.2)", textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem" }}>Vue Administration</h3>
            <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>Aperçu du contenu tel qu'affiché aux élèves.</p>
          </div>
        )}

        {/* Vue Élève */}
        {user?.role === "student" && (
          <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #004d99 100%)", padding: "1.5rem", borderRadius: "20px", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h2 style={{ marginBottom: "0.8rem", fontSize: "1.3rem" }}>Prêt à travailler ?</h2>
            <p style={{ opacity: 0.9, marginBottom: "1.5rem", fontSize: "0.9rem" }}>Réalisez vos exercices et demandez la signature parentale.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
                onClick={() => showToast("Bravo ! Faites signer ce devoir par vos parents.")} 
                className="btn" 
                style={{ width: "100%", background: "white", color: "var(--primary)", fontWeight: "bold", padding: "0.8rem", fontSize: "0.9rem" }}
              >
                J'ai terminé le travail
              </button>

              {!showQuestionOptions ? (
                <button 
                  onClick={() => setShowQuestionOptions(true)}
                  className="btn" 
                  style={{ width: "100%", background: "rgba(255,255,255,0.1)", color: "white", padding: "0.8rem", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.9rem", fontWeight: "bold" }}
                >
                  J'ai une question...
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px", animation: "fadeIn 0.3s ease" }}>
                  <button 
                    onClick={() => navigate(`/chat/${user.classroom}`)}
                    className="btn" 
                    style={{ flex: 1, background: "rgba(255,255,255,0.2)", color: "white", padding: "0.8rem", border: "1px solid rgba(255,255,255,0.3)", fontSize: "0.85rem", fontWeight: "bold" }}
                  >
                    Chat de Classe
                  </button>
                  <button 
                    onClick={() => navigate("/messages?compose=true")}
                    className="btn" 
                    style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "white", padding: "0.8rem", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.85rem", fontWeight: "bold" }}
                  >
                    Privé (Prof)
                  </button>
                  <button 
                    onClick={() => setShowQuestionOptions(false)}
                    className="btn"
                    style={{ background: "rgba(255,82,82,0.2)", color: "#ff5252", padding: "0.8rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vue Parent */}
        {user?.role === "parent" && (
          <div style={{ padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(52, 168, 83, 0.05)" }}>
            {step === 1 ? (
              <>
                <h3 style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                  Validation Parent
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Élève concerné</label>
                    <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "white", color: "#222", fontSize: "0.9rem" }}>
                      {children.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Nom du parent (Signature)</label>
                    <input type="text" placeholder="Nom complet" value={parentName} onChange={e => setParentName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "white", color: "#222", fontSize: "0.9rem" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", opacity: 0.7 }}>Commentaire (Optionnel)</label>
                    <textarea placeholder="Observations..." value={comment} onChange={e => setComment(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", minHeight: "80px", background: "white", color: "#222", fontSize: "0.9rem" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "rgba(52, 168, 83, 0.1)", borderRadius: "10px" }}>
                    <input type="checkbox" id="certify" checked={certified} onChange={e => setCertified(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                    <label htmlFor="certify" style={{ fontSize: "0.85rem", cursor: "pointer" }}>Je certifie avoir suivi ce devoir.</label>
                  </div>
                  <button onClick={handleRequestOtp} disabled={sendingOtp} className="btn btn-primary" style={{ padding: "1rem", fontSize: "0.95rem", fontWeight: "bold" }}>
                    {sendingOtp ? "ENVOI..." : "SIGNER PAR CODE SMS"}
                  </button>
                  
                  {/* Bouton Question pour le Parent */}
                  <button 
                    onClick={() => navigate("/messages?compose=true")}
                    className="btn" 
                    style={{ background: "rgba(26, 115, 232, 0.1)", color: "var(--primary)", padding: "0.8rem", border: "1px solid rgba(26, 115, 232, 0.2)", fontSize: "0.9rem", fontWeight: "bold", marginTop: "5px" }}
                  >
                    Poser une question au professeur
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h2 style={{ marginBottom: "0.5rem", fontSize: "1.3rem" }}>Vérification</h2>
                <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.85rem" }}>Saisissez le code reçu par SMS.</p>
                <input type="text" placeholder="·····" maxLength="6" value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ width: "100%", padding: "10px", fontSize: "2rem", textAlign: "center", marginBottom: "1.5rem", letterSpacing: "8px", background: "white", color: "#222", border: "2px solid var(--primary)", borderRadius: "10px" }} />
                <button onClick={handleFinalSubmit} className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}>CONFIRMER</button>
                <button onClick={() => setStep(1)} style={{ background: "none", color: "var(--primary)", marginTop: "1rem", cursor: "pointer", fontSize: "0.85rem", border: "none", textDecoration: "underline" }}>Retour</button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default AssignmentDetailPage;