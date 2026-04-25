/**
 * @file ContactPage.jsx
 * @description Page de contact pour joindre l'administration ou le support technique.
 */

import { useEffect, useState } from "react";
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
              schoolId = parentData.data.children[0].school?._id;
            }
          } else {
            schoolId = user?.school;
          }
        }

        if (schoolId) {
          const res = await getSchoolByIdRequest(schoolId);
          setSchool(res?.data);
        } else {
          const res = await getSchoolsRequest();
          if (res?.data?.length > 0) setSchool(res.data[0]);
        }
      } catch (err) {
        console.error("Erreur chargement école");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolData();
  }, [user, isAuthenticated]);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "3rem 1.5rem" }}>
        {loading ? <Loader /> : school ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h1 style={{ fontSize: "3rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Contact & Informations
              </h1>
              <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Lien direct avec votre établissement scolaire</p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
              gap: "2rem",
              alignItems: "stretch" // Force la même hauteur pour toutes les cartes
            }}>
              
              {/* Carte 1 : Présentation */}
              <div style={{ padding: "2.5rem", borderRadius: "25px", border: "3px solid rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    {school.name}
                  </h2>
                  <p style={{ lineHeight: "1.8", opacity: 0.8, fontSize: "1.05rem", marginBottom: "2rem" }}>
                    {school.description || "Un établissement d'excellence engagé dans la formation intégrale de la jeunesse congolaise. Nous prônons la discipline, le travail et la réussite."}
                  </p>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
                  <h4 style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px", marginBottom: "0.5rem" }}>Directeur / Préfet</h4>
                  <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>{school.principalName || "Non renseigné"}</p>
                </div>
              </div>

              {/* Carte 2 : Actions & Coordonnées */}
              <div style={{ padding: "2.5rem", borderRadius: "25px", border: "3px solid rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", gap: "2rem", height: "100%" }}>
                <h3 style={{ fontSize: "1.5rem" }}>Canaux de communication</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Adresse */}
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "15px", background: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>Adresse de l'établissement</p>
                      <p style={{ fontWeight: "500" }}>{school.address}, {school.commune}</p>
                    </div>
                  </div>

                  {/* Téléphone (Cliquable) */}
                  <a href={`tel:${school.phone?.replace(/\s/g, '')}`} style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", color: "inherit", transition: "0.2s" }} className="contact-link">
                    <div style={{ width: "50px", height: "50px", borderRadius: "15px", background: "rgba(52, 168, 83, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34A853" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>Téléphone (Cliquer pour appeler)</p>
                      <p style={{ fontWeight: "700", fontSize: "1.1rem", color: "#34A853" }}>{school.phone || "+243 000 000 000"}</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>

                  {/* Email (Cliquable) */}
                  <a href={`mailto:${school.email}`} style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", color: "inherit", transition: "0.2s" }} className="contact-link">
                    <div style={{ width: "50px", height: "50px", borderRadius: "15px", background: "rgba(249, 171, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F9AB00" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>Email (Cliquer pour écrire)</p>
                      <p style={{ fontWeight: "700", fontSize: "1.1rem", color: "#F9AB00" }}>{school.email || "contact@ecole.cd"}</p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9AB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "1rem", textAlign: "center", opacity: 0.4, fontSize: "0.85rem" }}>
                  Code d'établissement : <strong>{school.code}</strong>
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
