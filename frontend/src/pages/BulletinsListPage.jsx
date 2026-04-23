import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentsRequest } from "../services/student.api";
import { getParentDashboardRequest } from "../services/parent.api";
import { getCommunicationsRequest } from "../services/communication.api"; // Optionnel
import useAuth from "../hooks/useAuth";

function BulletinsListPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const isStaff = user?.role !== "parent";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user?.role === "parent") {
          const res = await getParentDashboardRequest();
          setStudents(res?.data?.children || []);
        } else {
          const res = await getStudentsRequest();
          setStudents(res?.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {isStaff ? "Tableau de Bord des Résultats" : "Bulletins de mes Enfants"}
          </h1>
          <p style={{ opacity: 0.6 }}>
            {isStaff ? "Vue d'ensemble des performances de tous les élèves" : "Consultez les résultats officiels de vos enfants"}
          </p>
        </div>

        {loading ? <Loader /> : (
          <div style={{ marginTop: "2rem" }}>
            {isStaff ? (
              /* VUE PROF / ECOLE : Tableau de Gestion */
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)", textAlign: "left" }}>
                      <th style={{ padding: "1.5rem" }}>Élève</th>
                      <th style={{ padding: "1.5rem" }}>Matricule</th>
                      <th style={{ padding: "1.5rem" }}>Classe</th>
                      <th style={{ padding: "1.5rem" }}>Parent</th>
                      <th style={{ padding: "1.5rem", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "1.2rem" }}>
                          <div style={{ fontWeight: "bold" }}>{s.fullName}</div>
                        </td>
                        <td style={{ padding: "1.2rem", opacity: 0.6, fontSize: "0.85rem" }}>{s.matricule}</td>
                        <td style={{ padding: "1.2rem" }}>{s.classroom?.name}</td>
                        <td style={{ padding: "1.2rem", fontSize: "0.9rem" }}>
                          <div>{s.parentName}</div>
                          <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{s.parentPhone}</div>
                        </td>
                        <td style={{ padding: "1.2rem", textAlign: "center" }}>
                          <Link to={`/bulletin/${s._id}`} style={{ 
                            background: "var(--primary)", 
                            color: "white", 
                            padding: "8px 15px", 
                            borderRadius: "6px", 
                            fontSize: "0.8rem", 
                            fontWeight: "bold",
                            textDecoration: "none"
                          }}>
                            Ouvrir Bulletin →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* VUE PARENT : Cartes simples */
              <div className="grid">
                {students.map(s => (
                  <Link key={s._id} to={`/bulletin/${s._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ 
                      background: "rgba(255, 255, 255, 0.05)", 
                      padding: "2rem", 
                      borderRadius: "15px", 
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📜</div>
                      <h3>{s.fullName}</h3>
                      <p style={{ opacity: 0.5 }}>{s.matricule}</p>
                      <button className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>Voir le Bulletin</button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default BulletinsListPage;
