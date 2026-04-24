import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { forgotPasswordRequest, resetPasswordRequest, registerRequest } from "../services/auth.api";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [view, setView] = useState("login"); // "login", "forgot", "reset", "register_type", "register_form"
  const [regType, setRegType] = useState(""); // "student", "parent", "teacher_public"
  
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [regData, setRegTypeData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    schoolCode: "",
    studentMatricule: ""
  });
  
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const authData = await login(identifier, password);
      const user = authData?.user || authData?.teacher;
      showToast(`Bienvenue, ${user?.fullName} !`);

      if (user?.role === "parent") navigate("/parent/dashboard");
      else if (user?.role === "student") navigate("/student/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Échec de la connexion.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);
    try {
      const res = await registerRequest({ ...regData, type: regType });
      if (regType === "student") {
        showToast(`Inscription réussie ! Votre matricule est : ${res.data.matricule}`, "success", 10000);
      } else if (regType === "teacher_public") {
        showToast("Compte créé ! Un administrateur doit valider votre accès.", "success");
      } else {
        showToast("Inscription réussie ! Connectez-vous.", "success");
      }
      setView("login");
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);
    try {
      await forgotPasswordRequest(identifier);
      showToast("Un code de sécurité a été envoyé à votre adresse e-mail.");
      setView("reset");
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la demande.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);
    try {
      await resetPasswordRequest({ identifier, code: otpCode, newPassword });
      showToast("Mot de passe modifié ! Connectez-vous.");
      setView("login");
    } catch (err) {
      setError(err?.response?.data?.message || "Code invalide ou erreur.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ background: "white", width: "90px", height: "90px", borderRadius: "22px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "3px solid white", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <img src="/assets/image.png" alt="Scolaris" style={{ width: "80%", height: "85%", objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              {view === "login" ? "Connexion" : view === "register_type" ? "Créer un compte" : "Scolaris"}
            </h1>
          </div>

          {/* CONNEXION */}
          {view === "login" && (
            <>
              <form onSubmit={handleSubmit} className="form" style={{ margin: "0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Email ou Matricule</label>
                  <input type="text" placeholder="Ex: TEDP-2026..." value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Mot de passe</label>
                    <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>Oublié ?</button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", paddingRight: "40px" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
                      {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                    </button>
                  </div>
                </div>
                {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{ marginTop: "1.5rem", width: "100%", padding: "1rem" }} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
              </form>
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Nouveau sur Scolaris ?</p>
                <button onClick={() => setView("register_type")} style={{ background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}>Créer un compte</button>
              </div>
            </>
          )}

          {/* CHOIX DU TYPE DE COMPTE */}
          {view === "register_type" && (
            <div className="form" style={{ display: "grid", gap: "1rem" }}>
              <p style={{ textAlign: "center", fontSize: "0.9rem", marginBottom: "1rem" }}>Je suis un...</p>
              <button className="btn" onClick={() => { setRegType("student"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "var(--primary)", padding: "10px", borderRadius: "10px", display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                </div>
                <div><strong style={{ display: "block" }}>Élève</strong><small style={{ opacity: 0.5 }}>Rejoindre ma classe avec mon code école</small></div>
              </button>
              <button className="btn" onClick={() => { setRegType("parent"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "#34A853", padding: "10px", borderRadius: "10px", display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div><strong style={{ display: "block" }}>Parent</strong><small style={{ opacity: 0.5 }}>Suivre les devoirs avec le matricule enfant</small></div>
              </button>
              <button className="btn" onClick={() => { setRegType("teacher_public"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "#F9AB00", padding: "10px", borderRadius: "10px", display: "flex" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div><strong style={{ display: "block" }}>Enseignant</strong><small style={{ opacity: 0.5 }}>Demander un accès à l'administration</small></div>
              </button>
              <button onClick={() => setView("login")} className="btn" style={{ background: "none", color: "white", marginTop: "1rem", opacity: 0.6, fontSize: "0.9rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Retour
              </button>
            </div>
          )}

          {/* FORMULAIRE D'INSCRIPTION STRICT */}
          {view === "register_form" && (
            <form onSubmit={handleRegister} className="form">
              <h3 style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                Inscription {regType === "student" ? "Élève" : regType === "parent" ? "Parent" : "Enseignant"}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <input type="text" placeholder="Nom complet" value={regData.fullName} onChange={e => setRegTypeData({...regData, fullName: e.target.value})} required />
                
                {regType !== "student" && (
                  <input type="email" placeholder="Adresse e-mail" value={regData.email} onChange={e => setRegTypeData({...regData, email: e.target.value})} required />
                )}

                {regType === "student" && (
                  <input type="text" placeholder="Code École (ex: EPS-001)" value={regData.schoolCode} onChange={e => setRegTypeData({...regData, schoolCode: e.target.value})} required />
                )}

                {regType === "parent" && (
                  <input type="text" placeholder="Matricule de l'enfant" value={regData.studentMatricule} onChange={e => setRegTypeData({...regData, studentMatricule: e.target.value})} required />
                )}

                {regType !== "student" && (
                  <input type="text" placeholder="Téléphone" value={regData.phone} onChange={e => setRegTypeData({...regData, phone: e.target.value})} required />
                )}

                <input type="password" placeholder="Choisir un mot de passe" value={regData.password} onChange={e => setRegTypeData({...regData, password: e.target.value})} required />
              </div>

              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: "2rem", width: "100%", padding: "1rem" }} disabled={loadingAction}>
                {loadingAction ? "Traitement..." : "Confirmer l'inscription"}
              </button>
              <button type="button" onClick={() => setView("register_type")} style={{ background: "none", border: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.6, width: "100%" }}>Retour</button>
            </form>
          )}

          {/* MOT DE PASSE OUBLIÉ ET RÉINITIALISATION (existants mais refactorisés) */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="form">
              <label style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>Email ou Matricule</label>
              <input type="text" placeholder="Saisissez votre identifiant" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1.5rem", width: "100%", padding: "1rem" }} disabled={loadingAction}>{loadingAction ? "Envoi..." : "Recevoir le code"}</button>
              <button type="button" onClick={() => setView("login")} style={{ background: "none", border: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.6, width: "100%" }}>Retour</button>
            </form>
          )}

          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="form">
              <div style={{ textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.85rem", margin: 0, opacity: 0.8 }}>Code envoyé pour : <strong>{identifier}</strong></p>
              </div>
              <input type="text" placeholder="Code à 6 chiffres" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength="6" required style={{ textAlign: "center", fontSize: "1.8rem", letterSpacing: "8px", marginBottom: "1rem" }} />
              <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1.5rem", width: "100%", padding: "1rem" }} disabled={loadingAction}>Réinitialiser</button>
              <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.6, width: "100%" }}>Renvoyer le code</button>
            </form>
          )}

        </div>
      </main>
    </>
  );
}
export default LoginPage;