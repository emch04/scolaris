import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAssignmentsRequest } from "../services/assignment.api";
import { getParentDashboardRequest } from "../services/parent.api";
import { submitAssignmentSignatureRequest } from "../services/submission.api";
import apiClient from "../services/apiClient"; // Pour l'appel OTP
import useAuth from "../hooks/useAuth";

function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
        const [resAssign, resParent] = await Promise.all([
          getAssignmentsRequest(),
          getParentDashboardRequest()
        ]);
        const current = resAssign?.data?.find(a => a._id === assignmentId);
        setAssignment(current);
        const myChildren = resParent?.data?.children || [];
        setChildren(myChildren);
        if (myChildren.length > 0) setSelectedChild(myChildren[0]._id);
        setParentName(user?.fullName || "");
      } catch (err) {
        console.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, user]);

  const handleRequestOtp = async () => {
    if (!certified || !parentName.trim()) return alert("Veuillez remplir les informations et certifier.");
    setSendingOtp(true);
    try {
      await apiClient.post("/submissions/request-otp");
      setStep(2);
      alert("Un code de sécurité a été envoyé sur votre téléphone.");
    } catch (err) {
      alert("Erreur lors de l'envoi du code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!otpCode) return alert("Veuillez saisir le code reçu.");
    try {
      await submitAssignmentSignatureRequest({
        assignment: assignmentId,
        student: selectedChild,
        parent: user.id,
        signatureUrl: parentName,
        comment,
        otpCode // Envoyer le code pour vérification
      });
      alert("Signature confirmée avec succès !");
      navigate("/parent/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Code incorrect ou expiré.");
    }
  };

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ maxWidth: "600px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "2.5rem", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.1)" }}>
          {step === 1 ? (
            <>
              <h4 style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "0.7rem" }}>{assignment?.subject}</h4>
              <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{assignment?.title}</h1>
              <p style={{ opacity: 0.7, marginBottom: "2rem", fontSize: "0.95rem" }}>{assignment?.description}</p>
              
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>✍️ Signature du Parent</h3>

                <div style={{ display: "grid", gap: "15px" }}>
                  <select 
                    value={selectedChild} 
                    onChange={e => setSelectedChild(e.target.value)}
                    style={{ width: "100%", background: "#222", color: "white", padding: "12px", borderRadius: "10px", border: "1px solid #444" }}
                  >
                    {children.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                  </select>

                  <input 
                    type="text"
                    placeholder="Votre Nom Complet"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    style={{ width: "100%", background: "#222", color: "white", padding: "12px", borderRadius: "10px", border: "1px solid #444" }}
                  />

                  <textarea 
                    placeholder="Commentaire (Optionnel)" 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ width: "100%", background: "#222", color: "white", padding: "12px", borderRadius: "10px", border: "1px solid #444", minHeight: "80px" }}
                  />

                  <div style={{ display: "flex", gap: "10px", padding: "10px", background: "rgba(52, 168, 83, 0.1)", borderRadius: "10px" }}>
                    <input type="checkbox" checked={certified} onChange={e => setCertified(e.target.checked)} />
                    <label style={{ fontSize: "0.8rem" }}>Je certifie avoir suivi ce devoir.</label>
                  </div>

                  <button onClick={handleRequestOtp} disabled={sendingOtp} className="btn btn-primary" style={{ padding: "1rem" }}>
                    {sendingOtp ? "Envoi du code..." : "SUIVANT : RECEVOIR LE CODE PAR SMS"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📱</div>
              <h2>Vérification de Sécurité</h2>
              <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Saisissez le code à 6 chiffres envoyé au numéro du parent.</p>
              
              <input 
                type="text"
                placeholder="0 0 0 0 0 0"
                maxLength="6"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                style={{ width: "100%", background: "#222", color: "white", padding: "15px", borderRadius: "10px", border: "2px solid var(--primary)", fontSize: "2rem", textAlign: "center", letterSpacing: "10px", marginBottom: "2rem" }}
              />

              <button onClick={handleFinalSubmit} className="btn btn-primary" style={{ width: "100%", padding: "1rem" }}>
                ✅ CONFIRMER ET SIGNER LE DEVOIR
              </button>
              
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "white", opacity: 0.5, marginTop: "1rem", cursor: "pointer" }}>
                Modifier les informations
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default AssignmentDetailPage;
