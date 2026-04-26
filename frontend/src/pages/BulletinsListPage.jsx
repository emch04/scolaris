/**
 * @file BulletinsListPage.jsx
 * @description Page listant les bulletins scolaires disponibles pour consultation.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentsRequest } from "../services/student.api";
import { getParentDashboardRequest } from "../services/parent.api";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

function BulletinsListPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const isStaff = user?.role !== "parent";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user?.role === "parent") {
          const res = await getParentDashboardRequest();
          setStudents(res?.data?.children || []);
        } else {
          // Correction de l'extraction des données paginées
          const res = await getStudentsRequest(1, 100);
          setStudents(res?.data?.students || res?.data || []);
        }
      } catch (err) {
        showToast("Erreur lors du chargement des élèves.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "1.5rem" }}>
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {isStaff ? "Résultats" : "Mes Enfants"}
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>
            {isStaff ? "Vue d'ensemble des performances" : "Consultez les résultats officiels"}
          </p>
        </div>

        {loading ? <Loader /> : (
          <div style={{ marginTop: "1rem" }}>
            {isStaff ? (
              /* VUE STAFF : Grille de cartes au lieu de tableau */
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {students.length === 0 ? (
                  <p style={{ textAlign: "center", gridColumn: "1/-1", opacity: 0.5 }}>Aucun élève trouvé.</p>
                ) : (
                  students.map(s => (
                    <div key={s._id} style={{ 
                      background: "rgba(255,255,255,0.02)", 
                      padding: "1.2rem", 
                      borderRadius: "16px", 
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{s.fullName}</h3>
                          <p style={{ margin: "2px 0 0", fontSize: "0.7rem", opacity: 0.5, fontWeight: "bold" }}>{s.matricule}</p>
                        </div>
                        <div style={{ background: "rgba(26, 115, 232, 0.1)", color: "var(--primary)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                          {s.classroom?.name}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: "0.85rem", opacity: 0.7, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ margin: 0 }}><strong>Parent:</strong> {s.parentName}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.8rem" }}>{s.parentPhone}</p>
                      </div>

                      <Link to={`/bulletin/${s._id}`} className="btn btn-primary" style={{ width: "100%", textAlign: "center", padding: "10px", fontSize: "0.85rem" }}>
                        Ouvrir Bulletin →
                      </Link>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* VUE PARENT : Cartes optimisées */
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
                {students.length === 0 ? (
                  <p style={{ textAlign: "center", gridColumn: "1/-1", opacity: 0.5 }}>Aucun enfant rattaché.</p>
                ) : (
                  students.map(s => (
                    <div key={s._id} style={{ 
                      background: "rgba(255,255,255,0.02)", 
                      padding: "1.5rem", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textAlign: "center"
                    }}>
                      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "60px", height: "60px", background: "rgba(26, 115, 232, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                      </div>
                      <h3 style={{ margin: "0 0 5px 0" }}>{s.fullName}</h3>
                      <p style={{ opacity: 0.5, fontSize: "0.85rem", marginBottom: "1.5rem" }}>{s.matricule}</p>
                      <Link to={`/bulletin/${s._id}`} className="btn btn-primary" style={{ width: "100%", display: "block" }}>
                        Voir le Bulletin
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default BulletinsListPage;
