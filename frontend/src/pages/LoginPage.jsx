import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { forgotPasswordRequest, resetPasswordRequest } from "../services/auth.api";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  
  // États pour la réinitialisation de mot de passe
  const [view, setView] = useState("login"); // "login", "forgot", "reset"
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
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

      if (user?.role === "parent") {
        navigate("/parent/dashboard");
      } else if (user?.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Échec de la connexion.");
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
      setOtpCode("");
      setNewPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Code invalide ou erreur.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "80vh" 
      }}>
        <div style={{ width: "100%", maxWidth: "450px" }}>
          
          {/* Logo et Titre */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ 
              background: "white", 
              width: "100px", 
              height: "100px", 
              borderRadius: "25px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 1.5rem",
              border: "3px solid white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              overflow: "hidden"
            }}>
              <img src="/assets/image.png" alt="Scolaris Logo" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {view === "login" ? "Connexion" : view === "forgot" ? "Mot de passe oublié" : "Réinitialisation"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              {view === "login" ? "Accédez à votre espace éducatif" : "Saisissez votre identifiant pour recevoir un code"}
            </p>
          </div>

          {/* VUE CONNEXION */}
          {view === "login" && (
            <form onSubmit={handleSubmit} className="form" style={{ margin: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Email ou Matricule</label>
                <input type="text" placeholder="votre@email.com ou matricule" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Mot de passe</label>
                  <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: "bold" }}>Oublié ?</button>
                </div>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", paddingRight: "40px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p style={{ color: "#ff5252", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", padding: "1rem" }} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
            </form>
          )}

          {/* VUE MOT DE PASSE OUBLIÉ */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="form" style={{ margin: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Email ou Matricule</label>
                <input type="text" placeholder="votre@email.com ou matricule" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", padding: "1rem" }} disabled={loadingAction}>{loadingAction ? "Envoi..." : "Recevoir le code"}</button>
              <button type="button" onClick={() => setView("login")} style={{ background: "none", border: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.7 }}>Retour</button>
            </form>
          )}

          {/* VUE RÉINITIALISATION */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="form" style={{ margin: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                  <p style={{ fontSize: "0.85rem", margin: 0 }}>Un code a été envoyé pour l'identifiant <strong>{identifier}</strong></p>
                </div>
                <input type="text" placeholder="Code à 6 chiffres" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength="6" required style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "5px" }} />
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: "100%", paddingRight: "40px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
              {error && <p style={{ color: "#ff5252", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>}
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", padding: "1rem" }} disabled={loadingAction}>{loadingAction ? "Changer le mot de passe" : "Valider"}</button>
              <button type="button" onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "white", marginTop: "1rem", cursor: "pointer", opacity: 0.7 }}>Renvoyer le code</button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
            Besoin d'aide ? Contactez l'administration de votre école.
          </p>
        </div>
      </main>
    </>
  );
}
export default LoginPage;