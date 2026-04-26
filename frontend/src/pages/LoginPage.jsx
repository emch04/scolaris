/**
 * @file LoginPage.jsx
 * @description Page d'authentification permettant aux utilisateurs de se connecter à leur espace.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>
          {view === "login" ? "Connexion - Scolaris" : 
           view === "register_type" || view === "register_form" ? "Inscription - Scolaris" : 
           view === "forgot" || view === "reset" ? "Récupération - Scolaris" : 
           "Scolaris - Gestion Scolaire"}
        </title>
      </Helmet>
      <Navbar />
      <main className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: "clamp(1.5rem, 5vw, 2.5rem) 1rem" }}>
        <div style={{ width: "100%", maxWidth: "450px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 5vw, 2.5rem)" }}>
            <div style={{ background: "white", width: "clamp(70px, 15vw, 90px)", height: "clamp(70px, 15vw, 90px)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "2px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <img src="/assets/android-chrome-512x512.png" alt="Scolaris" style={{ width: "80%", height: "85%", objectFit: "contain", borderRadius: "10px" }} />
            </div>
            <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 1.8rem)", marginBottom: "0.4rem", fontWeight: "800" }}>
              {view === "login" ? "Connexion" : view === "register_type" ? "Créer un compte" : "Scolaris"}
            </h1>
            <p style={{ fontSize: "0.85rem", opacity: 0.5 }}>Espace Éducatif Connecté</p>
          </div>

          {/* VUE : CONNEXION */}
          {view === "login" && (
            <>
              <form onSubmit={handleSubmit} className="form" style={{ margin: "0", padding: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7 }}>Email ou Matricule</label>
                  <input type="text" placeholder="Identifiant unique" value={identifier} onChange={(e) => setIdentifier(e.target.value)} style={{ padding: "12px", fontSize: "0.95rem" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.7 }}>Mot de passe</label>
                    <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>Oublié ?</button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "12px", paddingRight: "40px", fontSize: "0.95rem" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex" }}>
                      {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                    </button>
                  </div>
                </div>
                {error && <p style={{ color: "#ff5252", fontSize: "0.8rem", textAlign: "center", marginTop: "0.8rem" }}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{ marginTop: "1.2rem", width: "100%", padding: "12px", fontSize: "1rem", fontWeight: "bold" }} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
              </form>
              <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
                <p style={{ opacity: 0.5, fontSize: "0.85rem", margin: "0 0 5px 0" }}>Nouveau sur Scolaris ?</p>
                <button onClick={() => setView("register_type")} style={{ background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem" }}>Créer un compte</button>
              </div>
            </>
          )}

          {/* VUE : CHOIX DU TYPE DE COMPTE */}
          {view === "register_type" && (
            <div className="form" style={{ display: "grid", gap: "0.8rem", padding: "1.5rem" }}>
              <p style={{ textAlign: "center", fontSize: "0.85rem", opacity: 0.7, marginBottom: "0.5rem" }}>Choisissez votre profil :</p>
              <button className="btn" onClick={() => { setRegType("student"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.2rem", borderRadius: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#34A853", width: "35px", height: "35px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🎓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Élève</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Devoirs & résultats</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="btn" onClick={() => { setRegType("parent"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.2rem", borderRadius: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#F9AB00", width: "35px", height: "35px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>👪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Parent</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Suivi des enfants</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button className="btn" onClick={() => { setRegType("teacher_public"); setView("register_form"); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.2rem", borderRadius: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "var(--primary)", width: "35px", height: "35px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>👩‍🏫</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Enseignant</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Gestion des classes</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <button onClick={() => setView("login")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.85rem", marginTop: "1rem" }}>Retour à la connexion</button>
            </div>
          )}

          {/* VUE : FORMULAIRE D'INSCRIPTION */}
          {view === "register_form" && (
            <form onSubmit={handleRegister} className="form" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.2rem", textAlign: "center", fontSize: "1.2rem" }}>Inscription {regType === "student" ? "Élève" : regType === "parent" ? "Parent" : "Prof"}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <input placeholder="Nom Complet" value={regData.fullName} onChange={e => setRegTypeData({...regData, fullName: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                <input type="email" placeholder="Adresse Email" value={regData.email} onChange={e => setRegTypeData({...regData, email: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                <input type="password" placeholder="Mot de passe" value={regData.password} onChange={e => setRegTypeData({...regData, password: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                
                {regType === "student" && (
                  <input placeholder="Code de l'école" value={regData.schoolCode} onChange={e => setRegTypeData({...regData, schoolCode: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                )}
                
                {regType === "parent" && (
                  <>
                    <input placeholder="Téléphone" value={regData.phone} onChange={e => setRegTypeData({...regData, phone: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                    <input placeholder="Matricule de l'enfant" value={regData.studentMatricule} onChange={e => setRegTypeData({...regData, studentMatricule: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                  </>
                )}

                {regType === "teacher_public" && (
                  <input placeholder="Code de l'école" value={regData.schoolCode} onChange={e => setRegTypeData({...regData, schoolCode: e.target.value})} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                )}
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.8rem", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem", padding: "12px", fontSize: "1rem", fontWeight: "bold" }} disabled={loadingAction}>
                {loadingAction ? "Création..." : "Confirmer l'inscription"}
              </button>
              <button type="button" onClick={() => setView("register_type")} style={{ width: "100%", background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.85rem", marginTop: "1rem" }}>Changer de profil</button>
            </form>
          )}

          {/* VUE : MOT DE PASSE OUBLIÉ */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="form" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem" }}>Récupération</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1.2rem", lineHeight: "1.4" }}>Entrez votre identifiant pour recevoir un code de réinitialisation.</p>
              <input placeholder="Email ou Matricule" value={identifier} onChange={e => setIdentifier(e.target.value)} style={{ padding: "12px", fontSize: "0.9rem" }} required />
              {error && <p style={{ color: "#ff5252", fontSize: "0.8rem", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.2rem", padding: "12px" }} disabled={loadingAction}>Envoyer le code</button>
              <button type="button" onClick={() => setView("login")} style={{ width: "100%", background: "none", border: "none", color: "#888", cursor: "pointer", marginTop: "1rem", fontSize: "0.85rem" }}>Retour</button>
            </form>
          )}

          {/* VUE : RÉINITIALISATION (OTP) */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="form" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Nouveau mot de passe</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <input placeholder="Code reçu" value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ padding: "12px", fontSize: "0.9rem" }} required />
                <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: "12px", fontSize: "0.9rem" }} required />
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.8rem", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.2rem", padding: "12px" }} disabled={loadingAction}>Valider</button>
            </form>
          )}

        </div>
      </main>
    </>
  );
}

export default LoginPage;
