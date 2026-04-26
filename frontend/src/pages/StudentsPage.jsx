/**
 * @file StudentsPage.jsx
 * @description Page de gestion de la liste des élèves de l'établissement.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getStudentsRequest, createStudentRequest } from "../services/student.api";
import { getSchoolsRequest } from "../services/school.api";
import { getClassroomsRequest } from "../services/classroom.api";
import { addStudentResultRequest } from "../services/result.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";

/**
 * StudentsPage.jsx
 * Rôle : Gestion centrale des élèves du réseau ou de l'école.
 * Permet l'inscription de nouveaux élèves (Admin/Directeur) 
 * et la saisie des notes (Enseignants/Staff).
 */
function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  // États pour la pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 20
  });

  // Gestion du formulaire de saisie des notes
  const [showScoreForm, setShowScoreForm] = useState(null);
  const [scoreData, setScoreForm] = useState({
    subject: "",
    score: "",
    maxScore: 20,
    appreciation: "",
    period: "Trimestre 1"
  });

  // État du formulaire d'inscription (Admin uniquement)
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "M",
    birthDate: "",
    parentName: "",
    parentPhone: "",
    school: "",
    classroom: ""
  });

  /**
   * fetchData
   * Logique : Charge les données paginées.
   */
  const fetchData = async (pageNum = 1, search = searchTerm) => {
    try {
      const [resStudents, resSchools, resClassrooms] = await Promise.all([
        getStudentsRequest(pageNum, 20, search),
        getSchoolsRequest(1, 100),
        getClassroomsRequest(1, 100)
      ]);
      
      const studentsData = resStudents?.data?.students || [];
      const pagin = resStudents?.data?.pagination || { total: 0, totalPages: 0, limit: 20, page: pageNum };
      
      setStudents(studentsData);
      setPagination(pagin);
      setSchools(resSchools?.data?.schools || []);
      
      // Correction ici : l'API renvoie { classrooms, pagination }
      setClassrooms(resClassrooms?.data?.classrooms || resClassrooms?.data || []);
    } catch (err) {
      showToast("Erreur lors du chargement des données.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  /**
   * handleSearch
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setLoading(true);
    fetchData(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit
   * Logique : Crée un nouvel élève en base de données.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createStudentRequest(formData);
      showToast("Élève inscrit avec succès.");
      setFormData({
        fullName: "",
        gender: "M",
        birthDate: "",
        parentName: "",
        parentPhone: "",
        school: "",
        classroom: ""
      });
      fetchData(1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Erreur lors de la création.", "error");
    } finally {
      setSaving(false);
    }
  };

  /**
   * handleAddScore
   * Logique : Enregistre une note d'évaluation pour un élève spécifique.
   */
  const handleAddScore = async (e, studentId) => {
    e.preventDefault();
    try {
      await addStudentResultRequest({
        ...scoreData,
        student: studentId,
        teacher: user.id
      });
      showToast("Note ajoutée avec succès !");
      setShowScoreForm(null);
      setScoreForm({ subject: "", score: "", maxScore: 20, appreciation: "", period: "Trimestre 1" });
    } catch (err) {
      showToast("Erreur lors de l'ajout de la note.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#34A853" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Gestion des Élèves
          </h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>Inscrivez et gérez le suivi des élèves du réseau</p>
        </div>

        {/* Mini Stats Panel */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ 
            background: "rgba(52, 168, 83, 0.1)", 
            border: "1px solid #34A853", 
            padding: "1rem 2rem", 
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#34A853" }}>{pagination.total}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", opacity: 0.7 }}>Élèves</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{searchTerm ? "Résultats trouvés" : "Effectif total actuel"}</div>
            </div>
          </div>
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
            placeholder="Rechercher par nom ou matricule..." 
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

        {/* Formulaire d'inscription (Réservé Admin / Directeur) */}
        {["admin", "director"].includes(user?.role) && (
          <div style={{ 
            background: "transparent", 
            padding: "1.2rem", 
            borderRadius: "20px", 
            border: "1px solid rgba(255, 255, 255, 0.12)",
            marginBottom: "2.5rem"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>Inscrire un nouvel élève</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Nom complet</label>
                  <input type="text" name="fullName" placeholder="Ex: Jean Mukendi" value={formData.fullName} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Sexe</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", cursor: "pointer", fontSize: "0.9rem" }} required>
                    <option value="M" style={{ background: "white", color: "#222" }}>Masculin</option>
                    <option value="F" style={{ background: "white", color: "#222" }}>Féminin</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Date de naissance</label>
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Nom du parent</label>
                  <input type="text" name="parentName" placeholder="Ex: Marie Kabange" value={formData.parentName} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Téléphone parent</label>
                  <input type="text" name="parentPhone" placeholder="Ex: +243..." value={formData.parentPhone} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Établissement</label>
                  <select name="school" value={formData.school} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", cursor: "pointer", fontSize: "0.9rem" }} required>
                    <option value="" style={{ background: "white", color: "#222" }}>Sélectionner une école</option>
                    {schools.map(s => <option key={s._id} value={s._id} style={{ background: "white", color: "#222" }}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", opacity: 0.7 }}>Classe</label>
                  <select name="classroom" value={formData.classroom} onChange={handleChange} style={{ background: "white", border: "1px solid #ccc", padding: "0.6rem", borderRadius: "8px", color: "#222", cursor: "pointer", fontSize: "0.9rem" }} required>
                    <option value="" style={{ background: "white", color: "#222" }}>Sélectionner une classe</option>
                    {classrooms.map(c => <option key={c._id} value={c._id} style={{ background: "white", color: "#222" }}>{c.name} ({c.level})</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "0.6rem 1.5rem", fontSize: "0.9rem" }} disabled={saving}>
                {saving ? "Enregistrement..." : "Inscrire l'élève"}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <h2 style={{ fontSize: "1.3rem" }}>Élèves inscrits</h2>
          <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>{pagination.total} élèves au total</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}><Loader /></div>
        ) : (
          <>
            <div className="grid">
              {students.length === 0 ? (
                <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "3rem", opacity: 0.5 }}>Aucun résultat trouvé.</p>
              ) : (
                students.map(s => (
                  <div key={s._id} style={{ 
                    background: "transparent", 
                    padding: "1.2rem", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(255, 255, 255, 0.12)"
                  }}>
                    <div style={{ fontSize: "0.65rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "0.4rem" }}>{s.matricule}</div>
                    <h3 style={{ marginBottom: "0.8rem", fontSize: "1.1rem" }}>{s.fullName}</h3>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <strong>Classe:</strong> {s.classroom?.name || "N/A"}
                      </p>
                      <p style={{ marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <strong>Parent:</strong> {s.parentName || "N/A"}
                      </p>
                      <p style={{ marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <strong>Tél:</strong> {s.parentPhone || "N/A"}
                      </p>
                    </div>
                    <div style={{ 
                      marginTop: "1.2rem", 
                      paddingTop: "0.8rem", 
                      borderTop: "1px solid rgba(255,255,255,0.1)" 
                    }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <a 
                          href={s.parentPhone ? `https://wa.me/${s.parentPhone.replace(/\s+/g, '')}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: s.parentPhone ? "#25D356" : "#333", 
                            color: "white", 
                            padding: "0.5rem", 
                            borderRadius: "8px", 
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            textDecoration: "none",
                            opacity: s.parentPhone ? 1 : 0.3
                          }}
                        >
                          WhatsApp
                        </a>
                        <button 
                          onClick={() => setShowScoreForm(showScoreForm === s._id ? null : s._id)}
                          style={{ 
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "#34A853", 
                            color: "white", 
                            border: "none",
                            padding: "0.5rem", 
                            borderRadius: "8px", 
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                          }}
                        >
                          Note
                        </button>
                      </div>

                      {showScoreForm === s._id && (
                        <form onSubmit={(e) => handleAddScore(e, s._id)} style={{ 
                          marginTop: "15px", 
                          background: "rgba(255,255,255,0.05)", 
                          padding: "15px", 
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px"
                        }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "2px", color: "var(--primary)" }}>NOTES</div>
                          
                          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <input
                              placeholder="Matière"
                              list="subjects-list"
                              value={scoreData.subject}
                              onChange={e => setScoreForm({...scoreData, subject: e.target.value})}
                              style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "8px", fontSize: "0.85rem", borderRadius: "6px" }}
                              required
                            />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <input 
                              type="number"
                              placeholder="Note" 
                              value={scoreData.score}
                              onChange={e => setScoreForm({...scoreData, score: e.target.value})}
                              style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "8px", fontSize: "0.85rem", borderRadius: "6px" }}
                              required
                            />
                            <input 
                              type="number"
                              placeholder="Max" 
                              value={scoreData.maxScore}
                              onChange={e => setScoreForm({...scoreData, maxScore: e.target.value})}
                              style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "8px", fontSize: "0.85rem", borderRadius: "6px" }}
                              required
                            />
                          </div>

                          <select 
                            value={scoreData.period}
                            onChange={e => setScoreForm({...scoreData, period: e.target.value})}
                            style={{ background: "white", color: "#222", border: "1px solid #ccc", padding: "8px", fontSize: "0.85rem", borderRadius: "6px" }}
                          >
                            <option value="Trimestre 1">T1</option>
                            <option value="Trimestre 2">T2</option>
                            <option value="Trimestre 3">T3</option>
                            <option value="Examen État">Examen</option>
                          </select>

                          <button type="submit" className="btn btn-primary" style={{ padding: "10px", fontSize: "0.8rem", fontWeight: "bold" }}>
                            ENREGISTRER
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Contrôles de Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem", paddingBottom: "2rem" }}>
                <button 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page === 1}
                  className="btn"
                  style={{ background: "rgba(255,255,255,0.05)", color: "white", padding: "8px 15px", borderRadius: "10px", opacity: page === 1 ? 0.3 : 1 }}
                >
                  ← Précédent
                </button>
                <span style={{ fontSize: "0.9rem", fontWeight: "bold", opacity: 0.7 }}>
                  Page {page} sur {pagination.totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page === pagination.totalPages}
                  className="btn"
                  style={{ background: "rgba(255,255,255,0.05)", color: "white", padding: "8px 15px", borderRadius: "10px", opacity: page === pagination.totalPages ? 0.3 : 1 }}
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

export default StudentsPage;
