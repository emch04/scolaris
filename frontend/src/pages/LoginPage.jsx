/**
 * @file LoginPage.jsx
 * @description Page d'authentification permettant aux utilisateurs de se connecter à leur espace.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { forgotPasswordRequest, resetPasswordRequest, registerRequest } from "../services/auth.api";

/**
 * LoginPage.jsx
 * Rôle : Point d'entrée pour l'authentification des utilisateurs.
 * Gère la connexion, l'inscription (élèves, parents, enseignants publics) 
 * et la récupération de mot de passe (flux OTP).
 */
function LoginPage() {
  // États pour les formulaires de connexion et d'inscription
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  
  // Gestion de la vue actuelle (navigation interne sans changement d'URL)
  const [view, setView] = useState("login"); // "login", "forgot", "reset", "register_type", "register_form"
  const [regType, setRegType] = useState(""); // "student", "parent", "teacher_public"
  
  // États pour la récupération de mot de passe
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Données d'inscription détaillées
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

  /**
   * handleSubmit
   * Logique : Appelle la fonction login du hook useAuth.
   * Redirige l'utilisateur vers son tableau de bord spécifique selon son rôle après succès.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const authData = await login(identifier, password);
      const user = authData?.user || authData?.teacher;
      showToast(`Bienvenue, ${user?.fullName} !`);

      // Redirection intelligente par rôle
      if (user?.role === "parent") navigate("/parent/dashboard");
      else if (user?.role === "student") navigate("/student/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Échec de la connexion.");
    }
  };

  /**
   * handleRegister
   * Logique : Envoie les données d'inscription au serveur via registerRequest.
   * Gère les messages de succès spécifiques (ex: affichage du matricule pour les élèves).
   */
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

  /**
   * handleForgotPassword
   * Logique : Demande l'envoi d'un code OTP par e-mail.
   */
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

  /**
   * handleResetPassword
   * Logique : Finalise le changement de mot de passe avec le code OTP reçu.
   */
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
              <img src="/assets/image.jpg" alt="Scolaris" style={{ width: "80%", height: "85%", objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              {view === "login" ? "Connexion" : view === "register_type" ? "Créer un compte" : "Scolaris"}
            </h1>
          </div>

          {/* VUE : CONNEXION */}
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

          {/* VUE : CHOIX DU TYPE DE COMPTE */}
          {view === "register_type" && (
            <div className="form" style={{ display: "grid", gap: "1rem" }}>
              <p style={{ textAlign: "center", fontSize: "0.9rem", marginBottom: "1rem" }}>Je suis un...</p>
              <button className="btn" onClick={() => { setRegType("student"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "#34A853", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>👨‍🎓</div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>Élève</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>Accéder à mes devoirs et résultats</div>
                </div>
              </button>
              <button className="btn" onClick={() => { setRegType("parent"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "#F9AB00", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>👪</div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>Parent</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>Suivre la progression de mes enfants</div>
                </div>
              </button>
              <button className="btn" onClick={() => { setRegType("teacher_public"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ background: "var(--primary)", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>👩‍🏫</div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>Enseignant</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>Rejoindre un établissement du réseau</div>
                </div>
              </button>
              <button onClick={() => setView("login")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.9rem", marginTop: "1rem" }}>Retour à la connexion</button>
            </div>
          )}

          {/* VUE : FORMULAIRE D'INSCRIPTION */}
          {view === "register_form" && (
            <form onSubmit={handleRegister} className="form">
              <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Détails de l'inscription</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input placeholder="Nom Complet" value={regData.fullName} onChange={e => setRegTypeData({...regData, fullName: e.target.value})} required />
                <input type="email" placeholder="Adresse Email" value={regData.email} onChange={e => setRegTypeData({...regData, email: e.target.value})} required />
                <input type="password" placeholder="Mot de passe" value={regData.password} onChange={e => setRegTypeData({...regData, password: e.target.value})} required />
                
                {regType === "student" && (
                  <input placeholder="Code de l'école (Fourni par l'école)" value={regData.schoolCode} onChange={e => setRegTypeData({...regData, schoolCode: e.target.value})} required />
                )}
                
                {regType === "parent" && (
                  <>
                    <input placeholder="Téléphone" value={regData.phone} onChange={e => setRegTypeData({...regData, phone: e.target.value})} required />
                    <input placeholder="Matricule de l'enfant" value={regData.studentMatricule} onChange={e => setRegTypeData({...regData, studentMatricule: e.target.value})} required />
                  </>
                )}

                {regType === "teacher_public" && (
                  <input placeholder="Code de l'école" value={regData.schoolCode} onChange={e => setRegTypeData({...regData, schoolCode: e.target.value})} required />
                )}
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }} disabled={loadingAction}>
                {loadingAction ? "Création..." : "Créer mon compte"}
              </button>
              <button type="button" onClick={() => setView("register_type")} style={{ width: "100%", background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.9rem", marginTop: "1rem" }}>Changer de type de compte</button>
            </form>
          )}

          {/* VUE : MOT DE PASSE OUBLIÉ */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="form">
              <h3 style={{ marginBottom: "1rem" }}>Mot de passe oublié</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1.5rem" }}>Saisissez votre e-mail ou matricule pour recevoir un code de sécurité.</p>
              <input placeholder="Email ou Matricule" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }} disabled={loadingAction}>Envoyer le code</button>
              <button type="button" onClick={() => setView("login")} style={{ width: "100%", background: "none", border: "none", color: "#888", cursor: "pointer", marginTop: "1rem" }}>Retour</button>
            </form>
          )}

          {/* VUE : RÉINITIALISATION (OTP) */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="form">
              <h3 style={{ marginBottom: "1rem" }}>Nouveau mot de passe</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input placeholder="Code reçu par email" value={otpCode} onChange={e => setOtpCode(e.target.value)} required />
                <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.85rem", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }} disabled={loadingAction}>Réinitialiser</button>
            </form>
          )}

        </div>
      </main>
    </>
  );
}

export default LoginPage;
