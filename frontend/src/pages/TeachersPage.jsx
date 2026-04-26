/**
 * @file TeachersPage.jsx
 * @description Page de gestion de la liste des enseignants.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getTeachersRequest, deleteTeacherRequest } from "../services/teacher.api";
import { getSchoolsRequest } from "../services/school.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

/**
 * TeachersPage.jsx
 * Rôle : Administration du personnel enseignant et de direction du réseau.
 * Affiche la liste des membres du staff et permet la suppression de comptes (Super Admin).
 */
function TeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  /**
   * fetchData
   * Logique : Récupère la liste paginée des enseignants et des écoles partenaires.
   */
  const fetchData = async (pageNum = 1, search = searchTerm) => {
    try {
      const [resTeachers, resSchools] = await Promise.all([
        getTeachersRequest(pageNum, 20, search),
        getSchoolsRequest(1, 100) // On prend les 100 premières écoles pour les labels si besoin
      ]);
      
      if (resTeachers?.data?.teachers) {
        setTeachers(resTeachers.data.teachers);
        setPagination(resTeachers.data.pagination);
      } else {
        setTeachers(resTeachers?.data || []);
      }
      
      setSchools(resSchools?.data?.schools || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect : Chargement initial.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * handleSearch
   * Logique : Déclenche la recherche avec un délai (debounce ou manuel).
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(1, searchTerm);
  };

  /**
   * handleDelete
   * Logique : Supprime un compte utilisateur après confirmation. 
   * Action critique réservée au Super Administrateur.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce compte personnel ?")) return;
    try {
      await deleteTeacherRequest(id);
      showToast("Compte supprimé.");
      fetchData(pagination.page);
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

        {/* Barre de Recherche */}
        <form onSubmit={handleSearch} style={{ 
          display: "flex", 
          maxWidth: "600px", 
          margin: "0 auto 3rem auto", 
          gap: "10px",
          background: "rgba(255,255,255,0.03)",
          padding: "8px",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              background: "transparent", 
              border: "none", 
              color: "white", 
              padding: "10px 15px", 
              outline: "none" 
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        {/* Panel récapitulatif */}
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
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary)" }}>{pagination.total}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Membres Staff</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{searchTerm ? "Résultats trouvés" : "Actifs dans le réseau"}</div>
            </div>
          </div>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="grid">
              {teachers.length === 0 ? (
                <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucun résultat trouvé pour cette recherche.</p>
              ) : (
                teachers.map(t => (
                  <div key={t._id} style={{ 
                    background: "transparent", 
                    padding: "1.2rem", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                        <span style={{ fontSize: "0.55rem", padding: "2px 6px", borderRadius: "4px", background: t.role === "teacher" ? "#34A853" : "#F9AB00", fontWeight: "bold", textTransform: "uppercase" }}>
                          {t.role === "teacher" ? "Professeur" : "Direction"}
                        </span>
                      </div>
                      <h3 style={{ marginBottom: "0.4rem", fontSize: "1.1rem" }}>{t.fullName}</h3>
                      <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "0.8rem" }}>{t.email}</p>
                      
                      <div style={{ fontSize: "0.75rem", opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        {t.school?.name || "Réseau Global"}
                      </div>
                    </div>

                    {/* Actions réservées au Super Admin */}
                    {user.role === "super_admin" && (
                      <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="btn btn-danger" 
                          style={{ width: "100%", fontSize: "0.75rem", padding: "6px" }}
                        >
                          Supprimer l'accès
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "3rem", paddingBottom: "2rem" }}>
                <button 
                  onClick={() => { setLoading(true); fetchData(pagination.page - 1); window.scrollTo(0,0); }}
                  disabled={pagination.page === 1}
                  className="btn"
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", opacity: pagination.page === 1 ? 0.3 : 1, cursor: pagination.page === 1 ? "not-allowed" : "pointer" }}
                >
                  ← Précédent
                </button>
                <span style={{ display: "flex", alignItems: "center", padding: "0 15px", fontSize: "0.9rem", opacity: 0.7, background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <button 
                  onClick={() => { setLoading(true); fetchData(pagination.page + 1); window.scrollTo(0,0); }}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn"
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", opacity: pagination.page === pagination.totalPages ? 0.3 : 1, cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer" }}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default TeachersPage;
