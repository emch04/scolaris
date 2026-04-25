/**
 * @file NetworkContactPage.jsx
 * @description Page listant les contacts du réseau scolaire (enseignants, administration).
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";

function NetworkContactPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getSchoolsRequest()
      .then(res => setSchools(res?.data || []))
      .catch(() => showToast("Erreur de chargement des contacts.", "error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: "1.1" }}>
            Annuaire du Réseau
          </h1>
          <p style={{ opacity: 0.6, fontSize: "clamp(0.9rem, 4vw, 1.1rem)", marginTop: "0.5rem" }}>Contacts officiels des établissements</p>
        </div>

        {loading ? <Loader /> : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {schools.map(s => (
              <div key={s._id} style={{ 
                background: "rgba(255,255,255,0.02)", 
                padding: "1.2rem", 
                borderRadius: "20px", 
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem"
              }}>
                <h3 style={{ color: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px", margin: 0, fontSize: "1.1rem" }}>{s.name}</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <div>
                      <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase" }}>Direction</div>
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{s.principalName || s.adminFullName || "Non renseigné"}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <div>
                      <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase" }}>Téléphone</div>
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{s.phone || "Non renseigné"}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <div>
                      <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase" }}>Localisation</div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{s.address}, {s.commune}</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "auto", display: "flex", gap: "8px", paddingTop: "10px" }}>
                  <a href={`tel:${s.phone}`} className="btn" style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.08)", fontSize: "0.75rem", padding: "8px" }}>Appeler</a>
                  <a href={`mailto:${s.email || s.adminEmail}`} className="btn" style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.08)", fontSize: "0.75rem", padding: "8px" }}>Email</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default NetworkContactPage;
