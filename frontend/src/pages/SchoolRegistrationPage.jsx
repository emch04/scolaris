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
      <main className="container" style={{ padding: "4rem 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1rem" }}>Inscrire mon École</h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Rejoignez le réseau Scolaris et numérisez votre établissement.</p>
        </div>

        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: "800px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>Informations de l'Établissement</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Nom de l'école</label>
            <input type="text" required placeholder="Ex: CS Les Étoiles" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Commune</label>
            <input type="text" required value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
            <label>Adresse complète</label>
            <input type="text" required placeholder="Avenue, Quartier, Référence" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Nom du Préfet / Directeur</label>
            <input type="text" required value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Téléphone de contact</label>
            <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
            <label>Description (Bref aperçu)</label>
            <textarea style={{ minHeight: "100px" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>Responsable Administratif</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Nom de l'administrateur</label>
            <input type="text" required value={formData.adminFullName} onChange={e => setFormData({...formData, adminFullName: e.target.value})} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>Email de l'administrateur</label>
            <input type="email" required value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} />
          </div>

          {error && <p style={{ color: "#ff5252", gridColumn: "1 / -1", textAlign: "center" }}>{error}</p>}

          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "2rem" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "1.2rem 4rem" }} disabled={loading}>
              {loading ? "Envoi en cours..." : "Soumettre ma demande d'inscription"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default SchoolRegistrationPage;