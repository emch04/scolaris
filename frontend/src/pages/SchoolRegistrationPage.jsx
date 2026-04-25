/**
 * @file SchoolRegistrationPage.jsx
 * @description Page permettant l'enregistrement de nouveaux établissements scolaires sur la plateforme.
 */

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createSchoolRequest } from "../services/school.api";

function SchoolRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    commune: "Tshangu",
    principalName: "",
    phone: "",
    email: "",
    description: "",
    adminFullName: "",
    adminEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createSchoolRequest(formData);
      setSubmitted(true);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ textAlign: "center", padding: "8rem 1.5rem" }}>
          <div style={{ background: "rgba(52, 168, 83, 0.1)", padding: "4rem", borderRadius: "30px", border: "1px solid #34A853" }}>
            <h1 style={{ color: "#34A853", marginBottom: "1.5rem" }}>Demande Envoyée !</h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>
              Merci d'avoir inscrit votre établissement sur Scolaris. Votre demande est en cours de validation 
              par notre équipe administrative. Vous recevrez un email de confirmation prochainement.
            </p>
            <button onClick={() => window.location.href = "/"} className="btn btn-primary" style={{ marginTop: "2rem" }}>
              Retour à l'accueil
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 8vw, 3rem)" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)", fontWeight: "900", marginBottom: "0.8rem", lineHeight: "1.1" }}>Inscrire mon École</h1>
          <p style={{ opacity: 0.6, fontSize: "clamp(0.9rem, 4vw, 1.1rem)" }}>Numérisez votre établissement dès maintenant.</p>
        </div>

        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: "700px", display: "grid", gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr", gap: "1.2rem", padding: "1.5rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "0.5rem", fontSize: "1.1rem" }}>L'Établissement</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Nom de l'école</label>
            <input type="text" required placeholder="Ex: CS Les Étoiles" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Commune</label>
            <input type="text" required value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Adresse complète</label>
            <input type="text" required placeholder="Avenue, Quartier, Référence" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Préfet / Directeur</label>
            <input type="text" required value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Téléphone</label>
            <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Description</label>
            <textarea style={{ minHeight: "80px", padding: "10px", fontSize: "0.9rem" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Responsable</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Nom Complet</label>
            <input type="text" required value={formData.adminFullName} onChange={e => setFormData({...formData, adminFullName: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Email</label>
            <input type="email" required value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} style={{ padding: "10px", fontSize: "0.9rem" }} />
          </div>

          {error && <p style={{ color: "#ff5252", gridColumn: "1 / -1", textAlign: "center", fontSize: "0.85rem" }}>{error}</p>}

          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "1rem" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "1rem 2rem", width: "100%", maxWidth: "400px", fontWeight: "bold" }} disabled={loading}>
              {loading ? "Envoi..." : "Soumettre la demande"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default SchoolRegistrationPage;