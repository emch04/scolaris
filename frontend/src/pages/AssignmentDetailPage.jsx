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
      <main className="container" style={{ maxWidth: "800px", padding: "2rem 1.5rem" }}>
        
        {/* En-tête du Devoir */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "2.5rem", 
          borderRadius: "25px", 
          border: "3px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <span style={{ 
              fontSize: "0.7rem", padding: "4px 12px", borderRadius: "50px", 
              background: "rgba(26, 115, 232, 0.15)", color: "var(--primary)", 
              fontWeight: "bold", textTransform: "uppercase" 
            }}>
              {assignment?.subject}
            </span>
            <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
              Publié le {formatDate(assignment?.createdAt)}
            </span>
          </div>
          
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "1.5rem" }}>{assignment?.title}</h1>
          <div style={{ fontSize: "1.05rem", lineHeight: "1.7", opacity: 0.8, whiteSpace: "pre-wrap", marginBottom: "2rem" }}>
            {assignment?.description}
          </div>

          {assignment?.fileUrl && (
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.5rem", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "var(--primary)", padding: "10px", borderRadius: "10px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div><h4 style={{ margin: 0 }}>Ressource pédagogique</h4><p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.5 }}>Document de cours attaché</p></div>
              </div>
              <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${assignment.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>Ouvrir</a>
            </div>
          )}
        </div>

        {/* Vue Staff */}
        {["super_admin", "admin", "director", "teacher"].includes(user?.role) && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "2.5rem", borderRadius: "25px", border: "1px dashed rgba(255, 255, 255, 0.2)", textAlign: "center" }}>
            <h3>Vue Administration</h3>
            <p style={{ opacity: 0.6 }}>Vous consultez ce devoir tel qu'il apparaît aux élèves.</p>
          </div>
        )}

        {/* Vue Élève */}
        {user?.role === "student" && (
          <div style={{ background: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)", padding: "2.5rem", borderRadius: "25px", color: "white" }}>
            <h2>Prêt à travailler ?</h2>
            <p style={{ opacity: 0.9, marginBottom: "2rem" }}>Utilisez les ressources ci-dessus pour réaliser vos exercices.</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" style={{ background: "white", color: "var(--primary)", fontWeight: "bold" }}>J'ai terminé</button>
              <button className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Une question ?</button>
            </div>
          </div>
        )}

        {/* Vue Parent */}
        {user?.role === "parent" && (
          <div style={{ padding: "2.5rem", borderRadius: "25px", border: "3px solid rgba(255, 255, 255, 0.1)", background: "rgba(52, 168, 83, 0.05)" }}>
            {step === 1 ? (
              <>
                <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                  Validation Parent
                </h3>
                <div style={{ display: "grid", gap: "15px" }}>
                  <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px" }}>
                    {children.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                  </select>
                  <input type="text" placeholder="Nom Complet" value={parentName} onChange={e => setParentName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px" }} />
                  <textarea placeholder="Commentaire" value={comment} onChange={e => setComment(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", minHeight: "80px" }} />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="checkbox" checked={certified} onChange={e => setCertified(e.target.checked)} />
                    <label>Je certifie avoir suivi ce devoir.</label>
                  </div>
                  <button onClick={handleRequestOtp} disabled={sendingOtp} className="btn btn-primary">RECEVOIR LE CODE SMS</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h2>Vérification SMS</h2>
                <input type="text" placeholder="0 0 0 0 0 0" maxLength="6" value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ width: "100%", padding: "15px", fontSize: "2rem", textAlign: "center", marginBottom: "2rem" }} />
                <button onClick={handleFinalSubmit} className="btn btn-primary" style={{ width: "100%" }}>CONFIRMER LA SIGNATURE</button>
                <button onClick={() => setStep(1)} style={{ background: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.7, fontSize: "0.9rem", border: "none" }}>Code non reçu ?</button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default AssignmentDetailPage;