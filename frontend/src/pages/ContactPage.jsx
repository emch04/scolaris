/**
 * @file ContactPage.jsx
 * @description Page de contact pour joindre l'administration ou le support technique.
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getSchoolByIdRequest, getSchoolsRequest } from "../services/school.api";
import { getParentDashboardRequest } from "../services/parent.api";
import useAuth from "../hooks/useAuth";

function ContactPage() {
  const { user, isAuthenticated } = useAuth();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        let schoolId = null;

        if (isAuthenticated) {
          if (user?.role === "parent") {
            const parentData = await getParentDashboardRequest();
            if (parentData?.data?.children?.length > 0) {
              // On récupère l'école de l'enfant
              schoolId = parentData.data.children[0].school?._id || parentData.data.children[0].school;
            }
          } else {
            schoolId = user?.school;
          }
        }

        if (schoolId) {
          const res = await getSchoolByIdRequest(schoolId);
          setSchool(res?.data);
        } else {
          // Correction de l'extraction des données paginées
          const res = await getSchoolsRequest(1, 1);
          const schoolList = res?.data?.schools || res?.data || [];
          if (schoolList.length > 0) setSchool(schoolList[0]);
        }
      } catch (err) {
        console.error("Erreur chargement école", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolData();
  }, [user, isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>Contact - Scolaris</title>
      </Helmet>
      <Navbar />
      <main className="container" style={{ padding: "clamp(2rem, 8vw, 4rem) 1.5rem" }}>
        {loading ? <Loader /> : school ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 10vw, 4rem)" }}>
              <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: "1.1" }}>
                Contact & Informations
              </h1>
              <p style={{ opacity: 0.6, fontSize: "clamp(0.9rem, 4vw, 1.1rem)", marginTop: "0.5rem" }}>Lien direct avec votre établissement</p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "1.5rem",
              alignItems: "stretch"
            }}>
              
              {/* Carte 1 : Présentation */}
              <div style={{ padding: "1.5rem", borderRadius: "25px", border: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.4rem", marginBottom: "1rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    {school.name}
                  </h2>
                  <p style={{ lineHeight: "1.6", opacity: 0.8, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    {school.description || "Un établissement d'excellence engagé dans la formation intégrale de la jeunesse. Discipline, Travail et Réussite."}
                  </p>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                  <h4 style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "1px", marginBottom: "3px" }}>Direction</h4>
                  <p style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>{school.principalName || "Non renseigné"}</p>
                </div>
              </div>

              {/* Carte 2 : Actions & Coordonnées */}
              <div style={{ padding: "1.5rem", borderRadius: "25px", border: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Canaux de communication</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  
                  {/* Adresse */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.7rem", opacity: 0.5, margin: 0 }}>Adresse</p>
                      <p style={{ fontWeight: "500", fontSize: "0.85rem", margin: 0 }}>{school.address}, {school.commune}</p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <a href={`tel:${school.phone?.replace(/\s+/g, '')}`} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "12px", background: "rgba(52, 168, 83, 0.08)", textDecoration: "none", color: "inherit" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(52, 168, 83, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34A853", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.7rem", opacity: 0.5, margin: 0 }}>Téléphone</p>
                      <p style={{ fontWeight: "700", fontSize: "0.95rem", color: "#34A853", margin: 0 }}>{school.phone || "+243..."}</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href={`mailto:${school.email}`} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "12px", background: "rgba(249, 171, 0, 0.08)", textDecoration: "none", color: "inherit" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(249, 171, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F9AB00", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.7rem", opacity: 0.5, margin: 0 }}>Email</p>
                      <p style={{ fontWeight: "700", fontSize: "0.95rem", color: "#F9AB00", margin: 0, wordBreak: "break-all" }}>{school.email || "contact@ecole.cd"}</p>
                    </div>
                  </a>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "0.5rem", textAlign: "center", opacity: 0.4, fontSize: "0.75rem" }}>
                  Code : <strong>{school.code}</strong>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p>Aucune information disponible pour cet établissement.</p>
          </div>
        )}
      </main>
      
      <style>{`
        .contact-link:hover {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          transform: translateX(5px);
        }
      `}</style>
    </>
  );
}

export default ContactPage;
