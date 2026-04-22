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
    try { await login(email, password); navigate("/dashboard"); }
    catch (err) { setError(err?.response?.data?.message || "Échec de la connexion."); }
  };
  return (
    <>
      <Navbar />
      <main className="container form-container">
        <h1>Connexion enseignant</h1>
        <form onSubmit={handleSubmit} className="form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>{loading ? "Chargement..." : "Se connecter"}</button>
        </form>
      </main>
    </>
  );
}
export default LoginPage;
