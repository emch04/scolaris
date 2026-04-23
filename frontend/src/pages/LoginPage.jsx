import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const authData = await login(email, password);
      // login() renvoie déjà response.data (qui contient user et token)
      const user = authData?.user || authData?.teacher;

      console.log("Utilisateur connecté:", user);
      showToast(`Bienvenue, ${user?.fullName} !`);

      // Redirection intelligente selon le rôle
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
            <h1 style={{ 
              fontSize: "2.5rem", 
              marginBottom: "0.5rem", 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px" 
            }}>
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: "var(--primary)", marginBottom: "5px" }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Connexion
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>Accédez à votre espace éducatif</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form" style={{ margin: "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Email ou Matricule</label>
              <input 
                type="text" 
                placeholder="votre@email.com ou matricule" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#000",
                    transition: "color 0.2s"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    {!showPassword && <line x1="1" y1="1" x2="23" y2="23" strokeWidth="3" stroke="white" />}
                    {!showPassword && <line x1="1" y1="1" x2="23" y2="23" />}
                  </svg>
                </button>
              </div>
            </div>

            {error && <p className="error-text" style={{ color: "#ff5252", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>}
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: "1rem", padding: "1rem" }} 
              disabled={loading}
            >
              {loading ? "Chargement..." : "Se connecter"}
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
            Besoin d'aide ? Contactez l'administration de votre école.
          </p>
        </div>
      </main>
    </>
  );
}
export default LoginPage;