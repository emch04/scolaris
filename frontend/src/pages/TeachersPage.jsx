import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getTeachersRequest, deleteTeacherRequest } from "../services/teacher.api";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

function TeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [resTeachers, resSchools] = await Promise.all([
        getTeachersRequest(),
        getSchoolsRequest()
      ]);
      setTeachers(resTeachers?.data || []);
      setSchools(resSchools?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce compte personnel ?")) return;
    try {
      await deleteTeacherRequest(id);
      showToast("Compte supprimé.");
      fetchData();
    } catch (err) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Gestion du Personnel
          </h1>
          <p style={{ opacity: 0.6 }}>Administrez les comptes enseignants et directeurs du réseau</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(0, 102, 204, 0.1)", 
            border: "1px solid var(--primary)", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary)" }}>{teachers.length}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Membres Staff</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>Actifs dans le réseau</div>
            </div>
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="grid">
            {teachers.map(t => (
              <div key={t._id} style={{ 
                background: "transparent", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "3px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.6rem", padding: "3px 8px", borderRadius: "4px", background: t.role === "teacher" ? "#34A853" : "#F9AB00", fontWeight: "bold", textTransform: "uppercase" }}>
                      {t.role === "teacher" ? "Professeur" : "Direction"}
                    </span>
                  </div>
                  <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>{t.fullName}</h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1rem" }}>{t.email}</p>
                  
                  <div style={{ fontSize: "0.8rem", opacity: 0.7, display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    {t.school?.name || "Réseau Global"}
                  </div>
                </div>

                {user.role === "super_admin" && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="btn" 
                      style={{ width: "100%", background: "rgba(255,82,82,0.1)", color: "#ff5252", border: "1px solid #ff5252", padding: "8px", fontSize: "0.8rem" }}
                    >
                      Supprimer l'accès
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default TeachersPage;
