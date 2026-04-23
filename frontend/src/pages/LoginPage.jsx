import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(email, password);
      const user = response?.data?.user;

      // Redirection intelligente selon le rôle
      if (user?.role === "parent") {
        navigate("/parent/dashboard");
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
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Connexion</h1>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>Accédez à votre espace éducatif</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form" style={{ margin: "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Email</label>
              <input 
                type="email" 
                placeholder="votre@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
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